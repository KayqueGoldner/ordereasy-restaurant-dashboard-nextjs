import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";

export type CustomerGetOrdersOutput =
  inferRouterOutputs<AppRouter>["customer"]["getOrders"];
