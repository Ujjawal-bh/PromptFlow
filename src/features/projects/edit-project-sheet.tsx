"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProjectAction } from "@/actions/project-actions";
import type { Project } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getFieldErrorMessages } from "@/lib/action-result";
import type { ActionResult } from "@/types/actions";

export function EditProjectSheet({ project }: { project: Project }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(updateProjectAction, undefined as ActionResult | undefined);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success("Project updated");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary">Edit</Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col sm:max-w-md">
        <form action={formAction} className="flex flex-1 flex-col gap-4">
          <SheetHeader>
            <SheetTitle>Edit project</SheetTitle>
            <SheetDescription>Update name and description. Changes apply immediately.</SheetDescription>
          </SheetHeader>
          <input type="hidden" name="id" value={project.id} />
          <div className="space-y-2">
            <Label htmlFor="edit-project-name">Name</Label>
            <Input
              id="edit-project-name"
              name="name"
              required
              disabled={pending}
              defaultValue={project.name}
            />
            {getFieldErrorMessages(state, "name")?.map((m) => (
              <p key={m} className="text-sm text-destructive">
                {m}
              </p>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-project-description">Description</Label>
            <Textarea
              id="edit-project-description"
              name="description"
              disabled={pending}
              rows={6}
              defaultValue={project.description ?? ""}
            />
            {getFieldErrorMessages(state, "description")?.map((m) => (
              <p key={m} className="text-sm text-destructive">
                {m}
              </p>
            ))}
          </div>
          <SheetFooter className="mt-auto gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              Close
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
