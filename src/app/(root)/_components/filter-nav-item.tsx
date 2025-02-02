"use client";

import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";
import { FaQuestion } from "react-icons/fa6";

interface FilterNavItemProps {
  itemCategory: string;
}

export const FilterNavItem = ({ itemCategory }: FilterNavItemProps) => {
  const [category, setCategory] = useQueryState("category");

  return (
    <div
      className={cn(
        "group flex size-32 cursor-pointer flex-col justify-between rounded-xl border border-transparent bg-white p-3",
        category === itemCategory && "border-primary",
      )}
      onClick={() => setCategory(itemCategory)}
    >
      <div className="grid size-7 place-items-center rounded-full border border-transparent bg-primary transition-all duration-300 group-hover:border-primary group-hover:bg-transparent">
        <FaQuestion className="size-4 text-white transition-colors duration-300 group-hover:text-primary" />
      </div>
      <div>
        <h1 className="font-medium">{itemCategory}</h1>
        <h3 className="text-sm text-muted-foreground">100 Items</h3>
      </div>
    </div>
  );
};
