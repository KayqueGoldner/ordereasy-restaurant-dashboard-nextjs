"use client";

import { Loader2Icon } from "lucide-react";
import { FaCartShopping } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useCartData } from "@/hooks/use-cart-data";
import { useUserSettingsModal } from "@/features/user/hooks/use-user-settings-modal";
import { useSignInFormModal } from "@/features/user/hooks/use-sign-in-form-modal";

interface CartOrderButtonProps {
  collapseSidebar: boolean;
  disabled?: boolean;
}

export const CartOrderButton = ({
  collapseSidebar,
  disabled,
}: CartOrderButtonProps) => {
  const router = useRouter();
  const { items } = useCartData();
  const { openModal: openUserSettingsModal } = useUserSettingsModal();
  const { openModal: openSignInModal } = useSignInFormModal();

  const createOrder = trpc.order.create.useMutation({
    onSuccess(data) {
      router.push(`/order/${data.id}`);
    },
    onError(error) {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("You must be logged in to place an order.");
        openSignInModal();
      } else if (error.message === "ADDRESS_ERROR") {
        toast.error("You need to add your address to place an order.");
        openUserSettingsModal("address");
      } else {
        toast.error(error.message);
      }
    },
  });

  const onCreateOrder = () => {
    createOrder.mutate({ paymentProvider: "STRIPE" });
  };

  return (
    <Button
      className={cn(
        "h-12 w-40 rounded-full",
        collapseSidebar && "size-10 rounded-full p-0",
      )}
      onClick={onCreateOrder}
      disabled={disabled || createOrder.isPending || items.length === 0}
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
