import { relations } from "drizzle-orm";
import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import { cart } from "@/db/schema/cart";
import { users } from "@/db/schema/users";
import { products } from "@/db/schema/products";

export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "FAILED",
  "SUCCEEDED",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "PREPARING",
  "DELIVERED",
  "CANCELED",
]);

export const paymentProviderEnum = pgEnum("payment_provider", [
  "STRIPE",
  // add more
]);
export type PaymentProvider = (typeof paymentProviderEnum.enumValues)[number];

export const order = pgTable(
  "order",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    cartId: text("cart_id")
      .notNull()
      .references(() => cart.id, { onDelete: "cascade" }),
    address: text("address").notNull(),
    subTotal: numeric("sub_total", { precision: 10, scale: 2 }).notNull(),
    totalDiscount: numeric("total_discount", {
      precision: 10,
      scale: 2,
    }).notNull(),
    tax: numeric("tax", { precision: 10, scale: 2 }).notNull(),
    totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
    status: orderStatusEnum("status").notNull().default("PENDING"),
    orderNumber: integer("order_number").notNull().unique(),
    paymentProvider: paymentProviderEnum("payment_provider")
      .notNull()
      .default("STRIPE"),
    paymentStatus: paymentStatusEnum("payment_status")
      .notNull()
      .default("PENDING"),
    sessionUrl: text("session_url"),
    paymentDate: timestamp("payment_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("orderNumber_idx").on(t.orderNumber)],
);

export type Order = typeof order.$inferSelect;
export const orderInsertSchema = createInsertSchema(order);
export const orderSelectSchema = createSelectSchema(order);
export const orderUpdateSchema = createUpdateSchema(order);

export const orderRelations = relations(order, ({ one, many }) => ({
  cart: one(cart, {
    fields: [order.cartId],
    references: [cart.id],
  }),
  user: one(users, {
    fields: [order.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItems = pgTable(
  "order_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orderId: text("order_id")
      .notNull()
      .references(() => order.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    note: varchar("note", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (orderItems) => [
    {
      pk: primaryKey({
        columns: [orderItems.orderId, orderItems.productId],
      }),
    },
  ],
);

export type OrderItems = typeof orderItems.$inferSelect;
export const orderItemsInsertSchema = createInsertSchema(orderItems);
export const orderItemsSelectSchema = createSelectSchema(orderItems);
export const orderItemsUpdateSchema = createUpdateSchema(orderItems);

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(order, {
    fields: [orderItems.orderId],
    references: [order.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
