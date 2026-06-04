import { Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { BackLink } from "@/components/layout/back-link";
import { EmptyState } from "@/components/layout/empty-state";
import { ContentPanel } from "@/components/layout/content-panel";
import { ROUTES } from "@/constants/routes";
import { EditProjectSheet } from "@/features/projects/edit-project-sheet";
import { DeleteProjectButton } from "@/features/projects/delete-project-button";
import { CreatePromptDialog } from "@/features/prompts/create-prompt-dialog";
import { PromptRow } from "@/features/prompts/prompt-row";

type Props = { params: Promise<{ id: string }> };

export default async function ProjectDetailPage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { id, userId: user.id },
    include: {
      prompts: { orderBy: { updatedAt: "desc" } },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 shadow-soft md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <BackLink href={ROUTES.projects}>All projects</BackLink>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{project.name}</h1>
          {project.description ? (
            <p className="max-w-2xl whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No description yet.</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <CreatePromptDialog projectId={project.id} />
          <EditProjectSheet project={project} />
          <DeleteProjectButton projectId={project.id} projectName={project.name} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Prompts</h2>
        {project.prompts.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No prompts in this project"
            description="Prompts stay linked to this project and are private to your account."
            action={<CreatePromptDialog projectId={project.id} label="Create prompt" />}
          />
        ) : (
          <ContentPanel>
            <ul className="divide-y divide-border/60">
              {project.prompts.map((p) => (
                <PromptRow
                  key={p.id}
                  prompt={{
                    id: p.id,
                    title: p.title,
                    favorite: p.favorite,
                    tags: p.tags,
                    updatedAt: p.updatedAt,
                  }}
                />
              ))}
            </ul>
          </ContentPanel>
        )}
      </div>
    </div>
  );
}
