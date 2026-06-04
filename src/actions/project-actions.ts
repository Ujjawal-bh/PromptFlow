"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import {
  projectCreateSchema,
  projectIdSchema,
  projectUpdateSchema,
} from "@/schemas/project.schema";
import type { ActionResult } from "@/types/actions";

export async function createProjectAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  const parsed = projectCreateSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const project = await prisma.project.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard");
  return { ok: true, data: { id: project.id } };
}

export async function updateProjectAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireUser();

  const parsed = projectUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description") ?? "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.project.findFirst({
    where: { id: parsed.data.id, userId: user.id },
  });

  if (!existing) {
    return { ok: false, message: "Project not found." };
  }

  await prisma.project.update({
    where: { id: parsed.data.id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
    },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${parsed.data.id}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteProjectAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireUser();

  const parsed = projectIdSchema.safeParse({
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid project id.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await prisma.project.findFirst({
    where: { id: parsed.data.id, userId: user.id },
  });

  if (!existing) {
    return { ok: false, message: "Project not found." };
  }

  await prisma.project.delete({ where: { id: parsed.data.id } });

  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/prompts");
  return { ok: true };
}
