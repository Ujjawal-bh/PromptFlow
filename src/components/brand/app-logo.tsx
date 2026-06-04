import Link from "next/link";
import { Sparkles } from "lucide-react";
import { APP_NAME } from "@/constants/routes";
import { cn } from "@/lib/utils";

export function AppLogo({
  href = "/",
  className,
  showText = true,
  size = "default",
  variant = "default",
}: {
  href?: string;
  className?: string;
  showText?: boolean;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "light";
}) {
  const iconSize = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-11 w-11" : "h-9 w-9";
  const iconInner = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-5 w-5" : "h-4 w-4";
  const textSize = size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";
  const isLight = variant === "light";

  return (
    <Link href={href} className={cn("group flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl shadow-soft transition-transform group-hover:scale-[1.02]",
          iconSize,
          isLight
            ? "bg-white/20 text-white backdrop-blur-sm"
            : "bg-gradient-to-br from-primary to-[hsl(var(--gradient-end))] text-primary-foreground",
        )}
      >
        <Sparkles className={iconInner} />
      </span>
      {showText ? (
        <span className={cn("font-semibold tracking-tight", textSize)}>
          {isLight ? (
            <span className="text-white">{APP_NAME}</span>
          ) : (
            <>
              <span className="text-foreground">{APP_NAME.slice(0, 6)}</span>
              <span className="text-gradient">{APP_NAME.slice(6)}</span>
            </>
          )}
        </span>
      ) : null}
    </Link>
  );
}
