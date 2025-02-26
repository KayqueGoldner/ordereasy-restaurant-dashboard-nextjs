import { sql, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { categories } from "@/db/schema/categories";
import { products } from "@/db/schema/products";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const categoriesData = await db
      .select({
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
        description: categories.description,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        productCount: sql<number>`COUNT(${products.id})`,
      })
      .from(categories)
      .leftJoin(products, eq(products.categoryId, categories.id))
      .groupBy(categories.id);

    return categoriesData;
  }),
});
