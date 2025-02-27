import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { HeaderCalendar } from "@/app/(root)/_components/header-calendar";
import { AdminSidebar } from "@/app/admin/_components/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-full p-2">
      <SidebarProvider className="h-full min-h-full overflow-hidden">
        <AdminSidebar />
        <div className="flex grow flex-col gap-3">
          <header className="flex h-12 shrink-0 items-center justify-between gap-5 rounded-xl bg-white px-2">
            <div className="flex items-center gap-3">
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
