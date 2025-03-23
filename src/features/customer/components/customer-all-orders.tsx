"use client";

import {
  flexRender,
  getCoreRowModel,
  ColumnFiltersState,
  SortingState,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { format } from "date-fns";
import { parseAsString, useQueryState } from "nuqs";

import { trpc } from "@/trpc/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";

import { columns } from "./customer-all-orders-columns";

export const CustomerAllOrders = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().setDate(1)),
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [datePeriod, setDatePeriod] = useQueryState(
    "allOrdersDatePeriod",
    parseAsString.withOptions({
      history: "push",
      shallow: false,
    }),
  );

  const [allOrders] = trpc.customer.getAllOrders.useSuspenseQuery({
    datePeriod:
      datePeriod ||
      `startDate=${format(new Date(new Date().setDate(1)), "yyyy-MM-dd")}&endDate=${format(
        new Date(),
        "yyyy-MM-dd",
      )}`,
  });

  const data = useMemo(
    () =>
      allOrders?.map((order) => ({
        orderNumber: order.orderNumber,
        dateAndTime: order.createdAt,
        paymentStatus: order.paymentStatus,
        totalPayment: order.totalPrice,
        orderStatus: order.status,
      })) || [],
    [allOrders],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      sorting,
    },
  });

  useEffect(() => {
    if (!startDate || !endDate) return;

    const newPeriod = `startDate=${format(startDate, "yyyy-MM-dd")}&endDate=${format(endDate, "yyyy-MM-dd")}`;
    setDatePeriod(newPeriod);
  }, [startDate, endDate, setDatePeriod]);

  return (
    <div className="w-full space-y-2 py-5">
      <h2 className="text-xl font-medium">My Orders ({data.length})</h2>
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search by order number"
          value={
            (table.getColumn("orderNumber")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("orderNumber")?.setFilterValue(event.target.value)
          }
          className="max-w-[240px] rounded-full shadow-none"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Date:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full shadow-none"
                disabled={!endDate}
              >
                {startDate
                  ? startDate.toLocaleDateString()
                  : "Select Start Date"}
                <IoCalendarOutline className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-max p-0" side="left">
              <Calendar
                mode="single"
                selected={startDate || undefined}
                onSelect={(date) => {
                  setStartDate(date || new Date(new Date().setMonth(0)));
                }}
                disabled={(date) =>
                  !endDate || date > endDate || date < new Date("1900-01-01")
                }
              />
            </PopoverContent>
          </Popover>
          <span className="text-sm text-muted-foreground">-</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full shadow-none"
              >
                {endDate ? endDate.toLocaleDateString() : "Select End Date"}
                <IoCalendarOutline className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px]" side="left">
              <Calendar
                mode="single"
                selected={endDate || undefined}
                onSelect={(date) => {
                  setEndDate(date || new Date());
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-none">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="px-1 pl-0">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-1 pl-0">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
