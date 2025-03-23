import { z } from "zod";
import { desc, eq, getTableColumns, sql, and, gte, lte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

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
        productName: orderItems.name,
        productQuantity: orderItems.quantity,
      })
      .from(order)
      .leftJoin(orderItems, eq(orderItems.orderId, order.id))
      .where(eq(order.userId, userId as string))
      .orderBy(desc(order.createdAt));

    return orders;
  }),
  getOrdersOverview: protectedProcedure.query(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    const orderWhereFilter = and(
      eq(order.userId, userId as string),
      eq(order.paymentStatus, "SUCCEEDED"),
    );

    const [overview] = await db
      .select({
        totalSpent: sql`coalesce(sum(${order.totalPrice}), 0)`
          .mapWith(Number)
          .as("totalSpent"),
        orderCount: db.$count(order, orderWhereFilter).as("orderCount"),
        averageOrderValue: sql`coalesce(avg(${order.totalPrice}), 0)`
          .mapWith(Number)
          .as("averageOrderValue"),
        firstOrderDate: sql`min(${order.createdAt})`
          .mapWith(Date)
          .as("firstOrderDate"),
        lastOrderDate: sql`max(${order.createdAt})`
          .mapWith(Date)
          .as("lastOrderDate"),
      })
      .from(order)
      .where(orderWhereFilter);

    // Get recent orders for the overview
    const recentOrders = await db
      .select({
        id: order.id,
        orderNumber: order.orderNumber,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
      })
      .from(order)
      .where(eq(order.userId, userId as string))
      .orderBy(desc(order.createdAt))
      .limit(5);

    return {
      ...overview,
      recentOrders,
    };
  }),
  getOrdersChart: protectedProcedure
    .input(
      z.object({
        datePeriod: z
          .enum(["MONTHLY", "QUARTERLY", "YEARLY"])
          .default("MONTHLY"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { datePeriod } = input;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in",
        });
      }

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
        eq(order.userId, userId),
        gte(order.createdAt, startDate),
      );

      // For monthly view, use date_trunc to ensure we're grouping by day properly
      const dateExpression =
        datePeriod === "MONTHLY"
          ? sql`date_trunc('day', ${order.createdAt})`
          : datePeriod === "QUARTERLY"
            ? sql`date_trunc('week', ${order.createdAt})`
            : sql`date_trunc('month', ${order.createdAt})`;

      // Query for order data grouped by the appropriate time period
      const orderData = await db
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
          totalSpent: sql`coalesce(sum(${order.totalPrice}), 0)`
            .mapWith(Number)
            .as("totalSpent"),
          orderCount: sql`count(${order.id})`.mapWith(Number).as("orderCount"),
          averageOrderValue: sql`coalesce(avg(${order.totalPrice}), 0)`
            .mapWith(Number)
            .as("averageOrderValue"),
        })
        .from(order)
        .where(orderWhereFilter)
        // Group by the truncated date to ensure one entry per day/week/month
        .groupBy(dateExpression)
        .orderBy(dateExpression);

      // Transform the data for chart visualization
      const chartData = {
        labels: orderData.map((item) => item.periodFormatted),
        dates: orderData.map((item) => item.period),
        datasets: [
          {
            name: "Total Spent",
            data: orderData.map((item) => item.totalSpent),
            type: "currency",
          },
          {
            name: "Order Count",
            data: orderData.map((item) => item.orderCount),
            type: "number",
          },
          {
            name: "Average Order Value",
            data: orderData.map((item) => item.averageOrderValue),
            type: "currency",
          },
        ],
        period: groupByFormat,
      };

      return chartData;
    }),
  customerTopProducts: protectedProcedure.query(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in",
      });
    }

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
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .innerJoin(order, eq(orderItems.orderId, order.id))
      .where(
        and(eq(order.paymentStatus, "SUCCEEDED"), eq(order.userId, userId)),
      )
      .orderBy(sql`coalesce(sum(${orderItems.quantity}), 0) DESC`)
      .groupBy(orderItems.productId, products.name, products.imageUrl)
      .limit(5);

    return query;
  }),
  getAllOrders: protectedProcedure
    .input(
      z.object({
        datePeriod: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { datePeriod } = input;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in",
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
        })
        .from(order)
        .where(
          and(
            eq(order.userId, userId),
            gte(order.createdAt, startDate),
            lte(order.createdAt, endDate),
          ),
        )
        .orderBy(desc(order.orderNumber));

      return orders;
    }),
});
