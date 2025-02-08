"use client";

import { FaCartShopping } from "react-icons/fa6";
import { CiMenuFries } from "react-icons/ci";
import { LuBadgePercent } from "react-icons/lu";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartSidebar } from "@/hooks/use-cart-sidebar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartData } from "@/hooks/use-cart-data";

import { CartCard } from "./cart-card";

interface CartSidebarProps {
  className?: string;
}

export const CartSidebar = ({ className }: CartSidebarProps) => {
  const { isOpen, onClose, onOpen } = useCartSidebar();
  const { items, discount, subTotal, tax, total } = useCartData();

  const handleSidebar = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  return (
    <div
      className={cn(
        "hidden size-full max-w-md shrink-0 flex-col gap-1 overflow-hidden rounded-xl bg-white px-3 py-2 transition-all duration-700 lg:flex",
        !isOpen && "w-16 items-center px-0 transition-all duration-300",
        className,
      )}
    >
      <div className="flex items-center gap-4 border-b pb-1.5 lg:justify-between">
        <div
          className={cn(
            "flex size-7 items-center justify-between rounded-full",
            !isOpen && "hidden",
          )}
        >
          <FaCartShopping className="size-4 text-primary" />
        </div>
        <h1 className={cn("text-lg", !isOpen && "hidden")}>
          Customer&apos;s name
        </h1>
        <Button
          className="hidden size-7 rounded-full p-0 lg:flex"
          onClick={handleSidebar}
        >
          <CiMenuFries className="size-4 stroke-2 text-white" />
        </Button>
      </div>
      <ScrollArea className={cn("flex-1 py-5 pr-3", !isOpen && "w-16 px-1.5")}>
        <ul
          className={cn(
            "flex h-max w-full flex-col gap-2 overflow-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-2",
          )}
        >
          {items.length > 0 ? (
            items.map((product) => (
              <CartCard
                key={product.id}
                product={product}
                isSidebarOpen={!isOpen}
              />
            ))
          ) : (
            <h1
              className={cn("block text-center text-xl", !isOpen && "hidden")}
            >
              The cart is empty
            </h1>
          )}
        </ul>
      </ScrollArea>
      <div className="min-h-max">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3 className={!isOpen ? "hidden" : ""}>Subtotal</h3>
            <div className={cn("flex items-center", !isOpen && "hidden")}>
              <span className="leading-none">$</span>
              <div className="w-24 text-center">{subTotal}</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <h3 className={!isOpen ? "hidden" : ""}>Tax (15%)</h3>
            <div className={cn("flex items-center", !isOpen && "hidden")}>
              <span className="leading-none">$</span>
              <div className="w-24 text-center">{tax}</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <h3 className={!isOpen ? "hidden" : ""}>Discount</h3>
            <div className={cn("flex items-center", !isOpen && "hidden")}>
              <span className="leading-none">-$</span>
              <div className="w-24 text-center">{discount}</div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t py-2 text-base">
            <h3 className={!isOpen ? "hidden" : ""}>Total</h3>
            <div
              className={cn(
                "flex items-center",
                !isOpen && "size-12 flex-col justify-center text-sm",
              )}
            >
              <span className="leading-none">$</span>
              <div className="w-24 text-center">{total}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1">
          <div className={cn("flex flex-1 gap-2", !isOpen && "hidden")}>
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
              !isOpen && "size-10 rounded-full p-0",
            )}
            asChild
          >
            <Link href="/">
              {!isOpen ? (
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

export const CartSidebarMobile = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex size-8 rounded-full p-0 lg:hidden">
          <FaCartShopping className="size-4 stroke-2 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto p-0">
        <SheetTitle hidden aria-label="cart" />
        <CartSidebar className="flex max-w-full" />
      </SheetContent>
    </Sheet>
  );
};
