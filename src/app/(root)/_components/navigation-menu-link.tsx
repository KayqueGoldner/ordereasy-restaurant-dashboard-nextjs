"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface NavigationMenuLinkProps {
  url: string;
  icon: React.ReactNode;
  label: string;
}

export const NavigationMenuLink = ({
  icon,
  label,
  url,
}: NavigationMenuLinkProps) => {
  const pathname = usePathname();
  const activeLink = pathname === url;

  return (
    <Link
      href={url}
      className={cn(
        "flex items-center gap-3 p-4 hover:bg-primary/10",
        activeLink && "bg-primary/15 hover:bg-primary/15",
      )}
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-full bg-neutral-100 text-primary",
          activeLink && "bg-primary text-white",
        )}
      >
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
};
