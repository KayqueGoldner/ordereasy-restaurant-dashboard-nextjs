"use client";

import { Session } from "next-auth";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { trpc } from "@/trpc/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUserSettingsModal } from "@/features/user/hooks/use-user-settings-modal";
import { Button } from "@/components/ui/button";

interface UserSettingsFormProps {
  session: Session | null;
}

const userSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  address: z.string().optional(),
});

export const UserSettingsForm = ({ session }: UserSettingsFormProps) => {
  const { target } = useUserSettingsModal();
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
    trpcUtils.user.getData.invalidate();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3">
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
  );
};
