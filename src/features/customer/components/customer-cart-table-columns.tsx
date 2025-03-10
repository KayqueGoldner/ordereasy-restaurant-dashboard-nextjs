"use client";

import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { CustomerGetOrdersOutput } from "@/features/customer/types";
import { cn } from "@/lib/utils";

export type OrderItem = {
  id: string;
  orderNumber: number;
  products: string[];
  totalPrice: string;
  paymentStatus: CustomerGetOrdersOutput[number]["paymentStatus"];
  orderStatus: CustomerGetOrdersOutput[number]["status"];
  createdAt: Date;
  order: string;
};

export const columns: ColumnDef<OrderItem>[] = [
  {
    accessorKey: "orderNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-max gap-2 px-0"
        >
          Order Number
          <ArrowUpDown className="size-4" />
        </Button>
      );
    },
    cell: (info) => {
      return (
        <div className="text-lg font-medium">#{info.getValue() as number}</div>
      );
    },
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: (info) => {
      return (
        <ul className="max-w-xs text-lg font-medium">
          {(info.getValue() as string[]).map((product, index) => {
            return (
              <li key={index} className="truncate text-base/7 font-medium">
                {product}
              </li>
            );
          })}
        </ul>
      );
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: (info) => {
      return (
        <div className="text-base font-medium">
          ${info.getValue() as number}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-max gap-2 px-0"
        >
          Payment Status
          <ArrowUpDown className="size-4" />
        </Button>
      );
    },
    cell: (info) => {
      return (
        <div className="text-base font-medium">{info.getValue() as string}</div>
      );
    },
  },
  {
    accessorKey: "orderStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-max gap-2 px-0"
        >
          Order Status
          <ArrowUpDown className="size-4" />
        </Button>
      );
    },
    cell: (info) => {
      return (
        <div className="text-base font-medium">{info.getValue() as string}</div>
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
          className="w-max gap-2"
        >
          Date and Time
          <ArrowUpDown className="size-4" />
        </Button>
      );
    },
    cell: (info) => {
      return (
        <div className="pl-4 text-sm font-medium">
          {new Date(info.getValue() as Date).toLocaleDateString()} -{" "}
          {new Date(info.getValue() as Date).toLocaleTimeString("en-US", {
            timeZone: "UTC",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "order",
    cell: (info) => {
      return (
        <Link
          href={`/order/${info.getValue() as string}`}
          className={cn(
            buttonVariants(),
            "bg-transparent px-0 text-blue-500 shadow-none hover:bg-transparent",
          )}
        >
          Detail
        </Link>
      );
    },
  },
];
