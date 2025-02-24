import { TbMenu3, TbActivity } from "react-icons/tb";
import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { FaShop, FaCartShopping } from "react-icons/fa6";
import { FaChartPie } from "react-icons/fa";
import { UserIcon } from "lucide-react";
import { MdInventory } from "react-icons/md";
import { User } from "next-auth";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Hint } from "@/components/hint";
import { signOut } from "@/lib/auth";

import { NavigationMenuLink } from "./navigation-menu-link";
import Image from "next/image";

const LINKS = {
  CUSTOMER: [
    {
      label: "Shop",
      icon: <FaShop className="size-[18px]" />,
      url: "/",
    },
    {
      label: "Cart",
      icon: <FaCartShopping className="size-[18px]" />,
      url: "/cart",
    },
    {
      label: "Activity",
      icon: <TbActivity className="size-[18px]" />,
      url: "/activity",
    },
    {
      label: "Settings",
      icon: <IoSettingsOutline className="size-[18px]" />,
      url: "/settings",
    },
  ],
  ADMIN: [
    {
      label: "Shop",
      icon: <FaShop className="size-[18px]" />,
      url: "/",
    },
    {
      label: "Report",
      icon: <FaChartPie className="size-[18px]" />,
      url: "/report",
    },
    {
      label: "Inventory",
      icon: <MdInventory className="size-[18px]" />,
      url: "/inventory",
    },
  ],
};

interface NavigationMenuProps {
  user: User;
}

export const NavigationMenu = ({ user }: NavigationMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="px-3 py-1">
          <TbMenu3 className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col gap-5 p-0">
        <SheetHeader className="p-4">
          <SheetTitle hidden aria-label="navigation menu" />
          <Logo />
          <div className="flex w-full items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "user image"}
                width={36}
                height={36}
                className="rounded-full"
              />
            ) : (
              <div className="w-max rounded-full border border-neutral-200 p-2">
                <UserIcon className="size-5" />
              </div>
            )}
            <div className="flex flex-1 items-center justify-between">
              <div className="-space-y-1">
                <h1>{user.name}</h1>
                <h3 className="text-sm capitalize text-muted-foreground">
                  {user.role?.toLocaleLowerCase()}
                </h3>
              </div>
              <Hint text="Log out" asChild>
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <Button
                    variant="destructive"
                    className="size-8 rounded-full p-0"
                  >
                    <IoLogOutOutline className="size-5" />
                  </Button>
                </form>
              </Hint>
            </div>
          </div>
        </SheetHeader>
        <nav>
          <ul className="flex flex-col">
            {LINKS[user.role === "CUSTOMER" ? "CUSTOMER" : "ADMIN"].map(
              (link) => (
                <li key={link.url} className="w-full">
                  <NavigationMenuLink {...link} />
                </li>
              ),
            )}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
