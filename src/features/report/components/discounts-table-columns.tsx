"use client";

import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";

export type OrderItem = {
  code: string;
  amount: string;
  expires: Date;
  redeemedCount: number;
  usedCount: number;
  totalSaved: number;
  createdAt: Date;
};

export const columns: ColumnDef<OrderItem>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full rounded-full border border-neutral-200 px-4 py-2 text-[13px]"
        >
          Code
          <ArrowUpDown className="size-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      return (
        <div className="pl-4 text-center text-sm">{getValue() as string}</div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full rounded-full border border-neutral-200 px-4 py-2 text-[13px]"
        >
          Amount
          <ArrowUpDown className="size-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      return (
        <div className="pl-4 text-center text-sm">${getValue() as number}</div>
      );
    },
  },
  {
    accessorKey: "expires",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full rounded-full border border-neutral-200 px-4 py-2 text-[13px]"
        >
          Expires
          <ArrowUpDown className="size-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      return (
        <div className="pl-4 text-center text-sm">
          {format(getValue() as Date, "MMM d, yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "redeemedCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full rounded-full border border-neutral-200 px-4 py-2 text-[13px]"
        >
          Redeemed
          <ArrowUpDown className="size-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      return (
        <div className="pl-4 text-center text-sm">{getValue() as number}</div>
      );
    },
  },
  {
    accessorKey: "usedCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full rounded-full border border-neutral-200 px-4 py-2 text-[13px]"
        >
          Used
          <ArrowUpDown className="size-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      return (
        <div className="pl-4 text-center text-sm">{getValue() as number}</div>
      );
    },
  },
  {
    accessorKey: "totalSaved",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full rounded-full border border-neutral-200 px-4 py-2 text-[13px]"
        >
          Saved
          <ArrowUpDown className="size-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      return (
        <div className="pl-4 text-center text-sm">${getValue() as number}</div>
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
          className="w-full rounded-full border border-neutral-200 px-4 py-2 text-[13px]"
        >
          Created At
          <ArrowUpDown className="size-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      return (
        <div className="pl-4 text-center text-sm">
          {format(getValue() as Date, "MMM d, yyyy")}
        </div>
      );
    },
  },
];
