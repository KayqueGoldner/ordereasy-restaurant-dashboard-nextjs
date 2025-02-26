"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { useProductCardModal } from "@/features/product/hooks/use-product-card-modal";
import { Product } from "@/db/schema/products";
import { Category } from "@/db/schema/categories";

interface ProductCardProps {
  product: Product;
  category: Category;
}

export const ProductCard = ({ product, category }: ProductCardProps) => {
  const { openModal } = useProductCardModal();

  return (
    <div
      className="flex size-full cursor-pointer flex-col gap-1.5 rounded-xl bg-white p-2"
      onClick={() =>
        openModal({ product: product, categoryName: category.name })
      }
    >
      <div className="flex aspect-square size-full items-center justify-center overflow-hidden rounded-xl bg-accent">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={256}
          height={256}
          className="size-full object-cover"
        />
      </div>
      <div className="w-full space-y-2">
        <h1 className="truncate leading-5">{product.name}</h1>
        <div className="flex justify-between">
          <Badge className="h-5 px-1.5 py-0">{category.name}</Badge>
          <h3 className="font-medium">${product.price}</h3>
        </div>
      </div>
    </div>
  );
};
