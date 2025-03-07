import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  integer,
  primaryKey,
  numeric,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

import { products } from "@/db/schema/products";
import { discount } from "@/db/schema/discount";

export const cart = pgTable("cart", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cartRelations = relations(cart, ({ many }) => ({
  cartItems: many(cartItems),
  discounts: many(cartDiscount),
}));

export const cartItems = pgTable(
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
  (t) => [
    {
      pk: primaryKey({
        columns: [t.cartId, t.productId],
      }),
    },
  ],
);

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(cart, {
    fields: [cartItems.cartId],
    references: [cart.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const cartDiscount = pgTable(
  "cart_discount",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    cartId: text("cart_id")
      .notNull()
      .references(() => cart.id, { onDelete: "cascade" }),
    discountId: text("discount_id")
      .notNull()
      .references(() => discount.id, { onDelete: "cascade" }),
    used: boolean("used").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [{ pk: primaryKey({ columns: [t.cartId, t.discountId] }) }],
);

export type CartDiscount = typeof cartDiscount.$inferSelect;

export const cartDiscountRelations = relations(cartDiscount, ({ one }) => ({
  cart: one(cart, {
    fields: [cartDiscount.cartId],
    references: [cart.id],
  }),
  discount: one(discount, {
    fields: [cartDiscount.discountId],
    references: [discount.id],
  }),
}));
