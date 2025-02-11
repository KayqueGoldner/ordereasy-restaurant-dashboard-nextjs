import { cartTable } from "@/db/schema/cart";
import { relations } from "drizzle-orm";
import { pgTable, text, varchar, uuid, json } from "drizzle-orm/pg-core";

type DiscountCodes = {
  code: string;
  expires: Date;
  amount: number;
  used: boolean;
  redeemedAt: Date;
};

export const usersTable = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  imageUrl: text("image_url").notNull(),
  name: varchar({ length: 50 }).notNull(),
  discountCodes: json("discount_codes").$type<DiscountCodes[]>(),
});

export type User = typeof usersTable.$inferSelect;

export const usersRelations = relations(usersTable, ({ one }) => ({
  cart: one(cartTable),
}));
