"use client";

import Image from "next/image";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

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
          unoptimized
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Name
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
    cell: ({ getValue, row }) => {
      return (
        <div className="space-y-2">
          <h1 className="text-base font-medium">{getValue() as string}</h1>
          {/* render category */}
          <div className="w-max rounded-md bg-primary px-2 py-0.5 text-white">
            {row.original.category}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: (info) => {
      return (
        <div className="text-base font-medium">
          ${info.getValue() as number}
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
  {
    id: "actions",
    cell: ({ row }) => {
      const trpcUtils = trpc.useUtils();
      const deleteProduct = trpc.inventory.deleteProduct.useMutation();

      const handleDeleteProduct = () => {
        deleteProduct.mutate(
          {
            productId: row.original.id,
          },
          {
            onError: (error) => {
              toast.error(error.message);
            },
            onSuccess: () => {
              toast.success("Product deleted successfully");
              trpcUtils.inventory.getProducts.invalidate();
            },
          },
        );
      };

      return (
        <AlertDialog>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="px-3">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left">
              <DropdownMenuItem asChild>
                <Link href={`/admin/inventory/${row.original.id}`}>Edit</Link>
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-destructive hover:!bg-destructive hover:!text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                product.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={handleDeleteProduct}
                disabled={deleteProduct.isPending}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
