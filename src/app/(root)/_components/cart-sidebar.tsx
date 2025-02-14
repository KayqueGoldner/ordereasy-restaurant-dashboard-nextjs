"use client";

import { FaCartShopping, FaCheck } from "react-icons/fa6";
import { CiMenuFries } from "react-icons/ci";
import { LuBadgePercent } from "react-icons/lu";
import Link from "next/link";
import { useState } from "react";

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
import { DiscountCodes } from "@/data/discount-codes";

interface CartSidebarProps {
  className?: string;
  isMobile: boolean;
}

export const CartSidebar = ({ className, isMobile }: CartSidebarProps) => {
  const [discountCode, setDiscountCode] = useState("");
  const { isOpen, onClose, onOpen } = useCartSidebar();
  const { items, totalDiscount, subTotal, tax, total, applyDiscountCode } =
    useCartData();

  const handleSidebar = () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  const handleDiscountCode = () => {
    const validateDiscountCode = DiscountCodes.find(
      (code) => code.code === discountCode,
    );

    if (validateDiscountCode) {
      if (new Date(validateDiscountCode.expires) < new Date()) {
        alert("Code expired.");
        setDiscountCode("");
        return;
      }

      applyDiscountCode(validateDiscountCode.code, validateDiscountCode.amount);
    } else {
      alert("Invalid code.");
    }

    setDiscountCode("");
  };

  const collapseSidebar = !isOpen && isMobile === false;

  return (
    <div
      className={cn(
        "hidden size-full max-w-md shrink-0 flex-col gap-1 overflow-hidden rounded-xl bg-white px-3 py-2 transition-all duration-700 lg:flex",
        collapseSidebar && "w-16 items-center px-0 transition-all duration-300",
        className,
      )}
    >
      <div className="flex items-center gap-4 border-b pb-1.5 lg:justify-between">
        <div
          className={cn(
            "flex size-7 items-center justify-between rounded-full",
            collapseSidebar && "hidden",
          )}
        >
          <FaCartShopping className="size-4 text-primary" />
        </div>
        <h1 className={cn("text-lg", collapseSidebar && "hidden")}>
          Customer&apos;s name
        </h1>
        <Button
          className="hidden size-7 rounded-full p-0 lg:flex"
          onClick={handleSidebar}
        >
          <CiMenuFries className="size-4 stroke-2 text-white" />
        </Button>
      </div>
      <ScrollArea
        className={cn("flex-1 py-5 pr-3", collapseSidebar && "w-16 px-1.5")}
      >
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
                isSidebarOpen={collapseSidebar}
              />
            ))
          ) : (
            <h1
              className={cn(
                "block text-center text-xl",
                collapseSidebar && "hidden",
              )}
            >
              The cart is empty
            </h1>
          )}
        </ul>
      </ScrollArea>
      <div className="min-h-max">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3 className={collapseSidebar ? "hidden" : ""}>Subtotal</h3>
            <div
              className={cn("flex items-center", collapseSidebar && "hidden")}
            >
              <span className="leading-none">$</span>
              <div className="w-24 text-center">{subTotal}</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <h3 className={collapseSidebar ? "hidden" : ""}>Tax (15%)</h3>
            <div
              className={cn("flex items-center", collapseSidebar && "hidden")}
            >
              <span className="leading-none">$</span>
              <div className="w-24 text-center">{tax}</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <h3 className={collapseSidebar ? "hidden" : ""}>Discount</h3>
            <div
              className={cn("flex items-center", collapseSidebar && "hidden")}
            >
              <span className="leading-none">-$</span>
              <div className="w-24 text-center">{totalDiscount}</div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t py-2 text-base">
            <h3 className={collapseSidebar ? "hidden" : ""}>Total</h3>
            <div
              className={cn(
                "flex items-center",
                collapseSidebar && "size-12 flex-col justify-center text-sm",
              )}
            >
              <span className="leading-none">$</span>
              <div className="w-24 text-center">{total}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1">
          <div className={cn("flex flex-1 gap-2", collapseSidebar && "hidden")}>
            <div className="relative h-12 flex-1 rounded-full border border-green-600">
              <Input
                placeholder="Discount Code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                className="absolute inset-x-0 h-12 rounded-full border border-transparent bg-transparent uppercase placeholder:capitalize"
              />
              <Button
                className="absolute right-1 top-1/2 size-10 -translate-y-1/2 rounded-full bg-green-600 p-0 hover:bg-green-600/90"
                onClick={handleDiscountCode}
                disabled={!discountCode}
              >
                {discountCode ? (
                  <FaCheck className="size-4 text-white" />
                ) : (
                  <LuBadgePercent className="size-4 text-white" />
                )}
              </Button>
            </div>
          </div>
          <Button
            className={cn(
              "h-12 w-40 rounded-full",
              collapseSidebar && "size-10 rounded-full p-0",
            )}
            asChild
          >
            <Link href="/">
              {collapseSidebar ? (
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
        <CartSidebar className="flex max-w-full" isMobile={true} />
      </SheetContent>
    </Sheet>
  );
};
