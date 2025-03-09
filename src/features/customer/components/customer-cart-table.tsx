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
import { useMemo, useState } from "react";

import { trpc } from "@/trpc/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { columns, OrderItem } from "./customer-cart-table-columns";

export const CustomerCartTable = () => {
  const [orders] = trpc.customer.getOrders.useSuspenseQuery();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const data = useMemo(() => {
    const groupedOrders = orders.reduce((acc, order) => {
      const existingOrder = acc.find((item) => item.id === order.id);

      const productWithQuantity = `${order.orderItems.quantity}x ${order.orderItems.productName}`;

      if (existingOrder) {
        const existingProductIndex = existingOrder.products.findIndex(
          (item) => item === productWithQuantity,
        );

        if (existingProductIndex === -1) {
          existingOrder.products.push(productWithQuantity);
        }
      } else {
        acc.push({
          id: order.id!,
          orderNumber: order.orderNumber!,
          products: [productWithQuantity],
          totalPrice: order.totalPrice!,
          paymentStatus: order.paymentStatus!,
          orderStatus: order.status!,
          createdAt: order.createdAt!,
        });
      }

      return acc;
    }, [] as OrderItem[]);

    return groupedOrders;
  }, [orders]);

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

  return (
    <div className="space-y-5 rounded-md p-5">
      <h1 className="text-3xl font-bold">Orders</h1>
      <div className="space-y-5">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="space-x-2">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                    <TableCell key={cell.id} className="align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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
    </div>
  );
};
