import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  varchar,
  uniqueIndex,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

import { cartDiscount } from "@/db/schema/cart";

export const discount = pgTable(
  "discount",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    code: varchar("code", { length: 256 }).notNull(),
    amount: text("amount").notNull(),
    expires: timestamp("expires").notNull(),
    stripePromoCodeId: text("stripe_promo_code_id"),
    stripeCouponId: text("stripe_coupon_id"),
    stripePromoCodeTimesRedeemed: integer("stripe_promo_code_times_redeemed"),
    stripePromoCodeActive: boolean("stripe_promo_code_active"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("code_idx").on(table.code)],
);

export const discountRelations = relations(discount, ({ many }) => ({
  carts: many(cartDiscount),
}));

export type Discount = typeof discount.$inferSelect;
