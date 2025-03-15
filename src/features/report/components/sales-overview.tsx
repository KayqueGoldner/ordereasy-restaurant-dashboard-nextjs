"use client";

import { GoGraph } from "react-icons/go";
import { MdInventory } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import { AiOutlineDollar } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { useQueryState, parseAsStringLiteral } from "nuqs";

import { trpc } from "@/trpc/client";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const SalesOverview = () => {
  const periodOrder = ["MONTHLY", "QUARTERLY", "YEARLY"] as const;
  const [datePeriod, setDatePeriod] = useQueryState(
    "datePeriod",
    parseAsStringLiteral(periodOrder)
      .withOptions({
        history: "push",
        shallow: false,
        clearOnDefault: true,
      })
      .withDefault("MONTHLY"),
  );

  const [data] = trpc.report.getSalesOverview.useSuspenseQuery({
    datePeriod: datePeriod,
  });

  const handleDatePeriodChange = (datePeriod: (typeof periodOrder)[number]) => {
    setDatePeriod(datePeriod);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">Date Period:</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-4 rounded-full">
              {datePeriod}
              <IoCalendarOutline className="size-4 text-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuCheckboxItem
              checked={datePeriod === "MONTHLY"}
              onCheckedChange={() => handleDatePeriodChange("MONTHLY")}
              disabled={datePeriod === "MONTHLY"}
            >
              Monthly
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={datePeriod === "QUARTERLY"}
              onCheckedChange={() => handleDatePeriodChange("QUARTERLY")}
              disabled={datePeriod === "QUARTERLY"}
            >
              Quarterly
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={datePeriod === "YEARLY"}
              onCheckedChange={() => handleDatePeriodChange("YEARLY")}
              disabled={datePeriod === "YEARLY"}
            >
              Yearly
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-min flex-1 rounded-xl border border-neutral-200 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-muted p-2">
              <GoGraph className="size-4" />
            </div>
            <h1 className="text-base">Total Sales</h1>
          </div>
          <div className="flex items-baseline justify-between pt-4">
            <h1 className="text-2xl font-semibold">
              {data.totalSales.toFixed(2)}
            </h1>
            <span className="text-base font-medium text-muted-foreground">
              USD
            </span>
          </div>
        </div>
        <div className="min-w-min flex-1 rounded-xl border border-neutral-200 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-muted p-2">
              <MdInventory className="size-4" />
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
              <FaUsers className="size-4" />
            </div>
            <h1 className="text-base">Total Customers</h1>
          </div>
          <div className="flex items-baseline justify-between pt-4">
            <h1 className="text-2xl font-semibold">{data.customersCount}</h1>
            <span className="text-base font-medium text-muted-foreground">
              Customers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
