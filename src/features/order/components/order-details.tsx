"use client";

import { FaCcStripe } from "react-icons/fa";
import Link from "next/link";

import { trpc } from "@/trpc/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";

interface OrderDetailsProps {
  orderId: string;
}

export const OrderDetails = ({ orderId }: OrderDetailsProps) => {
  const [orderData] = trpc.order.getOne.useSuspenseQuery({ orderId });

  if (!orderData) return null;

  const user = orderData[0].users;
  const order = orderData[0].order;
  const orderItems = orderData.map((order) => ({
    ...order.orderItems,
    productName: order.productName,
  }));

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div className="flex min-h-screen w-full items-center justify-center py-10">
      <Card className="max-w-4xl p-2 py-0">
        <CardHeader className="pb-0">
          <div className="mb-5">
            <Logo className="text-xl" />
          </div>
          <CardTitle className="text-lg">Order details</CardTitle>
          <CardDescription className="font-medium">
            Order Number: #{order.orderNumber}
          </CardDescription>
        </CardHeader>
        <Separator className="my-3" />
        <CardContent className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-7">
            <div>
              <h1 className="text-sm font-semibold uppercase text-muted-foreground">
                Client Name
              </h1>
              <h1 className="font-medium">{user?.name}</h1>
            </div>
            <div>
              <h1 className="text-sm font-semibold uppercase text-muted-foreground">
                Client Address
              </h1>
              <h1 className="font-medium">{user?.address}</h1>
            </div>
            <Separator />
            <ul className="flex flex-col gap-y-3">
              {orderItems.map((order) => (
                <li
                  key={order?.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <h1 className="font-medium">x{order?.quantity}</h1>
                    <h1 className="my-1 font-medium leading-5">
                      {order.productName}
                    </h1>
                  </div>
                  <h2 className="font-semibold">
                    {formatCurrency(Number(order.price))}
                  </h2>
                </li>
              ))}
            </ul>
            <Separator />
            <div className="flex items-center justify-between gap-10">
              <div>
                <h1 className="text-sm font-semibold uppercase text-muted-foreground">
                  Tax - 15%
                </h1>
                <h1 className="font-medium">
                  {formatCurrency(Number(order.tax))}
                </h1>
              </div>
              <div>
                <h1 className="text-sm font-semibold uppercase text-muted-foreground">
                  Total Discount
                </h1>
                <h1 className="font-medium">
                  {formatCurrency(Number(order.totalDiscount))}
                </h1>
              </div>
              <div>
                <h1 className="text-sm font-semibold uppercase text-muted-foreground">
                  Sub Total
                </h1>
                <h1 className="font-medium">
                  {formatCurrency(Number(order.subTotal))}
                </h1>
              </div>
              <div>
                <h1 className="text-sm font-semibold uppercase text-muted-foreground">
                  Total
                </h1>
                <h1 className="font-medium">
                  {formatCurrency(Number(order.totalPrice))}
                </h1>
              </div>
            </div>
          </div>
          <Button className="w-full" asChild>
            <Link href={order.sessionUrl as string} target="_blank">
              <FaCcStripe className="size-5" />
              Pay with Stripe
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
