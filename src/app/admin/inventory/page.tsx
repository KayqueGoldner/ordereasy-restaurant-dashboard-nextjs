import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

const AdminInventoryPage = async () => {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return redirect("/");
  }

  return <div>AdminInventoryPage</div>;
};

export default AdminInventoryPage;
