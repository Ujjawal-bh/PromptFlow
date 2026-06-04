import { Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { ContentPanel } from "@/components/layout/content-panel";
import { CreatePromptDialog } from "@/features/prompts/create-prompt-dialog";
import { PromptRow } from "@/features/prompts/prompt-row";

export default async function PromptsPage() {
  const user = await requireUser();

  const [prompts, projects] = await Promise.all([
    prisma.prompt.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: { project: { select: { name: true } } },
    }),
    prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Prompts"
        description="Every prompt across your projects, newest first."
        action={<CreatePromptDialog projects={projects} />}
      />

      {prompts.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No prompts yet"
          description="Add a prompt from a project or create one here after selecting a project."
          action={<CreatePromptDialog projects={projects} label="Create prompt" />}
        />
      ) : (
        <ContentPanel>
          <ul className="divide-y divide-border/60">
            {prompts.map((p) => (
              <PromptRow
                key={p.id}
                prompt={{
                  id: p.id,
                  title: p.title,
                  favorite: p.favorite,
                  tags: p.tags,
                  updatedAt: p.updatedAt,
                }}
                projectName={p.project.name}
              />
            ))}
          </ul>
        </ContentPanel>
      )}
    </div>
  );
}
