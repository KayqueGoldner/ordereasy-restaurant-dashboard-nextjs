import Image from "next/image";

import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="flex h-56 w-full flex-col gap-1.5 rounded-xl bg-white p-2">
      <div className="flex h-36 w-full items-center justify-center overflow-hidden rounded-xl bg-accent">
        <Image
          src={product.image}
          alt={product.name}
          width={256}
          height={148}
          className="aspect-square size-full object-cover"
        />
      </div>
      <div className="w-full space-y-2">
        <h1 className="truncate leading-5">{product.name}</h1>
        <div className="flex justify-between">
          <Badge className="h-5 px-1.5 py-0">{product.category}</Badge>
          <h3 className="font-medium">${product.price}</h3>
        </div>
      </div>
    </div>
  );
};
