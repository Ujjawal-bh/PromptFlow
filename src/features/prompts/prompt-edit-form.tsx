"use client";

import { useActionState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updatePromptAction } from "@/actions/prompt-actions";
import type { Prompt } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { promptEditFormSchema, type PromptEditFormValues } from "@/schemas/prompt-form.schema";
import type { ActionResult } from "@/types/actions";

export function PromptEditForm({ prompt }: { prompt: Prompt }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(updatePromptAction, undefined as ActionResult | undefined);

  const form = useForm<PromptEditFormValues>({
    resolver: zodResolver(promptEditFormSchema),
    defaultValues: {
      id: prompt.id,
      title: prompt.title,
      description: prompt.description ?? "",
      content: prompt.content,
      tagsInput: prompt.tags.join(", "),
      favorite: prompt.favorite,
    },
  });

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success("Prompt saved");
      router.refresh();
    } else {
      toast.error(state.message);
      if (state.fieldErrors) {
        const keyMap: Record<string, keyof PromptEditFormValues | undefined> = {
          title: "title",
          description: "description",
          content: "content",
          tags: "tagsInput",
          favorite: "favorite",
        };
        Object.entries(state.fieldErrors).forEach(([key, messages]) => {
          const msg = messages?.[0];
          if (!msg) return;
          const formKey = keyMap[key];
          if (formKey) {
            form.setError(formKey, { message: msg });
          }
        });
      }
    }
  }, [state, router, form]);

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit((values) => {
          const fd = new FormData();
          fd.set("id", values.id);
          fd.set("title", values.title);
          fd.set("description", values.description ?? "");
          fd.set("content", values.content);
          fd.set("tags", values.tagsInput);
          if (values.favorite) {
            fd.set("favorite", "true");
          }
          startTransition(() => {
            formAction(fd);
          });
        })}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} rows={14} disabled={isPending} className="font-mono text-sm" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tagsInput"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} disabled={isPending} placeholder="Comma or newline separated" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="favorite"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border border-input"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  disabled={isPending}
                  id="favorite-checkbox"
                />
              </FormControl>
              <FormLabel htmlFor="favorite-checkbox" className="!mt-0 font-normal">
                Favorite
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
