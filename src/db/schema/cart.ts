import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  integer,
  primaryKey,
  numeric,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";
import { products } from "@/db/schema/products";

export const cart = pgTable("cart", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  discounts: jsonb("discounts").default([]).notNull().$type<Discounts[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cartRelations = relations(cart, ({ many }) => ({
  Products: many(Products),
}));

export const Products = pgTable(
  "cart_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    cartId: text("cart_id")
      .notNull()
      .references(() => cart.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    price: numeric("price").notNull(),
    quantity: integer("quantity").default(1).notNull(),
    note: varchar("note", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (Products) => [
    {
      pk: primaryKey({
        columns: [Products.cartId, Products.productId],
      }),
    },
  ],
);

export const ProductsRelations = relations(Products, ({ one }) => ({
  cart: one(cart, {
    fields: [Products.cartId],
    references: [cart.id],
  }),
  product: one(products, {
    fields: [Products.productId],
    references: [products.id],
  }),
}));
