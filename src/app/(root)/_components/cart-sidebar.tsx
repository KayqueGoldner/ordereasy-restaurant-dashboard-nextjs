"use client";

import { FaCartShopping } from "react-icons/fa6";
import { CiMenuFries } from "react-icons/ci";
import { LuBadgePercent } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { CartCard } from "./cart-card";
import Link from "next/link";

export const CartSidebar = () => {
  return (
    <div className="flex size-full flex-col gap-1 overflow-hidden rounded-xl bg-white px-3 py-2">
      <div className="flex items-center justify-between border-b pb-1.5">
        <div className="flex size-7 items-center justify-center rounded-full">
          <FaCartShopping className="size-4 text-primary" />
        </div>
        <h1 className="text-lg">Customer&apos;s name</h1>
        <Button className="size-7 rounded-full p-0">
          <CiMenuFries className="size-4 stroke-2 text-white" />
        </Button>
      </div>
      <ScrollArea className="flex-1 px-2 py-5 pr-3">
        <ul className="flex h-max flex-col gap-2 overflow-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-2">
          {Array.from({ length: 6 }, (_, index) => (
            <CartCard key={index} />
          ))}
        </ul>
      </ScrollArea>
      <div className="min-h-max">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3>Subtotal</h3>
            <div className="flex items-center">
              <span>$</span>
              <div className="w-24 text-center">5.00</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <h3>Tax (15%)</h3>
            <div className="flex items-center">
              <span>$</span>
              <div className="w-24 text-center">5,75</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <h3>Discount</h3>
            <div className="flex items-center">
              <span>-$</span>
              <div className="w-24 text-center">0.00</div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t py-2 text-base">
            <h3>Total</h3>
            <div className="flex items-center">
              <span>$</span>
              <div className="w-24 text-center">0.00</div>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <div className="flex flex-1 gap-2">
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
          <Button className="h-12 w-40 rounded-full">
            <Link href="/">Place Order</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
