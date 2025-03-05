import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { cart, cartItems } from "@/db/schema/cart";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { users } from "@/db/schema/users";
import { TRPCError } from "@trpc/server";
import { products } from "@/db/schema/products";
import { categories } from "@/db/schema/categories";

export const cartRouter = createTRPCRouter({
  getData: baseProcedure.query(async ({ ctx }) => {
    const user = ctx.authUser;

    if (!user) {
      return [];
    }

    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, user?.id as string));

    const cartData = await db
      .select({
        id: cartItems.id,
        discounts: cart.discounts,
        productId: cartItems.productId,
        name: products.name,
        description: products.description,
        categoryId: products.categoryId,
        categoryName: categories.name,
        imageUrl: products.imageUrl,
        price: cartItems.price,
        quantity: cartItems.quantity,
        note: cartItems.note,
      })
      .from(cartItems)
      .where(eq(cartItems.cartId, dbUser.cartId as string))
      .leftJoin(cart, eq(cartItems.cartId, cart.id))
      .leftJoin(products, eq(cartItems.productId, products.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(desc(cartItems.createdAt));

    return cartData;
  }),

  updateData: protectedProcedure
    .input(
      z.object({
        discounts: z
          .object({
            code: z.string(),
            amount: z.number(),
          })
          .array()
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { discounts } = input;

      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId as string));

      const data = await db
        .update(cart)
        .set({ discounts })
        .where(eq(cart.id, dbUser.cartId as string))
        .returning();

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
