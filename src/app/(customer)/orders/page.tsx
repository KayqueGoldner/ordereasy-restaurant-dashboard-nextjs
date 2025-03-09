import { HydrateClient, trpc } from "@/trpc/server";
import { CustomerCartTable } from "@/features/customer/components/customer-cart-table";
import { Header } from "@/app/(root)/_components/header";
import { auth } from "@/lib/auth";

const CustomerOrdersPage = async () => {
  const session = await auth();
  void trpc.customer.getOrders.prefetch();

  return (
    <HydrateClient>
      <Header session={session} />
      <CustomerCartTable />
    </HydrateClient>
  );
};

export default CustomerOrdersPage;
