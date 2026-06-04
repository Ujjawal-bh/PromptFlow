import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const accentStyles = {
  violet: "from-violet-500/15 to-violet-500/5 text-violet-600 dark:text-violet-400",
  blue: "from-blue-500/15 to-blue-500/5 text-blue-600 dark:text-blue-400",
  amber: "from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400",
} as const;

export function StatCard({
  title,
  value,
  href,
  linkLabel,
  icon: Icon,
  accent = "violet",
}: {
  title: string;
  value: number;
  href: string;
  linkLabel: string;
  icon: LucideIcon;
  accent?: keyof typeof accentStyles;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-soft transition-all duration-300 hover:border-primary/25 hover:shadow-glow">
      <div
        className={cn(
          "absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-80 blur-2xl transition-opacity group-hover:opacity-100",
          accentStyles[accent],
        )}
      />
      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight tabular-nums">{value}</p>
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            {linkLabel}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br",
            accentStyles[accent],
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
