import { z } from "zod";
import { desc, eq, lt } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { products } from "@/db/schema/products";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
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
      }),
    )
    .query(async ({ input }) => {
      const { cursor, limit } = input;

      const data = await db
        .select()
        .from(products)
        .where(cursor ? lt(products.id, cursor.id) : undefined)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .orderBy(desc(products.updatedAt), desc(products.id))
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
});
