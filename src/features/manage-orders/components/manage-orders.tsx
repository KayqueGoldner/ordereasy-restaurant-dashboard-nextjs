"use client";

import { toast } from "sonner";
import { format } from "date-fns";

import { trpc } from "@/trpc/client";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { OrderStatus, OrderStatusEnumValues } from "@/db/schema/order";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ManageOrders = () => {
  const [orders] = trpc.manageOrders.getMany.useSuspenseQuery();

  const trpcUtils = trpc.useUtils();
  const updateOrderStatus = trpc.manageOrders.updateStatus.useMutation();

  const handleOrderStatusChange = (id: string, status: OrderStatus) => {
    updateOrderStatus.mutate(
      {
        id,
        status,
      },
      {
        onSuccess: () => {
          trpcUtils.manageOrders.getMany.invalidate();
          toast.success("Order status updated");
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Manage Orders ({orders.length})</h1>
      <div className="flex flex-wrap items-center gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className={cn(
              "flex flex-col gap-3 rounded-xl bg-neutral-100 p-4",
              order.paymentStatus === "SUCCEEDED"
                ? "bg-green-400/20"
                : order.paymentStatus === "FAILED"
                  ? "bg-red-400/20"
                  : "bg-yellow-400/20",
              order.status === "DELIVERED"
                ? "bg-green-400/20"
                : order.status === "CANCELLED"
                  ? "bg-red-400/20"
                  : "bg-yellow-400/20",
            )}
          >
            <div className="flex items-end justify-between gap-10">
              <h1 className="text-sm font-medium">
                Order #{order.orderNumber}
              </h1>
              {/* payment status */}
              <Badge
                variant={
                  order.paymentStatus === "SUCCEEDED"
                    ? "default"
                    : order.paymentStatus === "FAILED"
                      ? "destructive"
                      : "secondary"
                }
                className="w-max"
              >
                {order.paymentStatus === "SUCCEEDED"
                  ? "Paid"
                  : order.paymentStatus === "FAILED"
                    ? "Failed"
                    : "Waiting for payment"}
              </Badge>
            </div>
            <Separator />
            {order.user && (
              <div className="space-y-1">
                {/* user name */}
                <h2 className="text-sm font-medium">
                  <span className="text-muted-foreground">Client:</span>{" "}
                  {order.user.name}
                </h2>
                {/* order status */}
                <h2 className="text-sm font-medium">
                  <span className="text-muted-foreground">Status:</span>{" "}
                  {order.status}
                </h2>
                {/* order date */}
                <h2 className="text-sm font-medium">
                  <span className="text-muted-foreground">Date:</span>{" "}
                  {format(new Date(order.createdAt), "MMM d, yyyy - HH:mm a")}
                </h2>
              </div>
            )}
            <Separator />
            <Select
              defaultValue={order.status}
              disabled={
                order.paymentStatus !== "SUCCEEDED" ||
                updateOrderStatus.isPending
              }
              onValueChange={(value) => {
                handleOrderStatusChange(order.id, value as OrderStatus);
              }}
            >
              <SelectTrigger
                className={cn(
                  "w-full text-white",
                  order.paymentStatus === "FAILED"
                    ? "bg-red-500"
                    : "bg-primary",
                )}
              >
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                {OrderStatusEnumValues.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
};
