import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { FilterNavItem } from "./filter-nav-item";

export const FilterNav = () => {
  return (
    <nav className="w-full shrink-0 py-2">
      <ScrollArea className="w-full">
        <ul className="flex items-center gap-2 pb-2">
          {Array.from({ length: 7 }, (_, index) => (
            <li key={index}>
              <FilterNavItem itemCategory={`category-${index}`} />
            </li>
          ))}
        </ul>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </nav>
  );
};
