"use client";

import { FaUser } from "react-icons/fa6";
import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { Session } from "next-auth";
import Image from "next/image";

import { signOutAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserSettingsModal } from "@/features/user/hooks/use-user-settings-modal";

interface UserButtonProps {
  session: Session;
}

export const UserButton = ({ session }: UserButtonProps) => {
  const { openModal } = useUserSettingsModal();

  return (
    <DropdownMenu modal={false}>
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
        <DropdownMenuItem onClick={() => openModal()}>
          <IoSettingsOutline className="size-4" />
          Settings
        </DropdownMenuItem>
        <form action={() => signOutAction()}>
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
