"use client";

import { GoGraph } from "react-icons/go";
import { AiOutlineDollar } from "react-icons/ai";
import { format } from "date-fns";
import { CiCalendarDate } from "react-icons/ci";
import { FaCartShopping } from "react-icons/fa6";

import { trpc } from "@/trpc/client";

export const CustomerOverview = () => {
  const [data] = trpc.customer.getOrdersOverview.useSuspenseQuery();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-min flex-1 rounded-xl border border-neutral-200 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-muted p-2">
              <GoGraph className="size-4" />
            </div>
            <h1 className="text-base">Total Spent</h1>
          </div>
          <div className="flex items-baseline justify-between pt-4">
            <h1 className="text-2xl font-semibold">
              {data.totalSpent.toFixed(2)}
            </h1>
            <span className="text-base font-medium text-muted-foreground">
              USD
            </span>
          </div>
        </div>
        <div className="min-w-min flex-1 rounded-xl border border-neutral-200 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-muted p-2">
              <FaCartShopping className="size-4" />
            </div>
            <h1 className="text-base">Total Orders</h1>
          </div>
          <div className="flex items-baseline justify-between pt-4">
            <h1 className="text-2xl font-semibold">{data.orderCount}</h1>
            <span className="text-base font-medium text-muted-foreground">
              Orders
            </span>
          </div>
        </div>
        <div className="min-w-min flex-1 rounded-xl border border-neutral-200 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-muted p-2">
              <AiOutlineDollar className="size-4" />
            </div>
            <h1 className="text-base">Average per Order</h1>
          </div>
          <div className="flex items-baseline justify-between pt-4">
            <h1 className="text-2xl font-semibold">
              {data.averageOrderValue.toFixed(2)}
            </h1>
            <span className="text-base font-medium text-muted-foreground">
              USD
            </span>
          </div>
        </div>
        <div className="min-w-min flex-1 rounded-xl border border-neutral-200 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-muted p-2">
              <CiCalendarDate className="size-4" />
            </div>
            <h1 className="text-base">Last Order Date</h1>
          </div>
          <div className="flex items-baseline justify-between pt-4">
            <h1 className="whitespace-nowrap text-2xl font-semibold">
              {format(data.lastOrderDate, "MMM dd, yyyy")}
            </h1>
            <span className="text-base font-medium text-muted-foreground">
              Date
            </span>
          </div>
        </div>
        <div className="min-w-min flex-1 rounded-xl border border-neutral-200 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-muted p-2">
              <CiCalendarDate className="size-4" />
            </div>
            <h1 className="text-base">First Order Date</h1>
          </div>
          <div className="flex items-baseline justify-between pt-4">
            <h1 className="whitespace-nowrap text-2xl font-semibold">
              {format(data.firstOrderDate, "MMM dd, yyyy")}
            </h1>
            <span className="text-base font-medium text-muted-foreground">
              Date
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
