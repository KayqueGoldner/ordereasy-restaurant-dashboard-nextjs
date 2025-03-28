import { auth } from "@/lib/auth";
import { HydrateClient, trpc } from "@/trpc/server";
import { CartSidebar } from "@/features/cart/components/cart-sidebar";
import { PRODUCTS_LIST_LIMIT } from "@/constants";
import { ProductCardModal } from "@/features/product/components/product-card-modal";
import { UserSettingsModal } from "@/features/user/components/user-settings-modal";
import { SignInForm } from "@/features/user/components/sign-in-form";

import { FilterNav } from "./_components/filter-nav";
import { Header } from "./_components/header";
import { ProductsList } from "./_components/products-list";

interface HomeProps {
  searchParams: Promise<
    { categoryId?: string; query?: string } & ProductsListFilter
  >;
}

export default async function Home({ searchParams }: HomeProps) {
  const session = await auth();
  const { categoryId, query, ...filters } = await searchParams;

  const formattedFilters = Object.entries(filters).reduce(
    (acc, [key, value]) => {
      if (value === "") return acc;

      const numericKeys = [
        "minimumServes",
        "maxPreparationTime",
        "maxCalories",
      ];

      if (numericKeys.includes(key)) {
        return { ...acc, [key]: Number(value) };
      } else {
        return { ...acc, [key]: value };
      }
    },
    {} as ProductsListFilter,
  );

  void trpc.products.getMany.prefetchInfinite({
    limit: PRODUCTS_LIST_LIMIT,
    categoryId,
    query,
    ...formattedFilters,
  });
  void trpc.cart.getData.prefetch();
  void trpc.categories.getMany.prefetch();
  void trpc.user.getData.prefetch();

  return (
    <HydrateClient>
      <div className="flex size-full gap-1">
        <SignInForm />
        <UserSettingsModal session={session} />
        <div className="relative flex size-full flex-col overflow-hidden">
          <ProductCardModal />
          <div className="flex size-full flex-col overflow-hidden p-2">
            <Header session={session} />
            <FilterNav />
            <ProductsList
              categoryId={categoryId}
              query={query}
              filters={formattedFilters}
            />
          </div>
        </div>
        <CartSidebar isMobile={false} />
      </div>
    </HydrateClient>
  );
}
