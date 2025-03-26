"use client";

import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/db/schema/order";

export type OrderItem = {
  orderNumber: number;
  dateAndTime: Date;
  customerName: string | null;
  paymentStatus: "PENDING" | "FAILED" | "SUCCEEDED";
  totalPayment: string;
  orderStatus: OrderStatus;
};

export const columns: ColumnDef<OrderItem>[] = [
  {
    accessorKey: "orderNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="rounded-full border border-neutral-200 px-4 py-2 text-[13px]"
        >
          Order
          <ArrowUpDown className="size-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      return (
        <div className="pl-4 text-sm font-medium">{getValue() as number}</div>
      );
    },
  },
  {
    accessorKey: "dateAndTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full rounded-full border border-neutral-200 px-4 py-2 text-[13px]"
        >
          Date & Time
          <ArrowUpDown className="size-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      return (
        <div className="pl-4 text-center text-sm">
          {(getValue() as Date).toLocaleDateString()} -{" "}
          {format(getValue() as Date, "HH:mm a")}
        </div>
      );
    },
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="rounded-full border border-neutral-200 px-4 py-2 text-[13px]"
        >
          Customer Name
          <ArrowUpDown className="size-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      return <div className="text-center text-sm">{getValue() as string}</div>;
    },
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="rounded-full border border-neutral-200 px-4 py-2 text-[13px]"
        >
          Payment Status
          <ArrowUpDown className="size-4" />
        </Button>
      );
    },
    cell: (info) => {
      return (
        <div className="text-center text-sm">{info.getValue() as string}</div>
      );
    },
  },
  {
    accessorKey: "totalPayment",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="rounded-full border border-neutral-200 px-4 py-2 text-[13px]"
        >
          Total Payment
          <ArrowUpDown className="size-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      return (
        <div className="text-center text-sm">$ {getValue() as string}</div>
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
          className="rounded-full border border-neutral-200 px-4 py-2 text-[13px]"
        >
          Order Status
          <ArrowUpDown className="size-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      return (
        <div className="pr-4 text-right text-sm">{getValue() as string}</div>
      );
    },
  },
];
