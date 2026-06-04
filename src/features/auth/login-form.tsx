"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { loginAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import { getFieldErrorMessages } from "@/lib/action-result";
import type { ActionResult } from "@/types/actions";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined as ActionResult | undefined);

  useEffect(() => {
    if (state && !state.ok) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isPending}
          placeholder="you@company.com"
        />
        {getFieldErrorMessages(state, "email")?.map((msg) => (
          <p key={msg} className="text-sm text-destructive">
            {msg}
          </p>
        ))}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href={ROUTES.register} className="text-xs text-primary hover:text-primary/80">
            Need an account?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
        />
        {getFieldErrorMessages(state, "password")?.map((msg) => (
          <p key={msg} className="text-sm text-destructive">
            {msg}
          </p>
        ))}
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
