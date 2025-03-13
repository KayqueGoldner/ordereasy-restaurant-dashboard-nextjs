import { redirect } from "next/navigation";

import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { HeaderCalendar } from "@/app/(root)/_components/header-calendar";
import { AdminSidebar } from "@/app/(admin)/admin/_components/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return redirect("/");
  }

  return (
    <div className="relative h-screen w-full overflow-hidden p-2">
      <SidebarProvider className="h-full min-h-full overflow-hidden">
        <AdminSidebar session={session} />
        <div className="flex grow flex-col gap-3">
          <header className="flex h-12 shrink-0 items-center justify-between gap-5 rounded-xl bg-white px-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <SidebarTrigger />
              <Logo />
              <Separator className="h-px w-10" />
              <HeaderCalendar />
            </div>
          </header>
          <main className="size-full overflow-y-auto rounded-xl bg-white p-3">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
