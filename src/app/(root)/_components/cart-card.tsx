"use client";

import { useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import { useCartSidebar } from "@/hooks/use-cart-sidebar";
import { cn } from "@/lib/utils";

interface CartCardProps {
  isSidebarOpen: boolean;
}

export const CartCard = ({ isSidebarOpen }: CartCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const {} = useCartSidebar();

  return (
    <li
      className={cn(
        "flex h-16 w-full shrink-0 items-start justify-between gap-3",
        isSidebarOpen && "h-12",
      )}
    >
      <div
        className={cn(
          "flex h-full w-20 shrink-0 items-center justify-center rounded-xl bg-neutral-200",
          isSidebarOpen && "size-full",
        )}
      >
        <CiImageOn className="size-7 text-primary" />
      </div>
      <div
        className={cn(
          "flex flex-1 items-end justify-between",
          isSidebarOpen && "hidden",
        )}
      >
        <div className="max-w-[18ch] flex-1 space-y-1 pt-1">
          <h1 className="truncate text-base">Product&apos;s name</h1>
          <h3 className="truncate text-sm font-medium text-muted-foreground">
            $1.00
          </h3>
        </div>
        <div className="flex gap-x-1.5">
          <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-1.5 py-1">
            <Button
              className="size-5 rounded-full p-0"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              <FaMinus className="size-3" />
            </Button>
            <p className="min-w-5 text-center text-sm font-semibold">
              {quantity}
            </p>
            <Button
              className="size-5 rounded-full p-0"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              <FaPlus className="size-3" />
            </Button>
          </div>
          <Hint text="Remove" side="top" className="px-2 py-1" asChild>
            <Button
              variant="outline"
              className="size-7 h-auto rounded-full p-0 text-xs font-semibold"
            >
              <FaTrash className="size-[14px] text-primary" />
            </Button>
          </Hint>
        </div>
      </div>
    </li>
  );
};
