import type { ReactNode } from "react";
import Link from "next/link";
import { FolderKanban, Shield, Sparkles, Tags } from "lucide-react";
import { AppLogo } from "@/components/brand/app-logo";
import { ROUTES } from "@/constants/routes";

const highlights = [
  { icon: FolderKanban, text: "Group prompts into projects" },
  { icon: Tags, text: "Tag and favorite what matters" },
  { icon: Shield, text: "Secure sessions & hashed passwords" },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen lg:grid lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-[hsl(var(--gradient-end))] to-primary/80 p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60" />
        <div className="relative">
          <AppLogo href="/" variant="light" />
        </div>
        <div className="relative space-y-8">
          <div>
            <div className="mb-4 inline-flex rounded-xl bg-white/15 p-3 backdrop-blur-sm">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Your prompt library, organized</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/85">
              A focused workspace for teams and builders who need reusable prompts without the noise.
            </p>
          </div>
          <ul className="space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-primary-foreground/60">© PromptManager</p>
      </div>

      <div className="flex min-h-screen flex-col items-center justify-center bg-mesh p-6 sm:p-10">
        <div className="mb-8 w-full max-w-md lg:hidden">
          <AppLogo href="/" />
        </div>
        <div className="w-full max-w-md animate-fade-in">{children}</div>
        <p className="mt-8 max-w-md text-center text-xs text-muted-foreground">
          Passwords are hashed. Sessions use HttpOnly cookies.
        </p>
        <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
          <Link href={ROUTES.login} className="transition-colors hover:text-primary">
            Login
          </Link>
          <span aria-hidden className="text-border">
            ·
          </span>
          <Link href={ROUTES.register} className="transition-colors hover:text-primary">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
