"use client";

import { trpc } from "@/trpc/client";

export const CustomerStats = () => {
  const [data] = trpc.report.getCustomerStats.useSuspenseQuery();

  return (
    <div className="flex max-w-md items-center gap-3">
      <div className="flex-1 rounded-xl">
        <h1 className="text-lg">Total Customers</h1>
        <h2 className="text-3xl font-semibold">{data.totalCustomers}</h2>
      </div>
      <div className="flex-1 rounded-xl">
        <h1 className="text-lg">New Customers This Month</h1>
        <h2 className="text-3xl font-semibold">{data.newCustomersThisMonth}</h2>
      </div>
    </div>
  );
};
