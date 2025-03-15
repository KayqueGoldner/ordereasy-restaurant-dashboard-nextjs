import { Metadata } from "next";
import { redirect } from "next/navigation";

import { SalesOverview } from "@/features/report/components/sales-overview";
import { HydrateClient, trpc } from "@/trpc/server";
import { auth } from "@/lib/auth";
import { FavoriteProducts } from "@/features/report/components/favorite-products";

export const metadata: Metadata = {
  title: "Reports | OrderEasy Dashboard",
  description: "View and analyze your restaurant's performance",
};

const ReportsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    datePeriod: "MONTHLY" | "QUARTERLY" | "YEARLY" | undefined;
  }>;
}) => {
  const { datePeriod } = await searchParams;
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

  return (
    <HydrateClient>
      <SalesOverview />
      <FavoriteProducts />
    </HydrateClient>
  );
};

export default ReportsPage;
