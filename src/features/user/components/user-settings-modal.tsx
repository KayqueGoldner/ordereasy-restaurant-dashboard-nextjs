"use client";

import { Session } from "next-auth";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserSettingsModal } from "@/features/user/hooks/use-user-settings-modal";
import { UserSettingsForm } from "@/features/user/components/user-settings-form";

interface UserSettingsModalProps {
  session: Session | null;
}

export const UserSettingsModal = ({ session }: UserSettingsModalProps) => {
  const { isOpen, closeModal } = useUserSettingsModal();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogOverlay onClick={closeModal} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Settings</DialogTitle>
          <DialogDescription>
            Here you can change your settings.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <UserSettingsForm session={session} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
