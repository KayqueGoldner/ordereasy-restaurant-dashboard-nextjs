"use client";

import { Suspense, useState } from "react";
import { TbShoppingBagSearch } from "react-icons/tb";
import { RiExpandDiagonalSLine, RiCollapseDiagonalLine } from "react-icons/ri";
import { MdOutlineFilterList, MdOutlineFilterListOff } from "react-icons/md";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useExpandHome } from "@/hooks/use-expand-home";
import { Separator } from "@/components/ui/separator";
import { Hint } from "@/components/hint";
import { cn } from "@/lib/utils";
import { useCartSidebar } from "@/hooks/use-cart-sidebar";
import { ProductCardModal } from "@/features/product/components/product-card-modal";
import { ProductCard } from "@/features/product/components/product-card";
import { PRODUCTS_LIST_LIMIT } from "@/constants";
import { InfiniteScroll } from "@/components/infinite-scroll";

export const ProductsList = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <ProductsListSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

export const ProductsListSuspense = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { isExpanded, onCollapse, onExpand } = useExpandHome();
  const { onClose, onOpen } = useCartSidebar();

  const [data, query] = trpc.products.getMany.useSuspenseInfiniteQuery(
    {
      limit: PRODUCTS_LIST_LIMIT,
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
      <ProductCardModal />
      <div
        className={cn(
          "relative flex h-12 flex-col gap-2 overflow-hidden rounded-xl bg-white p-2 transition-all duration-300",
          isFilterOpen && "h-36",
        )}
      >
        <div className="-my-2 flex h-12 w-full items-center gap-2 py-1.5">
          <div className="h-full flex-1 rounded-full border border-primary/40">
            <Input
              placeholder="Find your favorite meal."
              className="size-full rounded-full border-0"
            />
          </div>
          <Button className="size-9 rounded-full p-0">
            <TbShoppingBagSearch className="size-5" />
          </Button>
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
          <div className="size-full rounded-xl border">filters</div>
        </div>
      </div>
      <ScrollArea className="h-full flex-1 pr-5">
        <ul className="grid h-full grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
          {data.pages
            .flatMap((page) => page.items)
            .map((product) => (
              <li key={product.id} className="w-full">
                <ProductCard product={product} />
              </li>
            ))}
        </ul>
      </ScrollArea>
      <InfiniteScroll
        isManual={true}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </main>
  );
};
