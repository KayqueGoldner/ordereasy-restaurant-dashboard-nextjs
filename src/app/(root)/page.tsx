import { HydrateClient, trpc } from "@/trpc/server";
import { CartSidebar } from "@/features/cart/components/cart-sidebar";

import { FilterNav } from "./_components/filter-nav";
import { Header } from "./_components/header";
import { ProductsList } from "./_components/products-list";

export default function Home() {
  void trpc.products.getMany.prefetch();
  void trpc.cart.getData.prefetch();

  return (
    <HydrateClient>
      <div className="flex size-full gap-2">
        <div className="flex size-full flex-col overflow-hidden">
          <Header />
          <FilterNav />
          <ProductsList />
        </div>
        <CartSidebar isMobile={false} />
      </div>
    </HydrateClient>
  );
}
