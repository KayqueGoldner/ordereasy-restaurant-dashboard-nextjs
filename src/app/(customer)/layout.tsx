import { auth } from "@/lib/auth";
import { UserSettingsModal } from "@/features/user/components/user-settings-modal";

const CustomerLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <div>
      <UserSettingsModal session={session} />
      {children}
    </div>
  );
};

export default CustomerLayout;
