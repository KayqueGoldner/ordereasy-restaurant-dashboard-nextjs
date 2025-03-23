import { HydrateClient, trpc } from "@/trpc/server";
import { CustomerCartTable } from "@/features/customer/components/customer-cart-table";

const CustomerOrdersPage = () => {
  void trpc.customer.getOrders.prefetch();

  return (
    <HydrateClient>
      <CustomerCartTable />
    </HydrateClient>
  );
};

export default CustomerOrdersPage;
