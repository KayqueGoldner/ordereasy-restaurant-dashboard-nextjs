import { HydrateClient, trpc } from "@/trpc/server";
import { ManageOrders } from "@/features/manage-orders/components/manage-orders";

const AdminManageOrders = () => {
  void trpc.manageOrders.getMany.prefetch();

  return (
    <HydrateClient>
      <ManageOrders />
    </HydrateClient>
  );
};

export default AdminManageOrders;
