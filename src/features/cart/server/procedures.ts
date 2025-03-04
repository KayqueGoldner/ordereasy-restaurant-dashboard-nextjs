import { z } from "zod";
import { and, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { cart, cartItems } from "@/db/schema/cart";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { users } from "@/db/schema/users";
import { products } from "@/db/schema/products";
import { TRPCError } from "@trpc/server";

export const cartRouter = createTRPCRouter({
  getData: baseProcedure.query(async ({ ctx }) => {
    const user = ctx.authUser;

    if (!user) {
      return {
        cart: undefined,
        items: undefined,
      };
    }

    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id as string));

    const [cartData] = await db
      .select()
      .from(cart)
      .where(eq(cart.id, dbUser.cartId as string));

    const cartItemsData = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, dbUser.cartId as string))
      .innerJoin(products, eq(cartItems.productId, products.id));

    return {
      cart: cartData,
      items: cartItemsData,
    };
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
