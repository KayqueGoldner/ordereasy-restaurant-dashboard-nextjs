"use client";

import { FaPlus, FaMinus, FaTrash } from "react-icons/fa6";
import Image from "next/image";
import { SlNote } from "react-icons/sl";

import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import { cn } from "@/lib/utils";
import { useCartData } from "@/hooks/use-cart-data";
import { trpc } from "@/trpc/client";
import { useProductCardModal } from "@/features/product/hooks/use-product-card-modal";

interface CartCardProps {
  isSidebarOpen: boolean;
  product: CartItem;
}

export const CartCard = ({ isSidebarOpen, product }: CartCardProps) => {
  const { updateQuantity, removeItem, items } = useCartData();
  const { product: productModal } = useProductCardModal();

  const removeItemCart = trpc.cart.removeItem.useMutation();
  const updateItemCart = trpc.cart.updateItem.useMutation();

  const handleQuantity = (quantity: number) => {
    const itemToUpdate = items.find((item) => item.id === product.id);

    if (!itemToUpdate) return;

    itemToUpdate.quantity = quantity;

    updateQuantity(product.id, quantity);
    updateItemCart.mutate({
      productId: product.id,
      quantity,
    });
  };

  const handleRemoveProduct = () => {
    removeItemCart.mutate(
      {
        productId: product.id,
      },
      {},
    );
    removeItem(product.id);
  };

  return (
    <div
      className={cn(
        "relative flex h-16 w-full shrink-0 items-start justify-between gap-3 rounded-xl p-1 transition-all duration-200",
        isSidebarOpen && "h-12",
        productModal?.product
          ? productModal.product.id === product.id
            ? "opacity-300 bg-primary/10"
            : items.find((item) => item.id === productModal.product.id)
              ? "pointer-events-none opacity-50"
              : "opacity-100"
          : "opacity-100",
      )}
    >
      <div
        className={cn(
          "flex h-full w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-200 transition-all",
          isSidebarOpen && "size-full rounded-md",
        )}
      >
        <Image
          src={product.image}
          alt={product.name}
          width={256}
          height={256}
          className="size-full object-cover"
        />
      </div>
      <div
        className={cn(
          "flex flex-1 items-end justify-between",
          isSidebarOpen && "hidden",
        )}
      >
        <div className="max-w-[18ch] flex-1 shrink space-y-1 pt-1">
          <h1 className="truncate text-base">{product.name}</h1>
          <div className="flex items-center gap-1">
            <h3 className="truncate rounded-full px-1.5 font-semibold leading-4 text-primary">
              ${product.price}
            </h3>
            <Hint text="Edit note" asChild>
              <Button
                className="size-5 rounded-full p-0"
                onClick={() => {}} // TODO: add note modal
              >
                <SlNote className="size-3" />
              </Button>
            </Hint>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div
            className={cn(
              "flex items-center gap-2 rounded-full bg-neutral-100 px-1.5 py-1 transition-all",
            )}
          >
            <Button
              className="size-5 rounded-full p-0"
              onClick={() => handleQuantity(Math.max(1, product.quantity - 1))}
              disabled={removeItemCart.isPending || updateItemCart.isPending}
            >
              <FaMinus className="size-3" />
            </Button>
            <p className="min-w-4 text-center text-sm font-semibold">
              {product.quantity}
            </p>
            <Button
              className="size-5 rounded-full p-0"
              onClick={() => handleQuantity(Math.max(1, product.quantity + 1))}
              disabled={removeItemCart.isPending || updateItemCart.isPending}
            >
              <FaPlus className="size-3" />
            </Button>
          </div>
          <Hint text="Remove" side="top" className="px-2 py-1" asChild>
            <Button
              variant="outline"
              className="size-6 shrink-0 rounded-full p-0 text-xs font-semibold"
              onClick={handleRemoveProduct}
              disabled={removeItemCart.isPending || updateItemCart.isPending}
            >
              <FaTrash className="size-[14px] text-primary" />
            </Button>
          </Hint>
        </div>
      </div>
    </div>
  );
};
