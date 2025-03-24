import { auth } from "@/lib/auth";
import { UserSettingsForm } from "@/features/user/components/user-settings-form";

const CustomerSettingsPage = async () => {
  const session = await auth();

  return (
    <main className="flex size-full items-center justify-center">
      <div className="size-full max-w-lg space-y-6 rounded-xl bg-muted px-10 py-6 pb-20">
        <h1 className="text-2xl font-bold">Settings</h1>
        <UserSettingsForm session={session} />
      </div>
    </main>
  );
};

export default CustomerSettingsPage;
