"use client";

import dynamic from "next/dynamic";
import { Session } from "next-auth";

import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@/features/user/components/user-button";
import { CartSidebarMobile } from "@/features/cart/components/cart-sidebar";
import { Button } from "@/components/ui/button";
import { useSignInFormModal } from "@/features/user/hooks/use-sign-in-form-modal";

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

export const Header = ({ session }: HeaderProps) => {
  const { openModal } = useSignInFormModal();

  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-5 rounded-xl bg-white px-2">
      <div className="flex items-center gap-3">
        {session?.user && <NavigationMenu user={session.user} />}
        <Logo />
        <Separator className="h-px w-10" />
        <HeaderCalendar />
      </div>
      <div className="flex flex-1 justify-end gap-2">
        {session?.user ? (
          <UserButton session={session} />
        ) : (
          <Button type="button" onClick={openModal}>
            Sign In
          </Button>
        )}
        <CartSidebarMobile />
      </div>
    </header>
  );
};
