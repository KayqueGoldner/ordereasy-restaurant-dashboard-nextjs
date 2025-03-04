import { HydrateClient, trpc } from "@/trpc/server";
import { OrderDetails } from "@/features/order/components/order-details";

const OrderIdPage = async ({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) => {
  const { orderId } = await params;

  void trpc.order.getOne.prefetch({ orderId });

  return (
    <HydrateClient>
      <OrderDetails orderId={orderId} />
    </HydrateClient>
  );
};

export default OrderIdPage;
