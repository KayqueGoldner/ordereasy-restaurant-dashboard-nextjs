"use client";

import { trpc } from "@/trpc/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

export const FavoriteProducts = () => {
  const [data] = trpc.report.getTopProducts.useSuspenseQuery({
    limit: 5,
  });

  return (
    <div className="space-y-2 py-5">
      <h2 className="text-xl font-medium">Favorite Products</h2>
      <Table className="max-w-lg">
        <TableHeader>
          <TableRow className="border-none">
            <TableHead className="px-1 pl-0">
              <div className="rounded-full border border-neutral-200 px-4 py-2">
                Image
              </div>
            </TableHead>
            <TableHead className="px-1">
              <div className="truncate rounded-full border border-neutral-200 px-4 py-2">
                Name
              </div>
            </TableHead>
            <TableHead className="px-1">
              <div className="rounded-full border border-neutral-200 px-4 py-2">
                Total Orders
              </div>
            </TableHead>
            <TableHead className="px-1">
              <div className="rounded-full border border-neutral-200 px-4 py-2">
                Total Revenue
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product) => (
            <TableRow key={product.productId}>
              <TableCell className="p-0 py-1">
                <Image
                  src={product.productImage}
                  alt={product.productName}
                  width={100}
                  height={100}
                  className="size-14 rounded-md object-cover"
                  unoptimized
                />
              </TableCell>
              <TableCell className="p-0 py-1 text-center font-medium">
                {product.productName}
              </TableCell>
              <TableCell className="p-0 py-1 text-center font-medium">
                {product.totalQuantity} Times
              </TableCell>
              <TableCell className="py-1 text-right font-medium">
                ${product.totalRevenue.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
