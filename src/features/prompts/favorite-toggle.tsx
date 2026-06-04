"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { togglePromptFavoriteAction } from "@/actions/prompt-actions";
import type { ActionResult } from "@/types/actions";
import { cn } from "@/lib/utils";
import { SubmitButton } from "@/components/forms/submit-button";

export function FavoriteToggle({
  promptId,
  favorite,
  className,
}: {
  promptId: string;
  favorite: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(
    togglePromptFavoriteAction,
    undefined as ActionResult<{ favorite: boolean }> | undefined,
  );

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success(state.data?.favorite ? "Added to favorites" : "Removed from favorites");
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={promptId} />
      <SubmitButton
        variant="ghost"
        size="icon"
        className={cn("h-9 w-9", className)}
        aria-label={favorite ? "Remove favorite" : "Add favorite"}
      >
        <Star className={cn("h-4 w-4", favorite ? "fill-amber-400 text-amber-500" : "text-muted-foreground")} />
      </SubmitButton>
    </form>
  );
}
