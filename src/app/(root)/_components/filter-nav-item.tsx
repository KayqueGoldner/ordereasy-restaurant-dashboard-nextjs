"use client";

import { useQueryState } from "nuqs";

import { useExpandHome } from "@/hooks/use-expand-home";
import { cn } from "@/lib/utils";
import { Category } from "@/db/schema/categories";

interface FilterNavItemProps {
  category: Category;
  quantity: number;
}

export const FilterNavItem = ({ category, quantity }: FilterNavItemProps) => {
  const [categoryQuery, setCategoryQuery] = useQueryState("category", {
    history: "push",
  });
  const { isExpanded } = useExpandHome();

  return (
    <div
      className={cn(
        "group flex h-28 w-max min-w-36 cursor-pointer flex-col gap-2 rounded-xl border border-transparent bg-white p-3 transition-all duration-500 hover:bg-primary/10",
        categoryQuery === category.id && "border-primary",
        isExpanded && "h-14 w-48 flex-row p-2",
      )}
      onClick={() => setCategoryQuery(category.id)}
    >
      <div className="grid size-7 shrink-0 place-items-center rounded-full border border-primary transition-all duration-300">
        {category.icon}
      </div>
      <div>
        <h1 className="text-sm font-medium">{category.name}</h1>
        <h3 className="text-sm text-muted-foreground">{quantity} Items</h3>
      </div>
    </div>
  );
};
