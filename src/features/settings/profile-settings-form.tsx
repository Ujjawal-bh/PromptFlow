"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProfileAction } from "@/actions/settings-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionResult } from "@/types/actions";
import { SubmitButton } from "@/components/forms/submit-button";

export function ProfileSettingsForm({ defaultName }: { defaultName: string }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updateProfileAction, undefined as ActionResult | undefined);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success("Profile updated");
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="settings-name">Display name</Label>
        <Input id="settings-name" name="name" required disabled={isPending} defaultValue={defaultName} />
        {state?.fieldErrors?.name?.map((m) => (
          <p key={m} className="text-sm text-destructive">
            {m}
          </p>
        ))}
      </div>
      <SubmitButton disabled={isPending}>{isPending ? "Saving…" : "Save profile"}</SubmitButton>
    </form>
  );
}
