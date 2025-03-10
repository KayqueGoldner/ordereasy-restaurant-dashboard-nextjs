import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { InventoryHeader } from "@/features/inventory/components/inventory-header";
import { Separator } from "@/components/ui/separator";
import { InventoryTable } from "@/features/inventory/components/inventory-table";
import { trpc } from "@/trpc/server";

const AdminInventoryPage = async () => {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return redirect("/");
  }

  void trpc.inventory.getProducts.prefetch();

  return (
    <div>
      <InventoryHeader />
      <Separator className="my-2 opacity-80" />
      <InventoryTable />
    </div>
  );
};

export default AdminInventoryPage;
