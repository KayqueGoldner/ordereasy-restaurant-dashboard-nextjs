"use client";

import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { CustomerGetOrdersOutput } from "@/features/customer/types";

export type OrderItem = {
  id: string;
  orderNumber: number;
  products: string[];
  totalPrice: string;
  paymentStatus: CustomerGetOrdersOutput[number]["paymentStatus"];
  orderStatus: CustomerGetOrdersOutput[number]["status"];
  createdAt: Date;
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
        <ul className="text-lg font-medium">
          {(info.getValue() as string[]).map((product, index) => {
            return (
              <li key={index} className="text-base/7 font-medium">
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
          className="w-max gap-2 px-0"
        >
          Created At
          <ArrowUpDown className="size-4" />
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
