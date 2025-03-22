import { z } from "zod";
import {
  and,
  desc,
  eq,
  getTableColumns,
  gte,
  ilike,
  lt,
  lte,
  notIlike,
} from "drizzle-orm";
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
        maxPrice: z.string().optional(),
        maxPreparationTime: z.number().optional(),
        minimumServes: z.number().optional(),
        maxCalories: z.number().optional(),
        ingredients: z.string().optional(),
        allergens: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const {
        cursor,
        limit,
        categoryId,
        query,
        allergens,
        ingredients,
        maxCalories,
        maxPreparationTime,
        maxPrice,
        minimumServes,
      } = input;

      const normalizeStringFilter = (input: string) =>
        input
          .toLowerCase()
          .split(",")
          .map((word) => word.trim())
          .filter(Boolean);

      const ingredientWords = ingredients
        ? normalizeStringFilter(ingredients)
        : [];
      const allergenWords = allergens ? normalizeStringFilter(allergens) : [];

      const filters = [
        cursor ? lt(products.id, cursor.id) : null,
        categoryId ? eq(products.categoryId, categoryId) : null,
        query ? ilike(products.name, `%${query}%`) : null,
        maxPrice ? lte(products.price, maxPrice) : null,
        maxPreparationTime
          ? lte(products.preparationTime, maxPreparationTime)
          : null,
        minimumServes ? gte(products.serves, minimumServes) : null,
        maxCalories ? lte(products.calories, maxCalories) : null,

        ...ingredientWords.map((word) =>
          ilike(products.ingredients, `%${word}%`),
        ),
        ...allergenWords.map((word) =>
          notIlike(products.allergens, `%${word}%`),
        ),
      ].filter((value) => value !== null);

      const data = await db
        .select({
          ...getTableColumns(products),
          categoryName: categories.name,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(filters.length ? and(...filters) : undefined)
        .orderBy(desc(products.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
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
      const values = input;

      if (role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action",
        });
      }

      const product = await db.insert(products).values({ ...values });

      return product;
    }),
});
