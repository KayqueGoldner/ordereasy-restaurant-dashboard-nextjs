import { Metadata } from "next";
import { redirect } from "next/navigation";
import { format } from "date-fns";

import { SalesOverview } from "@/features/report/components/sales-overview";
import { HydrateClient, trpc } from "@/trpc/server";
import { auth } from "@/lib/auth";
import { FavoriteProducts } from "@/features/report/components/favorite-products";
import { ReportChart } from "@/features/report/components/report-chart";
import { AllOrders } from "@/features/report/components/all-orders";
import { DiscountsTable } from "@/features/report/components/discounts-table";

export const metadata: Metadata = {
  title: "Reports | OrderEasy Dashboard",
  description: "View and analyze your restaurant's performance",
};

const ReportsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    datePeriod: "MONTHLY" | "QUARTERLY" | "YEARLY" | undefined;
    allOrdersDatePeriod: string;
  }>;
}) => {
  const { datePeriod, allOrdersDatePeriod } = await searchParams;
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return redirect("/");
  }

  void trpc.report.getSalesOverview.prefetch({
    datePeriod: datePeriod || "MONTHLY",
  });
  void trpc.report.getTopProducts.prefetch({
    limit: 5,
  });
  void trpc.report.getSalesChartData.prefetch({
    datePeriod: datePeriod || "MONTHLY",
  });
  void trpc.report.getAllOrdes.prefetch({
    datePeriod:
      allOrdersDatePeriod ||
      `startDate=${format(new Date(new Date().setDate(1)), "yyyy-MM-dd")}&endDate=${format(
        new Date(),
        "yyyy-MM-dd",
      )}`,
  });
  void trpc.report.getDiscounts.prefetch();

  return (
    <HydrateClient>
      <SalesOverview />
      <ReportChart />
      <FavoriteProducts />
      <AllOrders />
      <DiscountsTable />
    </HydrateClient>
  );
};

export default ReportsPage;
