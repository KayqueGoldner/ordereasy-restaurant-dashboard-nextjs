import { productsRouter } from "@/features/product/server/procedures";
import { cartRouter } from "@/features/cart/server/procedures";
import { categoriesRouter } from "@/features/category/server/procedure";
import { inventoryRouter } from "@/features/inventory/server/procedure";

import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  products: productsRouter,
  cart: cartRouter,
  categories: categoriesRouter,
  inventory: inventoryRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
