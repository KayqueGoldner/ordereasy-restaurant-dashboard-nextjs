import { db } from "@/db/drizzle";
import { productsTable } from "@/db/schema/product";

import { FilterNav } from "./_components/filter-nav";
import { CartSidebar } from "./_components/cart-sidebar";
import { Header } from "./_components/header";
import { ProductsList } from "./_components/products-list";

export default async function Home() {
  const products = await db.select().from(productsTable);

  return (
    <>
      <div className="flex size-full gap-2">
        <div className="flex size-full flex-col overflow-hidden">
          <Header />
          <FilterNav />
          <ProductsList products={products} />
        </div>
        <CartSidebar isMobile={false} />
      </div>
    </>
  );
}
