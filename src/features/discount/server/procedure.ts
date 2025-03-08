import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/drizzle";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { discount } from "@/db/schema/discount";
import { TRPCError } from "@trpc/server";

export const discountRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        discountCode: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { discountCode } = input;

      const [discountData] = await db
        .select()
        .from(discount)
        .where(eq(discount.code, discountCode))
        .limit(1);

      return discountData;
    }),
  create: protectedProcedure
    .input(
      z.object({
        code: z.string(),
        amount: z.string(),
        expires: z.date(),
      }),
    )
    .mutation(async ({ input }) => {
      const { code, amount, expires } = input;

      const [discountExists] = await db
        .select()
        .from(discount)
        .where(eq(discount.code, code))
        .limit(1);

      if (discountExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Discount code already exists",
        });
      }

      const [discountData] = await db
        .insert(discount)
        .values({
          code,
          amount,
          expires,
        })
        .returning();

      return discountData;
    }),
});
