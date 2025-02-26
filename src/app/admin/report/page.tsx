import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

const AdminReportPage = async () => {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return redirect("/");
  }

  return <div>AdminReportPage</div>;
};

export default AdminReportPage;
