"use client";

import { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { LuBadgePercent } from "react-icons/lu";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/client";

export const CartDiscountInput = () => {
  const [discountCode, setDiscountCode] = useState("");

  const trpcUtils = trpc.useUtils();
  const updateCart = trpc.cart.updateData.useMutation();

  const handleDiscountCode = async () => {
    if (!discountCode) return;

    updateCart.mutateAsync(
      { discountCode },
      {
        onSuccess: () => {
          setDiscountCode("");
          toast.success("Discount code applied!");
          trpcUtils.cart.getData.invalidate();
        },
        onError(error) {
          toast.error(error.message);
        },
      },
    );
  };

  const disabled = !discountCode || updateCart.isPending;

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
        disabled={disabled}
      >
        {updateCart.isPending ? (
          <Loader2Icon className="size-4 animate-spin text-white" />
        ) : discountCode ? (
          <FaCheck className="size-4 text-white" />
        ) : (
          <LuBadgePercent className="size-4 text-white" />
        )}
      </Button>
    </div>
  );
};
