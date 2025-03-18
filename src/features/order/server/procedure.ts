import { and, desc, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { users } from "@/db/schema/users";
import { TRPCError } from "@trpc/server";
import { order, orderItems, paymentProviderEnum } from "@/db/schema/order";
import { products } from "@/db/schema/products";
import { cart, cartDiscount, cartItems } from "@/db/schema/cart";
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
          productName: orderItems.name,
        })
        .from(order)
        .where(and(eq(order.id, orderId), eq(order.userId, userId as string)))
        .leftJoin(users, eq(order.userId, users.id))
        .leftJoin(orderItems, eq(orderItems.orderId, order.id));

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
        const customer = await stripe.customers.create({
          email: dbUser.email!,
          name: dbUser.name!,
          address: {
            line1: dbUser.address,
          },
        });

        await db
          .update(users)
          .set({
            stripeCustomerId: customer.id,
          })
          .where(eq(users.id, userId as string));
      }

      const allCartData = await db
        .select({
          ...getTableColumns(cart),
          cartItems: {
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
          },
        })
        .from(cart)
        .leftJoin(cartItems, eq(cartItems.cartId, dbUser.cartId))
        .leftJoin(products, eq(products.id, cartItems.productId))
        .where(eq(cart.id, dbUser.cartId));

      if (!allCartData.length) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cart is empty" });
      }

      const cartData = allCartData[0];
      const cartItemsData = allCartData.map((item) => item.cartItems);

      const cartDiscountData = await db
        .select({ amount: discount.amount })
        .from(cartDiscount)
        .where(
          and(
            eq(cartDiscount.cartId, dbUser.cartId),
            eq(cartDiscount.used, false),
          ),
        )
        .leftJoin(discount, eq(discount.id, cartDiscount.discountId));

      if (cartItemsData.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cart is empty",
        });
      }

      const totalDiscount = cartDiscountData.reduce(
        (acc, discount) => acc + Number(discount.amount),
        0,
      );
      const subTotal = cartItemsData.reduce(
        (acc, item) => acc + Number(item.price || 0) * (item.quantity || 0),
        0,
      );
      const subTotalAfterDiscount = subTotal - totalDiscount;
      const tax = subTotalAfterDiscount * 0.15; // 15% Tax
      let totalPrice = subTotalAfterDiscount + tax;
      totalPrice = Math.max(totalPrice, 0);

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

      const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/order/${newOrder.id}`;
      const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/order/${newOrder.id}`;

      const session = await stripe.checkout.sessions
        .create({
          customer: dbUser.stripeCustomerId as string,
          line_items: cartItemsData.map((item) => ({
            price_data: {
              currency: "USD",
              product_data: {
                name: item.productName!,
                description: item.productDescription!,
                images: [item.productImageUrl!],
              },
              unit_amount: Math.round(parseFloat(item.price || "0") * 100),
            },
            quantity: item.quantity || 0,
            tax_rates: [STRIPE_TAX_RATE],
          })),
          currency: "USD",
          mode: "payment",
          discounts: cartData.stripePromoCodeId
            ? [{ promotion_code: cartData.stripePromoCodeId }]
            : undefined,
          metadata: {
            orderId: newOrder.id,
          },
          success_url: successUrl,
          cancel_url: cancelUrl,
        })
        .catch(async (err) => {
          console.log(err);

          await db.delete(order).where(eq(order.id, newOrder.id));

          if (
            err.type === "StripeInvalidRequestError" &&
            err.code === "amount_too_small"
          ) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Cart amount is too small",
            });
          }
        });

      if (!session) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Stripe session not created",
        });
      }

      await Promise.all([
        db
          .update(order)
          .set({ sessionUrl: session.url })
          .where(eq(order.id, newOrder.id)),
        db.insert(orderItems).values(
          cartItemsData.map((item) => ({
            orderId: newOrder.id,
            productId: item.productId || "",
            name: item.productName!,
            quantity: item.quantity || 0,
            price: item.price || "0",
            note: item.note,
          })),
        ),
      ]);

      return newOrder;
    }),
});
