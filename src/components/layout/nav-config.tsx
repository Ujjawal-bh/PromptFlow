import { type LucideIcon, FolderKanban, Home, Menu, Settings, Sparkles, Star } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const mainNav: NavItem[] = [
  { href: ROUTES.dashboard, label: "Dashboard", icon: Home },
  { href: ROUTES.projects, label: "Projects", icon: FolderKanban },
  { href: ROUTES.prompts, label: "Prompts", icon: Sparkles },
  { href: ROUTES.favorites, label: "Favorites", icon: Star },
  { href: ROUTES.settings, label: "Settings", icon: Settings },
];

export { Menu };
