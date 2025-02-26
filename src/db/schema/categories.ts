import { products } from "@/db/schema/products";
import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const categories = pgTable(
  "categories",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    icon: text("icon").notNull(),
    name: text("name").notNull().unique(),
    description: varchar("description", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("name_idx").on(table.name)],
);

export type Category = typeof categories.$inferSelect;

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));
