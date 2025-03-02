import { HydrateClient, trpc } from "@/trpc/server";
import { CartSidebar } from "@/features/cart/components/cart-sidebar";
import { PRODUCTS_LIST_LIMIT } from "@/constants";
import { ProductCardModal } from "@/features/product/components/product-card-modal";

import { FilterNav } from "./_components/filter-nav";
import { Header } from "./_components/header";
import { ProductsList } from "./_components/products-list";

interface HomeProps {
  searchParams: Promise<{ categoryId?: string; query?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { categoryId, query } = await searchParams;

  void trpc.products.getMany.prefetchInfinite({
    limit: PRODUCTS_LIST_LIMIT,
    categoryId,
    query,
  });
  void trpc.cart.getData.prefetch();
  void trpc.categories.getMany.prefetch();

  return (
    <HydrateClient>
      <div className="flex size-full gap-2">
        <div className="relative flex size-full flex-col overflow-hidden">
          <ProductCardModal />
          <div className="flex size-full flex-col overflow-hidden p-2">
            <Header />
            <FilterNav />
            <ProductsList categoryId={categoryId} query={query} />
          </div>
        </div>
        <CartSidebar isMobile={false} />
      </div>
    </HydrateClient>
  );
}
