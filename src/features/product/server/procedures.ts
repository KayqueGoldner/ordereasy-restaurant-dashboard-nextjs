import { db } from "@/db/drizzle";
import { products } from "@/db/schema/products";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const data = await db.select().from(products);

    return data;
  }),
});
