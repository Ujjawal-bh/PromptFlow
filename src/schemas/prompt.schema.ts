import { z } from "zod";

const tagSchema = z
  .string()
  .trim()
  .min(1, "Tag cannot be empty")
  .max(40, "Tag is too long");

export const promptTagListSchema = z.array(tagSchema).max(30, "Too many tags");

export const promptBaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title is too long"),
  description: z
    .string()
    .trim()
    .max(5000, "Description is too long")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(100_000, "Content is too long"),
  tags: promptTagListSchema.default([]),
  favorite: z.boolean().optional().default(false),
});

export const promptCreateSchema = promptBaseSchema.extend({
  projectId: z.string().min(1, "Project is required"),
});

export const promptUpdateSchema = promptBaseSchema.extend({
  id: z.string().min(1, "Prompt id is required"),
});

export const promptIdSchema = z.object({
  id: z.string().min(1, "Prompt id is required"),
});

/** Parse comma-separated tags from a single input string */
export function parseTagsInput(raw: string): string[] {
  const parts = raw
    .split(/[,\n]/)
    .map((t) => t.trim())
    .filter(Boolean);
  return Array.from(new Set(parts)).slice(0, 30);
}

export type PromptCreateInput = z.infer<typeof promptCreateSchema>;
export type PromptUpdateInput = z.infer<typeof promptUpdateSchema>;
