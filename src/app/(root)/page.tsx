import { FilterNav } from "./_components/filter-nav";
import { CartSidebar } from "./_components/cart-sidebar";
import { Header } from "./_components/header";
import { ProductsList } from "./_components/products-list";

export default function Home() {
  return (
    <>
      <div className="grid size-full grid-cols-3 items-start gap-2">
        <div className="col-span-2 flex size-full flex-col overflow-hidden">
          <Header />
          <FilterNav />
          <ProductsList />
        </div>
        <CartSidebar />
      </div>
    </>
  );
}
