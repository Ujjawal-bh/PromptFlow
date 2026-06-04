"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { registerAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getFieldErrorMessages } from "@/lib/action-result";
import type { ActionResult } from "@/types/actions";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, undefined as ActionResult | undefined);

  useEffect(() => {
    if (state && !state.ok) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" autoComplete="name" required disabled={isPending} placeholder="Ada Lovelace" />
        {getFieldErrorMessages(state, "name")?.map((msg) => (
          <p key={msg} className="text-sm text-destructive">
            {msg}
          </p>
        ))}
      </div>
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
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          disabled={isPending}
          minLength={8}
        />
        <p className="text-xs text-muted-foreground">At least 8 characters.</p>
        {getFieldErrorMessages(state, "password")?.map((msg) => (
          <p key={msg} className="text-sm text-destructive">
            {msg}
          </p>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          disabled={isPending}
        />
        {getFieldErrorMessages(state, "confirmPassword")?.map((msg) => (
          <p key={msg} className="text-sm text-destructive">
            {msg}
          </p>
        ))}
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
