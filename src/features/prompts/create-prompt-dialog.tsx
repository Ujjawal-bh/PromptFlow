"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPromptAction } from "@/actions/prompt-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/types/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { cn } from "@/lib/utils";

type ProjectOption = { id: string; name: string };

type CreatePromptDialogProps = {
  label?: string;
  /** When set, project is fixed (e.g. project detail page). */
  projectId?: string;
  defaultProjectId?: string;
  projects?: ProjectOption[];
};

export function CreatePromptDialog({
  label = "New prompt",
  projectId,
  defaultProjectId,
  projects = [],
}: CreatePromptDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createPromptAction, undefined as ActionResult | undefined);

  const lockedProjectId = projectId;
  const showPicker = !lockedProjectId && projects.length > 0;

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success("Prompt created");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  const resolvedDefault = lockedProjectId ?? defaultProjectId ?? projects[0]?.id ?? "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{label}</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <form action={formAction} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create prompt</DialogTitle>
            <DialogDescription>
              Prompts are scoped to a project and always private to your account.
            </DialogDescription>
          </DialogHeader>

          {lockedProjectId ? (
            <input type="hidden" name="projectId" value={lockedProjectId} />
          ) : showPicker ? (
            <div className="space-y-2">
              <Label htmlFor="projectId">Project</Label>
              <select
                id="projectId"
                name="projectId"
                required
                disabled={isPending}
                defaultValue={resolvedDefault}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                )}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {state?.fieldErrors?.projectId?.map((m) => (
                <p key={m} className="text-sm text-destructive">
                  {m}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-destructive">
              Create a project first before adding prompts.
            </p>
          )}

          {!lockedProjectId && !showPicker ? null : (
            <>
              <div className="space-y-2">
                <Label htmlFor="prompt-title">Title</Label>
                <Input id="prompt-title" name="title" required disabled={isPending} placeholder="Meeting summary" />
                {state?.fieldErrors?.title?.map((m) => (
                  <p key={m} className="text-sm text-destructive">
                    {m}
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="prompt-description">Short description (optional)</Label>
                <Input
                  id="prompt-description"
                  name="description"
                  disabled={isPending}
                  placeholder="One line context"
                />
                {state?.fieldErrors?.description?.map((m) => (
                  <p key={m} className="text-sm text-destructive">
                    {m}
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="prompt-content">Content</Label>
                <Textarea
                  id="prompt-content"
                  name="content"
                  required
                  disabled={isPending}
                  rows={10}
                  placeholder="Write the full prompt text…"
                />
                {state?.fieldErrors?.content?.map((m) => (
                  <p key={m} className="text-sm text-destructive">
                    {m}
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="prompt-tags">Tags (comma or newline separated)</Label>
                <Textarea
                  id="prompt-tags"
                  name="tags"
                  disabled={isPending}
                  rows={3}
                  placeholder="sales, email, spanish"
                />
                {state?.fieldErrors?.tags?.map((m) => (
                  <p key={m} className="text-sm text-destructive">
                    {m}
                  </p>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="prompt-favorite"
                  name="favorite"
                  disabled={isPending}
                  className="h-4 w-4 rounded border border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Label htmlFor="prompt-favorite" className="text-sm font-normal">
                  Mark as favorite
                </Label>
              </div>
            </>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <SubmitButton disabled={isPending || (!lockedProjectId && !showPicker)}>
              {isPending ? "Saving…" : "Create prompt"}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
