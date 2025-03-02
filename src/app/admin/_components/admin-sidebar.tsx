"use client";

import Image from "next/image";
import Link from "next/link";
import { FaChartPie, FaShop } from "react-icons/fa6";
import { MdInventory } from "react-icons/md";
import { Session } from "next-auth";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserIcon } from "lucide-react";

const items = [
  {
    title: "Shop",
    url: "/",
    icon: <FaShop />,
  },
  {
    title: "Report",
    url: "/admin/report",
    icon: <FaChartPie />,
  },
  {
    title: "Inventory",
    url: "/admin/inventory",
    icon: <MdInventory />,
  },
];

interface AdminSidebarProps {
  session: Session;
}

export const AdminSidebar = ({ session }: AdminSidebarProps) => {
  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel>View and Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild={true}
                    isActive={false} // TODO: change to look at current pathname
                    className="h-10"
                  >
                    <Link href={item.url} className="flex items-center gap-4">
                      {item.icon}
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex w-full items-center gap-2 rounded-xl border border-neutral-200 px-2 py-1">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "user image"}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-max rounded-full border border-neutral-200 p-2">
              <UserIcon className="size-5" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-sm">{session.user.name}</h1>
            <h3 className="text-sm capitalize text-muted-foreground">
              {session.user.role?.toLocaleLowerCase()}
            </h3>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
