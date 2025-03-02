import { FaUser } from "react-icons/fa6";
import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { Session } from "next-auth";
import Image from "next/image";

import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserButtonProps {
  session: Session;
}

export const UserButton = ({ session }: UserButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-8 rounded-full p-0">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User image"}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <FaUser className="size-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom">
        <DropdownMenuLabel>
          {session.user.name || session.user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <IoSettingsOutline className="size-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <DropdownMenuItem asChild>
            <button className="w-full hover:!bg-destructive hover:!text-white">
              <IoLogOutOutline className="size-4" />
              Log out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
