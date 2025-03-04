"use client";

import { Loader2Icon } from "lucide-react";
import { FaCartShopping } from "react-icons/fa6";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useCartData } from "@/hooks/use-cart-data";

interface CartOrderButtonProps {
  collapseSidebar: boolean;
}

export const CartOrderButton = ({ collapseSidebar }: CartOrderButtonProps) => {
  const router = useRouter();
  const { total, subTotal, tax, totalDiscount } = useCartData();

  const createOrder = trpc.order.create.useMutation();

  const onCreateOrder = () => {
    createOrder.mutate(
      {
        paymentProvider: "STRIPE",
        totalPrice: total,
        subTotal,
        tax,
        totalDiscount,
      },
      {
        onSuccess(data) {
          router.push(`/order/${data.id}`);
        },
      },
    );
  };

  return (
    <Button
      className={cn(
        "h-12 w-40 rounded-full",
        collapseSidebar && "size-10 rounded-full p-0",
      )}
      onClick={onCreateOrder}
      disabled={createOrder.isPending}
    >
      {createOrder.isPending ? (
        <>
          <Loader2Icon className="size-4 animate-spin" />
          processing...
        </>
      ) : collapseSidebar ? (
        <FaCartShopping className="size-4" />
      ) : (
        <>Place Order</>
      )}
    </Button>
  );
};
