import { auth } from "@/lib/auth";
import { UserSettingsModal } from "@/features/user/components/user-settings-modal";
import { Header } from "@/app/(root)/_components/header";

const CustomerLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <UserSettingsModal session={session} />
      <Header session={session} />
      <main className="size-full overflow-y-auto rounded-xl bg-white p-3">
        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;
