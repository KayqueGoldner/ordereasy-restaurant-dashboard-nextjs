import Stripe from "stripe";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

import { stripe } from "@/lib/stripe";
import { db } from "@/db/drizzle";
import { order } from "@/db/schema/order";
import { cart, cartDiscount, cartItems } from "@/db/schema/cart";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();

  const signature = headersList.get("Stripe-Signature");

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return new Response("Webhook error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return new Response("No orderId found in session metadata", {
        status: 400,
      });
    }

    const [existingOrder] = await db
      .select()
      .from(order)
      .where(eq(order.id, orderId));

    if (!existingOrder) {
      return new Response("No order found", { status: 400 });
    }

    const [updatedOrder] = await db
      .update(order)
      .set({
        paymentDate: new Date(),
        paymentStatus: "SUCCEEDED",
        updatedAt: new Date(),
      })
      .where(eq(order.id, orderId))
      .returning();

    await db
      .update(cart)
      .set({ stripePromoCodeId: "" })
      .where(eq(cart.id, updatedOrder.cartId));

    await db
      .update(cartDiscount)
      .set({
        used: true,
      })
      .where(and(eq(cartDiscount.cartId, updatedOrder.cartId)));

    await db
      .delete(cartItems)
      .where(eq(cartItems.cartId, existingOrder.cartId));
  }

  return new Response(null, { status: 200 });
}
