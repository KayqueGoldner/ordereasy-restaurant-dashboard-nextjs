"use client";

import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/client";

export const ReportClient = () => {
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState("");

  const trpcUtils = trpc.useUtils();
  const [discounts] = trpc.report.getDiscounts.useSuspenseQuery();
  const createDiscount = trpc.discount.create.useMutation();

  const createDiscountCode = () => {
    if (!code || !amount) return;

    createDiscount.mutate(
      {
        code,
        amount,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
      {
        onSuccess: () => {
          toast.success("Discount created");
          trpcUtils.report.getDiscounts.invalidate();
          setCode("");
          setAmount("");
        },
        onError(error) {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="h-10 w-[230px]"
        />
        <Input
          placeholder="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-10 w-[230px]"
        />
        <Button
          onClick={createDiscountCode}
          disabled={createDiscount.isPending}
        >
          Create
        </Button>
      </div>
      {discounts.length > 0 && (
        <ul className="mt-5">
          {discounts.map((discount) => (
            <li key={discount.id}>
              {discount.code} - ${discount.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
