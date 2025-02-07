"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProductCardModal } from "@/features/product/hooks/use-product-card-modal";

export const ProductCardModal = () => {
  const { productId, closeModal } = useProductCardModal();

  return (
    <Dialog open={!!productId} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Card</DialogTitle>
          <DialogDescription>
            Here you can see the product details and add to cart
          </DialogDescription>
        </DialogHeader>
        <h1>{productId}</h1>
      </DialogContent>
    </Dialog>
  );
};
