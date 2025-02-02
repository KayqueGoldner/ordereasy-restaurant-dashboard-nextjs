"use client";

import { FaQuestion } from "react-icons/fa6";
import { useQueryState } from "nuqs";

import { useExpandHome } from "@/hooks/use-expand-home";
import { cn } from "@/lib/utils";

interface FilterNavItemProps {
  itemCategory: string;
}

export const FilterNavItem = ({ itemCategory }: FilterNavItemProps) => {
  const [category, setCategory] = useQueryState("category");
  const { isExpanded } = useExpandHome();

  return (
    <div
      className={cn(
        "group flex size-32 cursor-pointer flex-row flex-wrap gap-x-2 rounded-xl border border-transparent bg-white p-3 transition-all duration-500",
        category === itemCategory && "border-primary",
        isExpanded && "h-14 w-48 p-2",
      )}
      onClick={() => setCategory(itemCategory)}
    >
      <div className="grid size-7 shrink-0 place-items-center rounded-full border border-transparent bg-primary transition-all duration-300 group-hover:border-primary group-hover:bg-transparent">
        <FaQuestion className="size-4 text-white transition-colors duration-300 group-hover:text-primary" />
      </div>
      <div>
        <h1 className="font-medium">{itemCategory}</h1>
        <h3 className="text-sm text-muted-foreground">100 Items</h3>
      </div>
    </div>
  );
};
