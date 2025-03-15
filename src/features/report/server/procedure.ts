import { desc, sql, and, eq, gte, lte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { discount } from "@/db/schema/discount";
import { products } from "@/db/schema/products";
import { users } from "@/db/schema/users";
import { order, orderItems } from "@/db/schema/order";

export const reportRouter = createTRPCRouter({
  getDiscounts: protectedProcedure.query(async ({ ctx }) => {
    const { role } = ctx.user;

    if (role !== "ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not authorized to access this resource",
      });
    }

    return db.select().from(discount).orderBy(desc(discount.createdAt));
  }),

  getSalesOverview: protectedProcedure
    .input(
      z.object({
        datePeriod: z.enum(["MONTHLY", "QUARTERLY", "YEARLY"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { role } = ctx.user;

      if (role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to access this resource",
        });
      }

      const { datePeriod } = input;

      const orderWhereFilter = and(
        eq(order.paymentStatus, "SUCCEEDED"),
        datePeriod === "MONTHLY"
          ? gte(order.createdAt, new Date(new Date().setDate(1)))
          : datePeriod === "QUARTERLY"
            ? gte(
                order.createdAt,
                new Date(
                  new Date().setMonth(
                    Math.floor(new Date().getMonth() / 3) * 3,
                  ),
                ),
              )
            : datePeriod === "YEARLY"
              ? gte(order.createdAt, new Date(new Date().setMonth(0)))
              : undefined,
      );

      const [query] = await db
        .select({
          totalSales: sql`coalesce(sum(${order.totalPrice}), 0)`
            .mapWith(Number)
            .as("totalSales"),
          orderCount: db.$count(order, orderWhereFilter).as("orderCount"),
          averageOrderValue: sql`coalesce(avg(${order.totalPrice}), 0)`
            .mapWith(Number)
            .as("averageOrderValue"),
          customersCount: sql`count(distinct ${order.userId})`
            .mapWith(Number)
            .as("customersCount"),
        })
        .from(order)
        .where(orderWhereFilter);

      return query;
    }),

  getTopProducts: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { role } = ctx.user;

      if (role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to access this resource",
        });
      }

      const { limit, startDate, endDate } = input;

      const query = await db
        .select({
          productId: orderItems.productId,
          productName: products.name,
          totalQuantity: sql`coalesce(sum(${orderItems.quantity}), 0)`
            .mapWith(Number)
            .as("totalQuantity"),
          totalRevenue: sql`coalesce(sum(${orderItems.price}), 0)`
            .mapWith(Number)
            .as("totalRevenue"),
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .innerJoin(order, eq(orderItems.orderId, order.id))
        .where(
          and(
            startDate ? gte(order.createdAt, startDate) : undefined,
            endDate ? lte(order.createdAt, endDate) : undefined,
          ),
        )
        .groupBy(orderItems.productId, products.name)
        .orderBy(desc(sql`totalQuantity`))
        .limit(limit);

      return query;
    }),

  getCustomerStats: protectedProcedure.query(async ({ ctx }) => {
    const { role } = ctx.user;

    if (role !== "ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not authorized to access this resource",
      });
    }

    const totalCustomers = await db
      .select({ count: sql`COUNT(*)` })
      .from(users)
      .where(eq(users.role, "CUSTOMER"));

    const newCustomersThisMonth = await db
      .select({ count: sql`COUNT(*)` })
      .from(users)
      .where(
        and(
          eq(users.role, "CUSTOMER"),
          gte(
            users.createdAt,
            new Date(new Date().setDate(1)), // First day of current month
          ),
        ),
      );

    return {
      totalCustomers: totalCustomers[0].count,
      newCustomersThisMonth: newCustomersThisMonth[0].count,
    };
  }),
});
