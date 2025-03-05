"use client";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { signInAction } from "@/actions/auth-actions";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogOverlay,
} from "@/components/ui/dialog";
import { useSignInFormModal } from "@/features/user/hooks/use-sign-in-form-modal";

export function SignInForm() {
  const { isOpen, closeModal } = useSignInFormModal();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogOverlay />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Log in to your account</DialogTitle>
          <DialogDescription className="py-1">
            Enjoy the best dining experience with us!
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center gap-x-2 py-6">
          <form action={() => signInAction("github")}>
            <Button>
              <FaGithub className="size-4" />
              Log in with GitHub
            </Button>
          </form>
          <form action={() => signInAction("google")}>
            <Button>
              <FcGoogle className="size-4" />
              Log in with Google
            </Button>
          </form>
        </div>
        <div className="flex justify-start">
          <DialogClose className={buttonVariants()}>Close</DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
