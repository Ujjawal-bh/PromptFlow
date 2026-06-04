import { z } from "zod";
import {
  parseTagsInput,
  promptBaseSchema,
  promptTagListSchema,
} from "@/schemas/prompt.schema";

export const promptEditFormSchema = z
  .object({
    id: z.string().min(1, "Prompt id is required"),
    title: promptBaseSchema.shape.title,
    description: z.string().trim().max(5000).optional().or(z.literal("")),
    content: promptBaseSchema.shape.content,
    tagsInput: z.string(),
    favorite: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const tags = parseTagsInput(data.tagsInput);
    const result = promptTagListSchema.safeParse(tags);
    if (!result.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error.errors[0]?.message ?? "Invalid tags",
        path: ["tagsInput"],
      });
    }
  });

export type PromptEditFormValues = z.infer<typeof promptEditFormSchema>;
