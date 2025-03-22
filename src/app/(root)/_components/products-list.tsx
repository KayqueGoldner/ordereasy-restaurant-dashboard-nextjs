"use client";

import { Suspense, useState } from "react";
import { RiExpandDiagonalSLine, RiCollapseDiagonalLine } from "react-icons/ri";
import { MdOutlineFilterList, MdOutlineFilterListOff } from "react-icons/md";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useExpandHome } from "@/hooks/use-expand-home";
import { Separator } from "@/components/ui/separator";
import { Hint } from "@/components/hint";
import { cn } from "@/lib/utils";
import { useCartSidebar } from "@/hooks/use-cart-sidebar";
import { ProductCard } from "@/features/product/components/product-card";
import { PRODUCTS_LIST_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";

import { HeaderSearch } from "./header-search";
import { ProductsListFilter } from "./products-list-filter";

interface ProductsListProps {
  categoryId?: string;
  query?: string;
  filters?: ProductsListFilter;
}

export const ProductsList = ({
  categoryId,
  query,
  filters,
}: ProductsListProps) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <ProductsListSuspense
          categoryId={categoryId}
          query={query}
          filters={filters}
        />
      </ErrorBoundary>
    </Suspense>
  );
};

export const ProductsListSuspense = ({
  categoryId,
  query,
  filters,
}: ProductsListProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { isExpanded, onCollapse, onExpand } = useExpandHome();
  const { onClose, onOpen } = useCartSidebar();

  const [data, state] = trpc.products.getMany.useSuspenseInfiniteQuery(
    {
      limit: PRODUCTS_LIST_LIMIT,
      categoryId,
      query,
      ...filters,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const handleExpand = () => {
    if (isExpanded) {
      onCollapse();
      onOpen();
    } else {
      onExpand();
      onClose();
    }
  };

  return (
    <main className="-mt-2 flex h-full flex-1 shrink-0 flex-col overflow-hidden">
      <div
        className={cn(
          "relative flex h-12 flex-col gap-2 overflow-hidden rounded-xl bg-white p-2 transition-all duration-300",
          isFilterOpen && "h-[calc-size(auto,size)]",
        )}
      >
        <div className="-my-2 flex h-12 w-full items-center gap-2 py-1.5">
          <HeaderSearch />
          <Separator orientation="vertical" className="mx-3" />
          <Hint text={isFilterOpen ? "Close filter" : "Open filter"} asChild>
            <Button
              variant="outline"
              className="size-9 rounded-full p-0"
              onClick={() => setIsFilterOpen((prev) => !prev)}
            >
              {!isFilterOpen ? (
                <MdOutlineFilterList className="size-5" />
              ) : (
                <MdOutlineFilterListOff className="size-5" />
              )}
            </Button>
          </Hint>
          <Hint text={isExpanded ? "Collapse" : "Expand"} asChild>
            <Button
              variant="outline"
              className="size-9 rounded-full p-0"
              onClick={handleExpand}
            >
              {isExpanded ? (
                <RiCollapseDiagonalLine className="size-5" />
              ) : (
                <RiExpandDiagonalSLine className="size-5" />
              )}
            </Button>
          </Hint>
        </div>
        <div className="size-full flex-1">
          <ProductsListFilter />
        </div>
      </div>
      <ScrollArea className="mt-2.5 h-full flex-1 pr-5">
        <ul className="grid h-full grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
          {data.pages
            .flatMap((page) => page.items)
            .map((product) => (
              <li
                key={product.id}
                className={cn(
                  "w-full",
                  state.isFetching && "pointer-events-none opacity-80",
                  state.isFetchingNextPage && "pointer-events-none opacity-80",
                  state.fetchStatus === "fetching" &&
                    "pointer-events-none opacity-80",
                )}
              >
                <ProductCard
                  product={{
                    ...product,
                    categoryName: product.categoryName as string,
                    calories: product.calories || 0,
                    ingredients: product.ingredients || "",
                    allergens: product.allergens || "",
                    preparationTime: product.preparationTime || 0,
                    serves: product.serves || 0,
                    quantity: 1,
                  }}
                />
              </li>
            ))}
        </ul>
        <InfiniteScroll
          isManual={true}
          hasNextPage={state.hasNextPage}
          isFetchingNextPage={state.isFetchingNextPage}
          fetchNextPage={state.fetchNextPage}
        />
      </ScrollArea>
    </main>
  );
};
