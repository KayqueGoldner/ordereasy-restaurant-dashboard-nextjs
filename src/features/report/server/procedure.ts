import { desc, sql, and, eq, gte, getTableColumns, lte } from "drizzle-orm";
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

  getSalesChartData: protectedProcedure
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

      // Determine the date format and period based on the selected date period
      let startDate;
      let groupByFormat;

      if (datePeriod === "MONTHLY") {
        // For monthly, group by day
        groupByFormat = "day";
        startDate = new Date(new Date().setDate(1)); // First day of current month
      } else if (datePeriod === "QUARTERLY") {
        // For quarterly, group by week
        groupByFormat = "week";
        startDate = new Date(
          new Date().setMonth(Math.floor(new Date().getMonth() / 3) * 3),
        );
      } else {
        // For yearly, group by month
        groupByFormat = "month";
        startDate = new Date(new Date().setMonth(0)); // First day of current year
      }

      const orderWhereFilter = and(
        eq(order.paymentStatus, "SUCCEEDED"),
        gte(order.createdAt, startDate),
      );

      // For monthly view, use date_trunc to ensure we're grouping by day properly
      const dateExpression =
        datePeriod === "MONTHLY"
          ? sql`date_trunc('day', ${order.createdAt})`
          : datePeriod === "QUARTERLY"
            ? sql`date_trunc('week', ${order.createdAt})`
            : sql`date_trunc('month', ${order.createdAt})`;

      // Query for sales data grouped by the appropriate time period
      const salesData = await db
        .select({
          // Use date_trunc for grouping and TO_CHAR for formatting
          periodFormatted:
            datePeriod === "MONTHLY"
              ? sql`TO_CHAR(date_trunc('day', ${order.createdAt}), 'YYYY-MM-DD')`.as(
                  "periodFormatted",
                )
              : datePeriod === "QUARTERLY"
                ? sql`TO_CHAR(date_trunc('week', ${order.createdAt}), 'YYYY-"W"IW')`.as(
                    "periodFormatted",
                  )
                : sql`TO_CHAR(date_trunc('month', ${order.createdAt}), 'YYYY-MM')`.as(
                    "periodFormatted",
                  ),
          period: dateExpression,
          totalSales: sql`coalesce(sum(${order.totalPrice}), 0)`
            .mapWith(Number)
            .as("totalSales"),
          orderCount: sql`count(${order.id})`.mapWith(Number).as("orderCount"),
          averageOrderValue: sql`coalesce(avg(${order.totalPrice}), 0)`
            .mapWith(Number)
            .as("averageOrderValue"),
          customersCount: sql`count(distinct ${order.userId})`
            .mapWith(Number)
            .as("customersCount"),
        })
        .from(order)
        .where(orderWhereFilter)
        // Group by the truncated date to ensure one entry per day/week/month
        .groupBy(dateExpression)
        .orderBy(dateExpression);

      // Transform the data for chart visualization
      const chartData = {
        labels: salesData.map((item) => item.periodFormatted),
        dates: salesData.map((item) => item.period),
        datasets: [
          {
            name: "Total Sales",
            data: salesData.map((item) => item.totalSales),
            type: "currency",
          },
          {
            name: "Order Count",
            data: salesData.map((item) => item.orderCount),
            type: "number",
          },
          {
            name: "Average Order Value",
            data: salesData.map((item) => item.averageOrderValue),
            type: "currency",
          },
          {
            name: "Customer Count",
            data: salesData.map((item) => item.customersCount),
            type: "number",
          },
        ],
        period: groupByFormat,
      };

      return chartData;
    }),

  getTopProducts: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(5),
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

      const { limit } = input;

      const query = await db
        .select({
          productId: orderItems.productId,
          productImage: products.imageUrl,
          productName: products.name,
          totalQuantity: sql`coalesce(sum(${orderItems.quantity}), 0)`
            .mapWith(Number)
            .as("totalQuantity"),
          totalRevenue:
            sql`coalesce(sum(${orderItems.price} * ${orderItems.quantity}), 0)`
              .mapWith(Number)
              .as("totalRevenue"),
          lastOrderDate: sql`max(${order.createdAt})`
            .mapWith(String)
            .as("lastOrderDate"),
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .innerJoin(order, eq(orderItems.orderId, order.id))
        .where(eq(order.paymentStatus, "SUCCEEDED"))
        .orderBy(sql`coalesce(sum(${orderItems.quantity}), 0) DESC`)
        .groupBy(orderItems.productId, products.name, products.imageUrl)
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

  getAllOrdes: protectedProcedure
    .input(
      z.object({
        datePeriod: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { role } = ctx.user;
      const { datePeriod } = input;

      if (role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to access this resource",
        });
      }

      type DatePeriod = { startDate: Date; endDate: Date };

      const { startDate, endDate } = datePeriod
        ? (Object.fromEntries(
            datePeriod.split("&").map((pair) => {
              const [key, value] = pair.split("=");
              return [key, new Date(value)];
            }),
          ) as DatePeriod)
        : {
            startDate: new Date(new Date().setDate(1)),
            endDate: new Date(),
          };

      const orders = await db
        .select({
          ...getTableColumns(order),
          user: {
            ...getTableColumns(users),
          },
        })
        .from(order)
        .innerJoin(users, eq(order.userId, users.id))
        .where(
          and(gte(order.createdAt, startDate), lte(order.createdAt, endDate)),
        )
        .orderBy(desc(order.orderNumber));

      return orders;
    }),
});
