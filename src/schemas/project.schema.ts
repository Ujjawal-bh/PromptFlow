import { z } from "zod";

export const projectCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name is too long"),
  description: z
    .string()
    .trim()
    .max(5000, "Description is too long")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
});

export const projectUpdateSchema = projectCreateSchema.extend({
  id: z.string().min(1, "Project id is required"),
});

export const projectIdSchema = z.object({
  id: z.string().min(1, "Project id is required"),
});

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
