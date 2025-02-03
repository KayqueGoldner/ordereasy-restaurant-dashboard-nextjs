"use client";

import { FaCartShopping } from "react-icons/fa6";
import { CiMenuFries } from "react-icons/ci";
import { LuBadgePercent } from "react-icons/lu";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartSidebar } from "@/hooks/use-cart-sidebar";
import { useExpandHome } from "@/hooks/use-expand-home";
import { cn } from "@/lib/utils";

import { CartCard } from "./cart-card";

export const CartSidebar = () => {
  const { isOpen, onClose, onOpen } = useCartSidebar();
  const { isExpanded } = useExpandHome();
  const [isSidebarOpen, setIsSidebarOpen] = useState(isExpanded);

  useEffect(() => {
    setIsSidebarOpen(isExpanded);
  }, [isExpanded]);

  const handleSidebar = () => {
    if (isOpen) onClose();
    else onOpen();

    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div
      className={cn(
        "flex w-full max-w-md flex-col gap-1 overflow-hidden rounded-xl bg-white px-3 py-2 transition-all duration-700",
        isSidebarOpen && "w-16 items-center px-0 transition-all duration-300",
      )}
    >
      <div className="flex items-center justify-between border-b pb-1.5">
        <div
          className={cn(
            "flex size-7 items-center justify-center rounded-full",
            isSidebarOpen && "hidden",
          )}
        >
          <FaCartShopping className="size-4 text-primary" />
        </div>
        <h1 className={cn("text-lg", isSidebarOpen && "hidden")}>
          Customer&apos;s name
        </h1>
        <Button className="size-7 rounded-full p-0" onClick={handleSidebar}>
          <CiMenuFries className="size-4 stroke-2 text-white" />
        </Button>
      </div>
      <ScrollArea
        className={cn("flex-1 py-5 pr-3", isSidebarOpen && "w-16 px-1.5")}
      >
        <ul
          className={cn(
            "flex h-max w-full flex-col gap-2 overflow-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-2",
          )}
        >
          {Array.from({ length: 10 }, (_, index) => (
            <CartCard key={index} isSidebarOpen={isSidebarOpen} />
          ))}
        </ul>
      </ScrollArea>
      <div className="min-h-max">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3 className={isSidebarOpen ? "hidden" : ""}>Subtotal</h3>
            <div className={cn("flex items-center", isSidebarOpen && "hidden")}>
              <span className="leading-none">$</span>
              <div className="w-24 text-center">5.00</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <h3 className={isSidebarOpen ? "hidden" : ""}>Tax (15%)</h3>
            <div className={cn("flex items-center", isSidebarOpen && "hidden")}>
              <span className="leading-none">$</span>
              <div className="w-24 text-center">5,75</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <h3 className={isSidebarOpen ? "hidden" : ""}>Discount</h3>
            <div className={cn("flex items-center", isSidebarOpen && "hidden")}>
              <span className="leading-none">-$</span>
              <div className="w-24 text-center">0.00</div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t py-2 text-base">
            <h3 className={isSidebarOpen ? "hidden" : ""}>Total</h3>
            <div
              className={cn(
                "flex items-center",
                isSidebarOpen && "size-12 flex-col justify-center text-sm",
              )}
            >
              <span className="leading-none">$</span>
              <div className="w-24 text-center">0.00</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1">
          <div className={cn("flex flex-1 gap-2", isSidebarOpen && "hidden")}>
            <div className="relative h-12 flex-1 rounded-full border border-green-600">
              <Input
                className="absolute inset-x-0 h-12 rounded-full border border-transparent bg-transparent"
                placeholder="Promo Code"
              />
              <Button className="absolute right-1 top-1/2 size-10 -translate-y-1/2 rounded-full bg-green-600 p-0 hover:bg-green-600/90">
                <LuBadgePercent className="size-4 text-white" />
              </Button>
            </div>
          </div>
          <Button
            className={cn(
              "h-12 w-40 rounded-full",
              isSidebarOpen && "size-10 rounded-full p-0",
            )}
            asChild
          >
            <Link href="/">
              {isSidebarOpen ? (
                <FaCartShopping className="size-4" />
              ) : (
                <>Place Order</>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
