import { AppLogo } from "@/components/brand/app-logo";
import { SidebarNavLinks } from "@/components/layout/sidebar-nav-links";
import { ROUTES } from "@/constants/routes";

export function DashboardSidebar() {
  return (
    <aside className="sidebar-surface hidden w-[260px] shrink-0 flex-col border-r lg:flex">
      <div className="flex h-[4.25rem] items-center border-b border-sidebar-border px-5">
        <AppLogo href={ROUTES.dashboard} />
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        <SidebarNavLinks />
      </div>
      <div className="border-t border-sidebar-border p-4">
        <p className="rounded-xl bg-accent/50 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
          Organize prompts by project, tag favorites, and ship faster.
        </p>
      </div>
    </aside>
  );
}
