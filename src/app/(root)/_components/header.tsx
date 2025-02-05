import { auth } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { SignInForm } from "@/components/sign-in-form";
import { UserButton } from "@/components/user-button";
import { CartSidebarMobile } from "@/app/(root)/_components/cart-sidebar";

import { HeaderCalendar } from "./header-calendar";

export const Header = async () => {
  const session = await auth();

  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-5 rounded-xl bg-white px-4">
      <div className="flex items-center gap-3">
        <Logo />
        <Separator className="h-px w-10" />
        <HeaderCalendar />
      </div>
      <div className="flex flex-1 justify-end gap-2">
        {session?.user ? <UserButton /> : <SignInForm />}
        <CartSidebarMobile />
      </div>
    </header>
  );
};
