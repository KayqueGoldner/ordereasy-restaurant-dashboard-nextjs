import { z } from "zod";
import { and, desc, eq, ilike, lt } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { db } from "@/db/drizzle";
import { productInsertSchema, products } from "@/db/schema/products";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { categories } from "@/db/schema/categories";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
        categoryId: z.string().optional(),
        query: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { cursor, limit, categoryId, query } = input;

      const data = await db
        .select()
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(
          and(
            cursor ? lt(products.id, cursor.id) : undefined,
            categoryId ? eq(products.categoryId, categoryId) : undefined,
            query ? ilike(products.name, `%${query}%`) : undefined,
          ),
        )
        .orderBy(desc(products.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.products.id,
            updatedAt: lastItem.products.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;

      const [product] = await db
        .select({
          id: products.id,
          name: products.name,
          imageUrl: products.imageUrl,
          description: products.description,
          price: products.price,
          categoryId: products.categoryId,
          categoryName: categories.name,
        })
        .from(products)
        .where(eq(products.id, id))
        .leftJoin(categories, eq(products.categoryId, categories.id));

      return product;
    }),
  createProduct: protectedProcedure
    .input(productInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const { role } = ctx.user;
      const { name, description, price, categoryId, imageUrl, isAvailable } =
        input;

      if (role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action",
        });
      }

      const product = await db.insert(products).values({
        name,
        imageUrl,
        description,
        price,
        categoryId,
        isAvailable,
      });

      return product;
    }),
});
