import { FilterNav } from "./_components/filter-nav";
import { CartSidebar } from "./_components/cart-sidebar";
import { Header } from "./_components/header";
import { ProductsList } from "./_components/products-list";

export default function Home() {
  return (
    <>
      <div className="flex size-full gap-2">
        <div className="flex size-full flex-col overflow-hidden">
          <Header />
          <FilterNav />
          <ProductsList />
        </div>
        <CartSidebar isMobile={false} />
      </div>
    </>
  );
}
