import {
  boolean,
  numeric,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { categories } from "@/db/schema/categories";

export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: varchar("description", { length: 124 }).notNull(),
  imageUrl: text("image_url").notNull(),
  isAvailable: boolean("is_available").notNull(),
  price: numeric("price").notNull(),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));
