import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { users } from "@/db/schema/users";
import { TRPCError } from "@trpc/server";
import { order, orderItems, paymentProviderEnum } from "@/db/schema/order";
import { products } from "@/db/schema/products";
import { cartDiscount, cartItems } from "@/db/schema/cart";
import { stripe } from "@/lib/stripe";
import { STRIPE_TAX_RATE } from "@/constants";
import { discount } from "@/db/schema/discount";

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

      if (!dbUser.stripeCustomerId) {
        // create stripe customer
        const customer = await stripe.customers.create({
          email: dbUser.email!,
          name: dbUser.name!,
          address: {
            line1: dbUser.address,
          },
        });

        // update user with stripe customer id
        await db
          .update(users)
          .set({
            stripeCustomerId: customer.id,
          })
          .where(eq(users.id, userId as string));
      }

      const cartItemsData = await db
        .select({
          id: cartItems.id,
          productId: cartItems.productId,
          productName: products.name,
          productImageUrl: products.imageUrl,
          productDescription: products.description,
          productIsAvailable: products.isAvailable,
          cartId: cartItems.cartId,
          price: cartItems.price,
          quantity: cartItems.quantity,
          note: cartItems.note,
        })
        .from(cartItems)
        .where(eq(cartItems.cartId, dbUser.cartId))
        .leftJoin(products, eq(products.id, cartItems.productId));

      const cartDiscountData = await db
        .select({
          amount: discount.amount,
          stripePromoCodeId: discount.stripePromoCodeId,
        })
        .from(cartDiscount)
        .where(eq(cartDiscount.cartId, dbUser.cartId))
        .leftJoin(discount, eq(discount.id, cartDiscount.discountId));

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

      const totalDiscount = cartDiscountData?.reduce(
        (acc, discount) => acc + Number(discount.amount),
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

      const session = await stripe.checkout.sessions.create({
        customer: dbUser.stripeCustomerId as string,
        line_items: cartItemsData.map((item) => ({
          price_data: {
            currency: "USD",
            product_data: {
              name: item.productName!,
              description: item.productDescription!,
              images: [item.productImageUrl!],
            },
            unit_amount: parseFloat(item.price) * 100,
          },
          quantity: item.quantity,
          tax_rates: [STRIPE_TAX_RATE],
        })),
        currency: "USD",
        mode: "payment",
        discounts: cartDiscountData.map((discount) => ({
          promotion_code: discount.stripePromoCodeId || "",
        })),
        metadata: {
          orderId: newOrder.id,
        },
        success_url: `http://localhost:3000/`, // TODO: add success url
        cancel_url: "http://localhost:3000/", // TODO: add cancel url
      });

      await db
        .update(order)
        .set({
          sessionUrl: session.url,
        })
        .where(eq(order.id, newOrder.id));

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
