"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/components/layout/nav-config";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export function SidebarNavLinks({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className={cn("grid gap-0.5", className)}>
      {mainNav.map((item) => {
        const active =
          item.href === ROUTES.dashboard
            ? pathname === ROUTES.dashboard
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              active
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
            )}
          >
            <item.icon
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200",
                active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground",
                !active && "group-hover:scale-105",
              )}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
