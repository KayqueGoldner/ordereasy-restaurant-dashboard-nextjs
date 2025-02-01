import { FaUser } from "react-icons/fa";

import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { HeaderCalendar } from "./header-calendar";

export const Header = () => {
  return (
    <header className="flex h-12 items-center justify-between gap-5 rounded-xl bg-white px-4">
      <div className="flex items-center gap-3">
        <Logo />
        <Separator className="h-px w-10" />
        <HeaderCalendar />
      </div>
      <div className="flex flex-1 justify-end">
        <Button className="size-8 rounded-full">
          <FaUser className="size-4" />
        </Button>
      </div>
    </header>
  );
};
