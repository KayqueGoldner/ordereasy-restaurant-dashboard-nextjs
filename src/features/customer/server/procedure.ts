import { desc, eq, getTableColumns } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { order, orderItems } from "@/db/schema/order";
import { products } from "@/db/schema/products";

export const customerRouter = createTRPCRouter({
  getOrders: protectedProcedure.query(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    const orders = await db
      .select({
        ...getTableColumns(order),
        orderItems: {
          ...getTableColumns(orderItems),
          productName: products.name,
          quantity: orderItems.quantity,
        },
      })
      .from(order)
      .leftJoin(orderItems, eq(orderItems.orderId, order.id))
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(order.userId, userId as string))
      .orderBy(desc(order.createdAt));

    return orders;
  }),
});
