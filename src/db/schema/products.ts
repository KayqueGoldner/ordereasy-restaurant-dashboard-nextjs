import { cart } from "@/db/schema/cart";
import { relations } from "drizzle-orm";
import {
  boolean,
  numeric,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  description: varchar("description", { length: 124 }).notNull(),
  imageUrl: text("image_url").notNull(),
  isAvailable: boolean("is_available").notNull(),
  price: numeric("price").notNull(),
  category: text("category").notNull(),
  cartId: text("cart_id").references(() => cart.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productsRelations = relations(products, ({ one }) => ({
  cart: one(cart, {
    fields: [products.cartId],
    references: [cart.id],
  }),
}));

export type Product = typeof products.$inferSelect;
