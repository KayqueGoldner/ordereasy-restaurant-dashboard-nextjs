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
import { stripe } from "@/lib/stripe";

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

      const coupon = await stripe.coupons.create({
        amount_off: Number(amount) * 100,
        currency: "USD",
        duration: "once",
      });

      const promoCode = await stripe.promotionCodes.create({
        coupon: coupon.id,
        code: code,
        max_redemptions: 1,
        expires_at: Math.floor(new Date(expires).getTime() / 1000),
      });

      const [discountData] = await db
        .insert(discount)
        .values({
          code,
          amount,
          expires,
          stripeCouponId: coupon.id,
          stripePromoCodeId: promoCode.id,
          stripePromoCodeActive: promoCode.active,
          stripePromoCodeTimesRedeemed: promoCode.times_redeemed,
        })
        .returning();

      return discountData;
    }),
});
