import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { users } from "@/db/schema/users";
import { TRPCError } from "@trpc/server";
import { order, orderItems, paymentProviderEnum } from "@/db/schema/order";
import { products } from "@/db/schema/products";
import { cart, cartItems } from "@/db/schema/cart";

export const orderRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { orderId } = input;

      const existingOrder = await db
        .select({
          users,
          order,
          orderItems,
          productName: products.name,
        })
        .from(order)
        .where(and(eq(order.id, orderId), eq(order.userId, userId as string)))
        .leftJoin(users, eq(order.userId, users.id))
        .leftJoin(orderItems, eq(orderItems.orderId, order.id))
        .leftJoin(products, eq(products.id, orderItems.productId)); // Deixe como leftJoin para evitar dependência total

      return existingOrder;
    }),
  create: protectedProcedure
    .input(
      z.object({
        paymentProvider: z.enum(paymentProviderEnum.enumValues),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { paymentProvider } = input;

      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId as string));

      // should never happen
      if (!dbUser.cartId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cart not found",
        });
      }

      if (!dbUser.address) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "ADDRESS_ERROR",
        });
      }

      const [cartData] = await db
        .select()
        .from(cart)
        .where(eq(cart.id, dbUser.cartId));

      const cartItemsData = await db
        .select()
        .from(cartItems)
        .where(eq(cartItems.cartId, dbUser.cartId));

      if (cartItemsData.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cart is empty",
        });
      }

      const subTotal = cartItemsData.reduce(
        (acc, item) => acc + parseFloat(item.price) * item.quantity,
        0,
      );

      const cartDiscounts = cartData.discounts || [];
      const totalDiscount = cartDiscounts.reduce(
        (acc, discount) => acc + discount.amount,
        0,
      );

      const taxRate = 0.15;
      const tax = subTotal * taxRate;
      const totalPrice = subTotal - totalDiscount + tax;

      const lastOrder = await db
        .select({ orderNumber: order.orderNumber })
        .from(order)
        .orderBy(desc(order.orderNumber))
        .limit(1);

      const nextOrderNumber =
        lastOrder.length > 0 ? lastOrder[0].orderNumber + 1 : 1;

      const [newOrder] = await db
        .insert(order)
        .values({
          cartId: dbUser.cartId,
          orderNumber: nextOrderNumber,
          userId: dbUser.id,
          address: dbUser.address as string,
          status: "PENDING",
          paymentStatus: "PENDING",
          totalPrice: totalPrice.toFixed(2),
          subTotal: subTotal.toFixed(2),
          tax: tax.toFixed(2),
          totalDiscount: totalDiscount.toFixed(2),
          paymentProvider,
        })
        .returning();

      const newOrderItems = cartItemsData.map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        note: item.note,
      }));

      await db.insert(orderItems).values(newOrderItems);

      return newOrder;
    }),
});
