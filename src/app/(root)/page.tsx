import { CartSidebar } from "./_components/cart-sidebar";
import { Header } from "./_components/header";

export default function Home() {
  return (
    <>
      <div className="flex size-full items-start gap-3">
        <div className="flex-1">
          <Header />
        </div>
        <CartSidebar />
      </div>
    </>
  );
}
