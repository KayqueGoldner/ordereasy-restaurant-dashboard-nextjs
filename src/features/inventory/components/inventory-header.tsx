import Link from "next/link";

import { Button } from "@/components/ui/button";

export const InventoryHeader = () => {
  return (
    <div className="flex w-full items-center justify-end">
      <Button asChild>
        <Link href="/admin/inventory/create">Add Product</Link>
      </Button>
    </div>
  );
};
