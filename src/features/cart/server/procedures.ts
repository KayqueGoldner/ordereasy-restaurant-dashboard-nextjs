import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { cart, cartDiscount, cartItems } from "@/db/schema/cart";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { users } from "@/db/schema/users";
import { TRPCError } from "@trpc/server";
import { products } from "@/db/schema/products";
import { categories } from "@/db/schema/categories";
import { discount } from "@/db/schema/discount";
import { stripe } from "@/lib/stripe";

export const cartRouter = createTRPCRouter({
  getData: baseProcedure.query(async ({ ctx }) => {
    const user = ctx.authUser;

    if (!user) {
      return {};
    }

    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, user?.id as string));

    const cartData = await db
      .select({
        id: cartItems.id,
        productId: cartItems.productId,
        name: products.name,
        description: products.description,
        categoryId: products.categoryId,
        categoryName: categories.name,
        imageUrl: products.imageUrl,
        price: cartItems.price,
        calories: products.calories,
        ingredients: products.ingredients,
        allergens: products.allergens,
        preparationTime: products.preparationTime,
        serves: products.serves,
        quantity: cartItems.quantity,
        note: cartItems.note,
      })
      .from(cartItems)
      .where(eq(cartItems.cartId, dbUser.cartId as string))
      .leftJoin(cart, eq(cartItems.cartId, cart.id))
      .leftJoin(products, eq(cartItems.productId, products.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(desc(cartItems.createdAt));

    const discounts = await db
      .select({
        id: cartDiscount.id,
        discountId: cartDiscount.discountId,
        amount: discount.amount,
        expires: discount.expires,
        used: cartDiscount.used,
      })
      .from(cartDiscount)
      .where(
        and(
          eq(cartDiscount.cartId, dbUser.cartId as string),
          eq(cartDiscount.used, false),
        ),
      )
      .leftJoin(discount, eq(discount.id, cartDiscount.discountId));

    return {
      cartData,
      discounts,
    };
  }),

  updateData: protectedProcedure
    .input(
      z.object({
        discountCode: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { discountCode } = input;

      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId as string));

      const [discountData] = await db
        .select()
        .from(discount)
        .where(eq(discount.code, discountCode))
        .limit(1);

      if (!discountData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Discount code invalid",
        });
      }

      if (discountData.expires && discountData.expires < new Date()) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Discount code expired",
        });
      }

      const cartDiscountData = await db
        .select({
          id: cartDiscount.id,
          discountId: discount.id,
          amount: discount.amount,
          used: cartDiscount.used,
          expires: discount.expires,
        })
        .from(cartDiscount)
        .leftJoin(discount, eq(discount.id, cartDiscount.discountId))
        .where(and(eq(cartDiscount.cartId, dbUser.cartId as string)));

      const existingCartDiscount = cartDiscountData.find(
        (item) => item.discountId === discountData.id,
      );

      if (existingCartDiscount) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Discount code already applied",
        });
      }

      const allDiscounts = [
        ...cartDiscountData.map((item) => {
          if (item.used) {
            return {
              amount: 0,
              expires: item.expires,
            };
          }

          return {
            amount: item.amount,
            expires: item.expires,
          };
        }),
        { amount: discountData.amount, expires: discountData.expires },
      ];
      const totalDiscount = allDiscounts.reduce(
        (acc, item) => acc + Number(item.amount),
        0,
      );

      const coupon = await stripe.coupons.create({
        amount_off: totalDiscount * 100,
        currency: "USD",
        duration: "once",
      });

      const promoCode = await stripe.promotionCodes.create({
        coupon: coupon.id,
        code: `ORDEREASY_${dbUser.cartId}_${Date.now()}`,
        max_redemptions: 1,
      });

      const data = await db
        .insert(cartDiscount)
        .values({
          cartId: dbUser.cartId as string,
          discountId: discountData.id,
        })
        .returning();

      await db
        .update(cart)
        .set({ stripePromoCodeId: promoCode.id })
        .where(eq(cart.id, dbUser.cartId as string));

      return { data };
    }),

  addItem: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        price: z.string(),
        quantity: z.number(),
        note: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { productId, price, quantity, note } = input;

      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId as string));

      const [existingItem] = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.productId, productId),
            eq(cartItems.cartId, dbUser.cartId as string),
          ),
        )
        .limit(1);

      if (existingItem) {
        const data = await db
          .update(cartItems)
          .set({ note, quantity })
          .where(
            and(
              eq(cartItems.productId, productId),
              eq(cartItems.cartId, dbUser.cartId as string),
            ),
          )
          .returning();

        return { data };
      }

      const data = await db
        .insert(cartItems)
        .values({
          cartId: dbUser.cartId as string,
          price,
          productId,
          quantity,
          note,
        })
        .returning();

      return { data };
    }),

  updateItem: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { productId, quantity } = input;

      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId as string));

      const [existingItem] = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.productId, productId),
            eq(cartItems.cartId, dbUser.cartId as string),
          ),
        )
        .limit(1);

      if (existingItem) {
        const data = await db
          .update(cartItems)
          .set({ quantity })
          .where(
            and(
              eq(cartItems.productId, productId),
              eq(cartItems.cartId, dbUser.cartId as string),
            ),
          )
          .returning();

        return { data };
      }

      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The product was not found",
      });
    }),

  removeItem: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { productId } = input;

      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId as string));

      const [existingItem] = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.productId, productId),
            eq(cartItems.cartId, dbUser.cartId as string),
          ),
        )
        .limit(1);

      if (existingItem) {
        const data = await db
          .delete(cartItems)
          .where(
            and(
              eq(cartItems.productId, productId),
              eq(cartItems.cartId, dbUser.cartId as string),
            ),
          )
          .returning();

        return { data };
      }

      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The product was not found",
      });
    }),
});
