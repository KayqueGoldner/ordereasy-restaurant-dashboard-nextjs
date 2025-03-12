import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { productInsertSchema, products } from "@/db/schema/products";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { categories } from "@/db/schema/categories";
import { TRPCError } from "@trpc/server";

export const inventoryRouter = createTRPCRouter({
  getProducts: protectedProcedure.query(async () => {
    const productsData = await db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(desc(products.createdAt));

    return productsData;
  }),
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, input.productId))
        .limit(1);

      return product;
    }),
  editProduct: protectedProcedure
    .input(productInsertSchema)
    .mutation(async ({ input }) => {
      const [product] = await db
        .update(products)
        .set(input)
        .where(eq(products.id, input.id as string))
        .returning();

      return product;
    }),
  deleteProduct: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { productId } = input;

      if (!productId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Product ID is required",
        });
      }

      const [product] = await db
        .delete(products)
        .where(eq(products.id, productId))
        .returning();

      return product;
    }),
});
