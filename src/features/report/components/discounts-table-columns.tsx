"use client";

import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type OrderItem = {
  code: string;
  amount: string;
  expires: Date;
  isExpired: boolean;
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
    accessorKey: "isExpired",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full rounded-full border border-neutral-200 px-4 py-2 text-[13px]"
        >
          Expired
          <ArrowUpDown className="size-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      return (
        <div className="ml-5 flex items-center justify-start gap-2 text-center text-sm font-normal">
          <div
            className={cn(
              "size-3 rounded-full",
              getValue() ? "bg-destructive" : "bg-green-500",
            )}
          />
          {getValue() ? "Expired" : "Valid"}
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
        <div className="pl-4 text-center text-sm">
          {getValue() as number} Times
        </div>
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
        <div className="pl-4 text-center text-sm">
          {getValue() as number} Times
        </div>
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
