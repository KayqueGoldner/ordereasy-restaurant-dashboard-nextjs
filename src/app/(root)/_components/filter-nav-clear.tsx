"use client";

import { useQueryState } from "nuqs";

import { useExpandHome } from "@/hooks/use-expand-home";
import { cn } from "@/lib/utils";

export const FilterNavClear = () => {
  const [categoryQuery, setCategoryQuery] = useQueryState("categoryId", {
    defaultValue: "",
    history: "push",
    shallow: false,
    clearOnDefault: true,
  });
  const { isExpanded } = useExpandHome();

  return (
    <div
      className={cn(
        "group flex h-28 w-max min-w-36 cursor-pointer flex-col gap-2 rounded-xl border border-transparent bg-white p-3 transition-all duration-500 hover:bg-primary/10",
        !categoryQuery && "border-primary",
        isExpanded && "h-14 w-48 flex-row p-2",
      )}
      onClick={() => setCategoryQuery("")}
    >
      <div className="grid size-7 shrink-0 place-items-center rounded-full border border-primary transition-all duration-300">
        🏪
      </div>
      <div>
        <h1 className="text-sm font-medium">All</h1>
        <h3 className="text-sm text-muted-foreground">See all products</h3>
      </div>
    </div>
  );
};
