"use client";

import { trpc } from "@/trpc/client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { FilterNavItem } from "./filter-nav-item";
import { FilterNavClear } from "./filter-nav-clear";

export const FilterNav = () => {
  const [data] = trpc.categories.getMany.useSuspenseQuery();

  return (
    <nav className="w-full overflow-x-auto py-2">
      <ScrollArea className="w-full">
        <ul className="flex items-center gap-2 pb-3">
          <li>
            <FilterNavClear />
          </li>
          {data.map(({ productCount, ...category }) => (
            <li key={category.id}>
              <FilterNavItem category={category} quantity={productCount} />
            </li>
          ))}
        </ul>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </nav>
  );
};
