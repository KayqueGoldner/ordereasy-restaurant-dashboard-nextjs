import { z } from "zod";
import { desc, eq, getTableColumns } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { users } from "@/db/schema/users";
import { TRPCError } from "@trpc/server";
import { order, OrderStatusEnumValues } from "@/db/schema/order";

export const manageOrdersRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const { role } = ctx.user;

    if (role !== "ADMIN") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to view this resource",
      });
    }

    const orders = await db
      .select({
        ...getTableColumns(order),
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(order)
      .leftJoin(users, eq(order.userId, users.id))
      .orderBy(desc(order.createdAt));

    return orders;
  }),
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(OrderStatusEnumValues),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { role } = ctx.user;

      if (role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to view this resource",
        });
      }

      const { id, status } = input;

      const updatedOrder = await db
        .update(order)
        .set({
          status,
        })
        .where(eq(order.id, id))
        .returning();

      return updatedOrder;
    }),
});
