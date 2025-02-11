import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { productsTable } from "@/db/schema/product";
import { usersTable } from "@/db/schema/user";

export const cartTable = pgTable("cart", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  userId: text("user_id"),
  productId: text("product_id"),
  quantity: integer().notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Cart = typeof cartTable.$inferSelect;

export const cartRelations = relations(cartTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [cartTable.userId],
    references: [usersTable.id],
  }),
  product: one(productsTable, {
    fields: [cartTable.productId],
    references: [productsTable.id],
  }),
}));
