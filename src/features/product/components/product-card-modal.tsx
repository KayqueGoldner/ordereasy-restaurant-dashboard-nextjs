"use client";

import Image from "next/image";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCartData } from "@/hooks/use-cart-data";

import { useProductCardModal } from "../hooks/use-product-card-modal";

export const ProductCardModal = () => {
  const [quantity, setQuantity] = useState(1);
  const { product, closeModal } = useProductCardModal();
  const { addItem } = useCartData();

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const handlePlaceOrder = () => {
    addItem({
      id: product.id,
      image: product.imageUrl,
      name: product.name,
      price: product.price,
      quantity,
    });
  };

  return (
    <Dialog open={!!product} onOpenChange={closeModal}>
      <DialogContent className="gap-1 overflow-hidden !rounded-2xl border-none p-0">
        <div className="px-4 py-3">
          <DialogHeader className="p-0">
            <DialogTitle className="text-center">Product Details</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <div className="flex items-center justify-center rounded-xl bg-neutral-100">
              <Image
                src={product.imageUrl}
                alt={product.name || "Product image"}
                width={256}
                height={256}
                className="h-48 w-56 rounded-xl object-cover"
              />
            </div>
            <div className="mt-1.5 space-y-1.5">
              <Badge className="h-5 px-1.5 py-0">{product.category}</Badge>
              <h1 className="text-xl font-medium">{product.name}</h1>
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
              <h3 className="text-xl font-bold text-primary">
                ${product.price}
              </h3>
              <Textarea
                placeholder="Add notes to order"
                className="block h-20 resize-none rounded-xl border-0 bg-neutral-100"
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
        <Button className="h-14 w-full rounded-none" onClick={handlePlaceOrder}>
          Add to cart
        </Button>
      </DialogContent>
    </Dialog>
  );
};
