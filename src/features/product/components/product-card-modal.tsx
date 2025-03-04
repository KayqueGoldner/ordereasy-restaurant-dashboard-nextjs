"use client";

import Image from "next/image";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { BsCartCheck } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCartData } from "@/hooks/use-cart-data";
import { ResponsiveModal } from "@/components/responsive-modal";

import { useProductCardModal } from "../hooks/use-product-card-modal";

export const ProductCardModal = () => {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [success, setSuccess] = useState(false);
  const { product: productCard, closeModal } = useProductCardModal();
  const { addItem, items } = useCartData();
  const trpcUtils = trpc.useUtils();

  const addToCart = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      trpcUtils.cart.getData.invalidate();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("You must be logged to save your cart!");
      } else {
        toast.error(error.message);
      }
    },
  });

  const existingCartItem = items.find((item) => item.id === productCard?.id);

  useEffect(() => {
    if (!productCard) return;

    setQuantity(existingCartItem?.quantity || 1);
    setNote(existingCartItem?.note || "");
  }, [productCard, existingCartItem]);

  if (!productCard) return null;

  console.log(productCard);

  const handleAddToCart = () => {
    const existingItem = items.find((item) => item.id === productCard.id);

    if (existingItem?.quantity === quantity && existingItem?.note === note)
      return;

    addItem({
      id: productCard.id,
      imageUrl: productCard.imageUrl,
      categoryName: productCard.categoryName,
      name: productCard.name as string,
      description: productCard.description,
      price: productCard.price,
      quantity,
      note,
    });

    addToCart.mutate({
      productId: productCard.id,
      price: productCard.price,
      quantity,
      note,
    });
  };

  return (
    <ResponsiveModal
      title="Product Details"
      titleClassName="text-center"
      headerClassName="pt-3"
      contentClassName="gap-1 overflow-hidden !rounded-2xl border-none p-0"
      open={!!productCard}
      onOpenChange={closeModal}
    >
      <div className="overflow-y-auto">
        <div className="px-4 py-3">
          <div className="mt-2">
            <div className="flex items-center justify-center rounded-xl bg-neutral-100">
              <Image
                src={productCard.imageUrl}
                alt={productCard.name || "Product image"}
                width={256}
                height={256}
                className="h-48 w-56 rounded-xl object-cover"
              />
            </div>
            <div className="mt-1.5 space-y-1.5">
              <Badge className="h-5 px-1.5 py-0">
                {productCard.categoryName}
              </Badge>
              <h1 className="text-xl font-medium">{productCard.name}</h1>
              <p className="text-sm text-muted-foreground">
                {productCard.description}
              </p>
              <h3 className="text-xl font-bold text-primary">
                ${productCard.price}
              </h3>
              <Textarea
                placeholder="Add notes to order"
                className="block h-20 resize-none rounded-xl border-0 bg-neutral-100"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="flex items-center justify-between gap-2 rounded-full bg-neutral-100 px-1.5 py-1">
                <Button
                  className="size-8 rounded-full p-0"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  <FaMinus className="size-3" />
                </Button>
                <p className="text-center text-lg font-semibold">{quantity}</p>
                <Button
                  className="size-8 rounded-full p-0"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  <FaPlus className="size-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Button
          className="h-14 w-full rounded-none"
          onClick={handleAddToCart}
          disabled={addToCart.isPending || success}
        >
          {addToCart.isPending && (
            <>
              <Loader2Icon className="size-5 animate-spin" />
              updating...
            </>
          )}

          {!success && !addToCart.isPending && (
            <>
              {!existingCartItem ? "Add to Cart" : "Update Cart"}
              <span>
                (${(Number(productCard.price) * quantity).toFixed(2)})
              </span>
            </>
          )}

          {success && (
            <>
              <BsCartCheck className="size-5" />
              Cart Updated
            </>
          )}
        </Button>
      </div>
    </ResponsiveModal>
  );
};
