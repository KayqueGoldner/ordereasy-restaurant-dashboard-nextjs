import { TbMenu3, TbActivity } from "react-icons/tb";
import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { FaShop, FaCartShopping } from "react-icons/fa6";
import { FaChartPie } from "react-icons/fa";
import { UserIcon } from "lucide-react";
import { MdInventory } from "react-icons/md";

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

import { NavigationMenuLink } from "./navigation-menu-link";

const LINKS = {
  USER: [
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

export const NavigationMenu = () => {
  const ROLE = "USER";

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
            <div className="w-max rounded-full border border-neutral-200 p-2">
              <UserIcon className="size-5" />
            </div>
            <div className="flex flex-1 items-center justify-between">
              <div className="-space-y-1">
                <h1>Owner name</h1>
                <h3 className="text-sm text-muted-foreground">
                  {ROLE === "USER" ? "Customer" : "Admin"}
                </h3>
              </div>
              <Hint text="Log out" asChild>
                <Button
                  variant="destructive"
                  className="size-7 rounded-full p-0"
                >
                  <IoLogOutOutline className="size-[18px]" />
                </Button>
              </Hint>
            </div>
          </div>
        </SheetHeader>
        <nav>
          <ul className="flex flex-col">
            {LINKS[ROLE].map((link) => (
              <li key={link.url} className="w-full">
                <NavigationMenuLink {...link} />
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
