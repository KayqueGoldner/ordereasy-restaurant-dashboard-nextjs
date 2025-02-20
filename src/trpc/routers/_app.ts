import { productsRouter } from "@/features/product/server/procedures";
import { cartRouter } from "@/features/cart/server/procedures";

import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  products: productsRouter,
  cart: cartRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
