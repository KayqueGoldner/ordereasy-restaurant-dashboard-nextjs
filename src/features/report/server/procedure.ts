import { desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { db } from "@/db/drizzle";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { discount } from "@/db/schema/discount";

export const reportRouter = createTRPCRouter({
  getDiscounts: protectedProcedure.query(async ({ ctx }) => {
    const { role } = ctx.user;

    if (role !== "ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not authorized to access this resource",
      });
    }

    const discounts = await db
      .select()
      .from(discount)
      .orderBy(desc(discount.createdAt));

    return discounts;
  }),
});
