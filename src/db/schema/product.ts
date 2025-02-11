import { cartTable } from "@/db/schema/cart";
import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  numeric,
  pgEnum,
  timestamp,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", [
  "appetizer",
  "main_course",
  "dessert",
  "beverage",
  "side",
  "combo",
]);

export type Category = (typeof categoryEnum.enumValues)[number];

export const productsTable = pgTable("products", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  imageUrl: text("image_url").notNull(),
  name: varchar({ length: 50 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  price: numeric().notNull(),
  category: categoryEnum().notNull().default("main_course"),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Product = typeof productsTable.$inferSelect;

export const productsRelations = relations(productsTable, ({ many }) => ({
  cart: many(cartTable),
}));
