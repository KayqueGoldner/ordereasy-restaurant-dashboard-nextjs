"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa6";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import { cn } from "@/lib/utils";
import { useCartData } from "@/hooks/use-cart-data";
import { trpc } from "@/trpc/client";

interface CartCardProps {
  isSidebarOpen: boolean;
  product: CartItem;
}

export const CartCard = ({ isSidebarOpen, product }: CartCardProps) => {
  const [quantity, setQuantity] = useState(product.quantity || 1);
  const { items, updateQuantity, removeItem } = useCartData();
  const removeItemCart = trpc.cart.removeItem.useMutation();
  const updateItemCart = trpc.cart.updateItem.useMutation();

  useEffect(() => {
    updateQuantity(product.id, quantity);
  }, [quantity, product.id, updateQuantity]);

  useEffect(() => {
    setQuantity(items.find((item) => item.id === product.id)?.quantity || 1);
  }, [items, product.id]);

  const handleQuantity = (quantity: number) => {
    setQuantity(quantity);
    updateItemCart.mutate({
      productId: product.id,
      quantity,
    });
  };

  const handleRemoveProduct = () => {
    removeItemCart.mutate({
      productId: product.id,
    });
    removeItem(product.id);
  };

  return (
    <li
      className={cn(
        "flex h-16 w-full shrink-0 items-start justify-between gap-3",
        isSidebarOpen && "h-12",
      )}
    >
      <div
        className={cn(
          "flex h-full w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-200",
          isSidebarOpen && "size-full",
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
        <div className="max-w-[18ch] flex-1 space-y-1 pt-1">
          <h1 className="truncate text-base">{product.name}</h1>
          <h3 className="truncate text-sm font-medium text-muted-foreground">
            ${product.price}
          </h3>
        </div>
        <div className="flex gap-x-1.5">
          <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-1.5 py-1">
            <Button
              className="size-5 rounded-full p-0"
              onClick={() => handleQuantity(Math.max(1, quantity - 1))}
              disabled={removeItemCart.isPending || updateItemCart.isPending}
            >
              <FaMinus className="size-3" />
            </Button>
            <p className="min-w-5 text-center text-sm font-semibold">
              {quantity}
            </p>
            <Button
              className="size-5 rounded-full p-0"
              onClick={() => handleQuantity(Math.max(1, quantity + 1))}
              disabled={removeItemCart.isPending || updateItemCart.isPending}
            >
              <FaPlus className="size-3" />
            </Button>
          </div>
          <Hint text="Remove" side="top" className="px-2 py-1" asChild>
            <Button
              variant="outline"
              className="size-7 h-auto rounded-full p-0 text-xs font-semibold"
              onClick={handleRemoveProduct}
              disabled={removeItemCart.isPending || updateItemCart.isPending}
            >
              <FaTrash className="size-[14px] text-primary" />
            </Button>
          </Hint>
        </div>
      </div>
    </li>
  );
};
