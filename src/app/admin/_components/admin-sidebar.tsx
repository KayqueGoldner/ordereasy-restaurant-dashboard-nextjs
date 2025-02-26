"use client";

import Link from "next/link";
import { FaChartPie, FaShop } from "react-icons/fa6";
import { MdInventory } from "react-icons/md";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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

export const AdminSidebar = () => {
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
    </Sidebar>
  );
};
