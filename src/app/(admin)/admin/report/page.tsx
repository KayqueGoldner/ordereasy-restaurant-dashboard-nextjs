import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { trpc } from "@/trpc/server";
import { ReportClient } from "@/features/report/components/report-client";

const AdminReportPage = async () => {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return redirect("/");
  }

  void trpc.report.getDiscounts.prefetch();

  return <ReportClient />;
};

export default AdminReportPage;
