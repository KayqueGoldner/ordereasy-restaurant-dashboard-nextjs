import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  varchar,
  uniqueIndex,
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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("code_idx").on(table.code)],
);

export const discountRelations = relations(discount, ({ many }) => ({
  carts: many(cartDiscount),
}));

export type Discount = typeof discount.$inferSelect;
