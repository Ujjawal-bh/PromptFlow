"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { AppLogo } from "@/components/brand/app-logo";
import { SidebarNavLinks } from "@/components/layout/sidebar-nav-links";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "@/components/layout/nav-config";
import { logoutAction } from "@/actions/auth-actions";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[hsl(var(--gradient-end))] text-xs font-semibold text-primary-foreground"
      aria-hidden
    >
      {initials || "?"}
    </span>
  );
}

export function DashboardHeader({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-[4.25rem] items-center gap-4 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3 lg:hidden">
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 rounded-xl" aria-label="Open navigation">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <SheetHeader className="border-b px-5 py-4 text-left">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <AppLogo href={ROUTES.dashboard} />
            </SheetHeader>
            <div className="px-3 py-4">
              <SidebarNavLinks onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <AppLogo href={ROUTES.dashboard} size="sm" />
      </div>

      <div className="hidden flex-1 lg:block">
        <p className="text-sm text-muted-foreground">
          Welcome back,{" "}
          <span className="font-medium text-foreground">{userName}</span>
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-10 gap-2 rounded-xl border-border/80 bg-card pl-1.5 pr-3 shadow-sm hover:bg-accent/50",
              )}
            >
              <UserAvatar name={userName} />
              <span className="hidden max-w-[140px] truncate text-sm font-medium sm:inline">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-xl">
            <DropdownMenuLabel>
              <div className="flex items-center gap-3">
                <UserAvatar name={userName} />
                <div className="flex min-w-0 flex-col space-y-0.5">
                  <span className="truncate text-sm font-medium">{userName}</span>
                  <span className="truncate text-xs font-normal text-muted-foreground">{userEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                void logoutAction();
              }}
              className="cursor-pointer rounded-lg text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
