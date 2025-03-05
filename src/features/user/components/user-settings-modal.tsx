"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUserSettingsModal } from "@/features/user/hooks/use-user-settings-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";

const userSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  address: z.string().optional(),
});

interface UserSettingsModalProps {
  session: Session | null;
}

export const UserSettingsModal = ({ session }: UserSettingsModalProps) => {
  const { isOpen, target, closeModal } = useUserSettingsModal();
  const trpcUtils = trpc.useUtils();

  const updateUserSettings = trpc.user.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("Settings updated");
      trpcUtils.user.invalidate();
    },
  });

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: session?.user.name || "",
      address: session?.user.address || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    updateUserSettings.mutateAsync({
      ...values,
    });
  };

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
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="name"
                        autoFocus={target === "name"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="address"
                        autoFocus={target === "address"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={updateUserSettings.isPending}
              >
                Save changes
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
