"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import {
  parseTagsInput,
  promptCreateSchema,
  promptIdSchema,
  promptUpdateSchema,
  promptTagListSchema,
} from "@/schemas/prompt.schema";
import type { ActionResult } from "@/types/actions";

export async function createPromptAction(
  _prev: ActionResult<{ id: string }> | undefined,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  const tagsRaw = String(formData.get("tags") ?? "");
  const tagParse = promptTagListSchema.safeParse(parseTagsInput(tagsRaw));
  if (!tagParse.success) {
    return {
      ok: false,
      message: "Please fix tag input.",
      fieldErrors: { tags: [tagParse.error.errors[0]?.message ?? "Invalid tags"] },
    };
  }

  const parsed = promptCreateSchema.safeParse({
    projectId: formData.get("projectId"),
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    content: formData.get("content"),
    tags: tagParse.data,
    favorite: formData.get("favorite") === "on" || formData.get("favorite") === "true",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const project = await prisma.project.findFirst({
    where: { id: parsed.data.projectId, userId: user.id },
  });

  if (!project) {
    return { ok: false, message: "Project not found or access denied." };
  }

  const prompt = await prisma.prompt.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      content: parsed.data.content,
      tags: parsed.data.tags,
      favorite: parsed.data.favorite ?? false,
      projectId: parsed.data.projectId,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard/prompts");
  revalidatePath(`/dashboard/projects/${parsed.data.projectId}`);
  revalidatePath("/dashboard/favorites");
  revalidatePath("/dashboard");
  return { ok: true, data: { id: prompt.id } };
}

export async function updatePromptAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireUser();

  const tagsRaw = String(formData.get("tags") ?? "");
  const tagParse = promptTagListSchema.safeParse(parseTagsInput(tagsRaw));
  if (!tagParse.success) {
    return {
      ok: false,
      message: "Please fix tag input.",
      fieldErrors: { tags: [tagParse.error.errors[0]?.message ?? "Invalid tags"] },
    };
  }

  const parsed = promptUpdateSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    content: formData.get("content"),
    tags: tagParse.data,
    favorite: formData.get("favorite") === "on" || formData.get("favorite") === "true",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.prompt.findFirst({
    where: { id: parsed.data.id, userId: user.id },
  });

  if (!existing) {
    return { ok: false, message: "Prompt not found." };
  }

  await prisma.prompt.update({
    where: { id: parsed.data.id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      content: parsed.data.content,
      tags: parsed.data.tags,
      favorite: parsed.data.favorite ?? false,
    },
  });

  revalidatePath("/dashboard/prompts");
  revalidatePath(`/dashboard/prompts/${parsed.data.id}`);
  revalidatePath(`/dashboard/projects/${existing.projectId}`);
  revalidatePath("/dashboard/favorites");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deletePromptAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireUser();

  const parsed = promptIdSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid prompt id.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.prompt.findFirst({
    where: { id: parsed.data.id, userId: user.id },
  });

  if (!existing) {
    return { ok: false, message: "Prompt not found." };
  }

  await prisma.prompt.delete({ where: { id: parsed.data.id } });

  revalidatePath("/dashboard/prompts");
  revalidatePath(`/dashboard/projects/${existing.projectId}`);
  revalidatePath("/dashboard/favorites");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function togglePromptFavoriteAction(
  _prev: ActionResult<{ favorite: boolean }> | undefined,
  formData: FormData,
): Promise<ActionResult<{ favorite: boolean }>> {
  const user = await requireUser();

  const parsed = promptIdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) {
    return { ok: false, message: "Invalid prompt id." };
  }

  const existing = await prisma.prompt.findFirst({
    where: { id: parsed.data.id, userId: user.id },
  });

  if (!existing) {
    return { ok: false, message: "Prompt not found." };
  }

  const favorite = !existing.favorite;

  await prisma.prompt.update({
    where: { id: parsed.data.id },
    data: { favorite },
  });

  revalidatePath("/dashboard/prompts");
  revalidatePath(`/dashboard/prompts/${parsed.data.id}`);
  revalidatePath("/dashboard/favorites");
  revalidatePath("/dashboard");
  return { ok: true, data: { favorite } };
}
