import { HydrateClient, trpc } from "@/trpc/server";
import { CustomerChart } from "@/features/customer/components/customer-chart";
import { CustomerOverview } from "@/features/customer/components/customer-overview";
import { CustomerFavoriteProducts } from "@/features/customer/components/customer-favorite-products";
import { CustomerAllOrders } from "@/features/customer/components/customer-all-orders";

const CustomerActivityPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    datePeriod: "MONTHLY" | "QUARTERLY" | "YEARLY" | undefined;
    allOrdersDatePeriod: string;
  }>;
}) => {
  const { datePeriod, allOrdersDatePeriod } = await searchParams;

  trpc.customer.getOrdersOverview.prefetch();
  trpc.customer.getOrdersChart.prefetch({ datePeriod });
  trpc.customer.customerTopProducts.prefetch();
  trpc.customer.getAllOrders.prefetch({ datePeriod: allOrdersDatePeriod });

  return (
    <HydrateClient>
      <div className="pb-10 pt-3">
        <CustomerOverview />
        <CustomerChart />
        <CustomerFavoriteProducts />
        <CustomerAllOrders />
      </div>
    </HydrateClient>
  );
};

export default CustomerActivityPage;
