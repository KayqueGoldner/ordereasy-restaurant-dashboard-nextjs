"use client";

import Image from "next/image";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

export type ProductItem = {
  id: string;
  image: string;
  name: string;
  category: string;
  description: string;
  price: string;
  createdAt: Date;
};

export const columns: ColumnDef<ProductItem>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <Image
          src={row.getValue("image") as string}
          width={124}
          height={124}
          alt="Product image"
          className="min-w-[100px] rounded-md"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => {
      return (
        <div className="text-lg font-medium">{info.getValue() as string}</div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: (info) => {
      return (
        <div className="text-lg font-medium">${info.getValue() as number}</div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: (info) => {
      return (
        <div className="w-max rounded-md bg-primary px-2 py-0.5 text-white">
          {info.getValue() as string}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: (info) => {
      return (
        <div className="line-clamp-3 max-w-[200px] text-sm font-medium">
          {info.getValue() as string}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: (info) => {
      return (
        <div className="pl-4 text-sm font-medium">
          {new Date(info.getValue() as Date).toLocaleDateString()}
        </div>
      );
    },
  },
];
