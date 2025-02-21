"use client";

import { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { LuBadgePercent } from "react-icons/lu";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { calculateCartInfo, useCartData } from "@/hooks/use-cart-data";
import { DiscountCodes } from "@/data/discount-codes";
import { trpc } from "@/trpc/client";

export const CartDiscountInput = () => {
  const [discountCode, setDiscountCode] = useState("");
  const { applyDiscountCode, items, discounts } = useCartData();
  const updateCart = trpc.cart.updateData.useMutation({
    onSuccess: () => {
      toast.success("Cart updated");
    },
  });

  const handleDiscountCode = () => {
    const validateDiscountCode = DiscountCodes.find(
      (code) => code.code === discountCode,
    );

    if (validateDiscountCode) {
      if (new Date(validateDiscountCode.expires) < new Date()) {
        toast.error("Code expired.");
        setDiscountCode("");
        return;
      }

      applyDiscountCode(
        validateDiscountCode.code,
        Number(validateDiscountCode.amount),
      );
    } else {
      toast.error("Invalid code.");
      setDiscountCode("");
      return;
    }

    updateCart.mutate(
      calculateCartInfo(items, [
        ...discounts,
        {
          amount: validateDiscountCode.amount,
          code: validateDiscountCode.code,
        },
      ]),
    );
    toast.success("Code applied!");
    setDiscountCode("");
  };

  return (
    <div className="relative h-12 flex-1 rounded-full border border-green-600">
      <Input
        placeholder="Discount Code"
        value={discountCode}
        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
        className="absolute inset-x-0 h-12 rounded-full border border-transparent bg-transparent uppercase placeholder:capitalize"
        disabled={updateCart.isPending}
      />
      <Button
        className="absolute right-1 top-1/2 size-10 -translate-y-1/2 rounded-full bg-green-600 p-0 hover:bg-green-600/90"
        onClick={handleDiscountCode}
        disabled={!discountCode || updateCart.isPending}
      >
        {updateCart.isPending && (
          <Loader2Icon className="size-4 animate-spin text-white" />
        )}
        {discountCode && !updateCart.isPending ? (
          <FaCheck className="size-4 text-white" />
        ) : (
          <LuBadgePercent className="size-4 text-white" />
        )}
      </Button>
    </div>
  );
};
