import { desc, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { products } from "@/db/schema/products";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { categories } from "@/db/schema/categories";

export const inventoryRouter = createTRPCRouter({
  getProducts: protectedProcedure.query(async () => {
    const productsData = await db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(desc(products.createdAt));

    return productsData;
  }),
});
