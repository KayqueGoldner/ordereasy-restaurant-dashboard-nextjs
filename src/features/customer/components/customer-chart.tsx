"use client";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { IoCalendarOutline } from "react-icons/io5";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/client";

type DatePeriod = "MONTHLY" | "QUARTERLY" | "YEARLY";

const PERIOD_LABELS = {
  MONTHLY: "Daily orders for the current month",
  QUARTERLY: "Weekly orders for the current quarter",
  YEARLY: "Monthly orders for the current year",
};

const CHART_COLORS = {
  "Total Spent": "hsl(var(--chart-1))",
  "Order Count": "hsl(var(--chart-2))",
  "Average Order Value": "hsl(var(--chart-3))",
};

export const CustomerChart = () => {
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

  const [chartData, { isPending }] =
    trpc.customer.getOrdersChart.useSuspenseQuery({
      datePeriod,
    });

  // Transform data for Recharts
  const transformedData = chartData?.labels.map((label, index) => {
    const dataPoint: Record<string, number | string> = {
      name: label as string,
    };
    chartData.datasets.forEach((dataset) => {
      dataPoint[dataset.name] = dataset.data[index];
    });
    return dataPoint;
  });

  // Get the currently selected dataset (default to first one)
  const selectedDataset = chartData?.datasets[0];
  const periodLabel = chartData?.labels?.length
    ? `${chartData.labels[0]} - ${chartData.labels.at(-1)}`
    : "";

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <Card className="max-w-full border-none py-5 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Order History</CardTitle>
          <CardDescription>{PERIOD_LABELS[datePeriod]}</CardDescription>
        </div>
        <Select
          value={datePeriod}
          onValueChange={(value) => setDatePeriod(value as DatePeriod)}
        >
          <SelectTrigger className="w-max min-w-[140px] rounded-full">
            <SelectValue>
              <span className="flex items-center gap-4 px-2 font-medium">
                {datePeriod}
                <IoCalendarOutline className="size-4 text-primary" />
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {periodOrder.map((period) => (
              <SelectItem key={period} value={period}>
                {period}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-[300px] w-full" />
        ) : transformedData?.length ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={transformedData}
                margin={{ top: 10, right: 0, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-sm"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) =>
                    selectedDataset.type === "currency"
                      ? formatCurrency(value)
                      : value.toString()
                  }
                  className="text-sm"
                />
                <Tooltip
                  formatter={(value, name) => {
                    const dataset = chartData?.datasets.find(
                      (d) => d.name === name,
                    );

                    return [
                      dataset?.type === "currency"
                        ? formatCurrency(value as number)
                        : value,
                      dataset?.name || name,
                    ];
                  }}
                />
                {chartData.datasets.map((dataset) => (
                  <Area
                    key={dataset.name}
                    type="monotone"
                    dataKey={dataset.name}
                    stroke={
                      CHART_COLORS[dataset.name as keyof typeof CHART_COLORS] ||
                      "#8884d8"
                    }
                    fill={
                      CHART_COLORS[dataset.name as keyof typeof CHART_COLORS] ||
                      "#8884d8"
                    }
                    fillOpacity={0.3}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-muted-foreground">
              No order data available for the selected period
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {selectedDataset?.name || "Order"} Overview{" "}
              <TrendingUp className="size-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {periodLabel}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
