"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { updatePasswordAction } from "@/actions/settings-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getFieldErrorMessages } from "@/lib/action-result";
import type { ActionResult } from "@/types/actions";
import { SubmitButton } from "@/components/forms/submit-button";

export function PasswordSettingsForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(updatePasswordAction, undefined as ActionResult | undefined);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success("Password updated");
      formRef.current?.reset();
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
        />
        {getFieldErrorMessages(state, "currentPassword")?.map((m) => (
          <p key={m} className="text-sm text-destructive">
            {m}
          </p>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          disabled={isPending}
          minLength={8}
        />
        {getFieldErrorMessages(state, "newPassword")?.map((m) => (
          <p key={m} className="text-sm text-destructive">
            {m}
          </p>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmNewPassword">Confirm new password</Label>
        <Input
          id="confirmNewPassword"
          name="confirmNewPassword"
          type="password"
          autoComplete="new-password"
          required
          disabled={isPending}
        />
        {getFieldErrorMessages(state, "confirmNewPassword")?.map((m) => (
          <p key={m} className="text-sm text-destructive">
            {m}
          </p>
        ))}
      </div>
      <SubmitButton disabled={isPending}>{isPending ? "Updating…" : "Update password"}</SubmitButton>
    </form>
  );
}
