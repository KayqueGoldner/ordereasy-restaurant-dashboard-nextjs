import { HydrateClient, trpc } from "@/trpc/server";
import { InventoryCreateForm } from "@/features/inventory/components/inventory-create-form";

const InventoryCreatePage = () => {
  void trpc.categories.getMany.prefetch();

  return (
    <HydrateClient>
      <InventoryCreateForm />
    </HydrateClient>
  );
};

export default InventoryCreatePage;
