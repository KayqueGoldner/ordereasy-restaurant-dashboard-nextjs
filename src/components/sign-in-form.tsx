import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { signIn } from "@/lib/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export function SignInForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button">Sign in</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Log in to your account</DialogTitle>
          <DialogDescription className="py-1">
            Enjoy the best dining experience with us!
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center gap-x-2 py-6">
          <form
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <Button>
              <FaGithub className="size-4" />
              Log in with GitHub
            </Button>
          </form>
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
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
