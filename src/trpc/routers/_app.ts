import { productsRouter } from "@/features/product/server/procedures";

import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  products: productsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
