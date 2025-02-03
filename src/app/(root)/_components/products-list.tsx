"use client";

import { TbShoppingBagSearch } from "react-icons/tb";
import { RiExpandDiagonalSLine, RiCollapseDiagonalLine } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { products } from "@/data/products";
import { useExpandHome } from "@/hooks/use-expand-home";

import { ProductCard } from "./product-card";
import { Separator } from "@/components/ui/separator";
import { Hint } from "@/components/hint";

export const ProductsList = () => {
  const { isExpanded, changeExpanded } = useExpandHome();

  return (
    <main className="-mt-2 flex h-full flex-1 shrink-0 flex-col overflow-hidden">
      <div className="flex items-center gap-2 rounded-xl bg-white p-2">
        <div className="h-10 flex-1 rounded-full border border-primary/40">
          <Input
            placeholder="Find your favorite meal."
            className="size-full rounded-full border-0"
          />
        </div>
        <Button className="size-10 rounded-full p-0">
          <TbShoppingBagSearch className="size-5" />
        </Button>
        <Separator orientation="vertical" className="mx-3" />
        <Hint text={isExpanded ? "Expand" : "Collapse"} asChild>
          <Button
            variant="outline"
            className="size-10 rounded-full p-0"
            onClick={() => changeExpanded((prev) => !prev)}
          >
            {isExpanded ? (
              <RiCollapseDiagonalLine className="size-5" />
            ) : (
              <RiExpandDiagonalSLine className="size-5" />
            )}
          </Button>
        </Hint>
      </div>
      <ScrollArea className="h-full flex-1 pr-5">
        <ul className="flex h-full flex-wrap gap-3">
          {products.map((product) => (
            <li key={product.id} className="w-48">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </ScrollArea>
    </main>
  );
};
