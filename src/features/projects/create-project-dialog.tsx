"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProjectAction } from "@/actions/project-actions";
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
import { getFieldErrorMessages } from "@/lib/action-result";
import type { ActionResult } from "@/types/actions";

export function CreateProjectDialog({ label = "New project" }: { label?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createProjectAction,
    undefined as ActionResult<{ id: string }> | undefined,
  );

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success("Project created");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{label}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form action={formAction} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Create project</DialogTitle>
            <DialogDescription>A project groups related prompts. You can edit details anytime.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="project-name">Name</Label>
            <Input id="project-name" name="name" required disabled={pending} placeholder="Product launch" />
            {getFieldErrorMessages(state, "name")?.map((m) => (
              <p key={m} className="text-sm text-destructive">
                {m}
              </p>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-description">Description (optional)</Label>
            <Textarea
              id="project-description"
              name="description"
              disabled={pending}
              placeholder="What is this project about?"
              rows={4}
            />
            {getFieldErrorMessages(state, "description")?.map((m) => (
              <p key={m} className="text-sm text-destructive">
                {m}
              </p>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
