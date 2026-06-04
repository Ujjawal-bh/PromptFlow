import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ContentPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-card shadow-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}
