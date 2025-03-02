import dynamic from "next/dynamic";
import { Session } from "next-auth";

import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { SignInForm } from "@/components/sign-in-form";
import { UserButton } from "@/components/user-button";
import { CartSidebarMobile } from "@/features/cart/components/cart-sidebar";

import { NavigationMenu } from "./navigation-menu";

const HeaderCalendar = dynamic(
  () => import("./header-calendar").then((comp) => comp.HeaderCalendar),
  {
    loading: () => <p>Loading...</p>,
  },
);

interface HeaderProps {
  session: Session | null;
}

export const Header = async ({ session }: HeaderProps) => {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-5 rounded-xl bg-white px-2">
      <div className="flex items-center gap-3">
        {session?.user && <NavigationMenu user={session.user} />}
        <Logo />
        <Separator className="h-px w-10" />
        <HeaderCalendar />
      </div>
      <div className="flex flex-1 justify-end gap-2">
        {session?.user ? <UserButton session={session} /> : <SignInForm />}
        <CartSidebarMobile isMobile session={session} />
      </div>
    </header>
  );
};
