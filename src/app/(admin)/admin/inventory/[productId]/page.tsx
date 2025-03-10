import { InventoryEditForm } from "@/features/inventory/components/inventory-edit-form";
import { HydrateClient, trpc } from "@/trpc/server";

const InventoryProductIdPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = await params;

  void trpc.inventory.getOne.prefetch({ productId });

  return (
    <HydrateClient>
      <InventoryEditForm productId={productId} />
    </HydrateClient>
  );
};

export default InventoryProductIdPage;
