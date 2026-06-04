import { FolderKanban } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { CreateProjectDialog } from "@/features/projects/create-project-dialog";
import { ProjectCard } from "@/features/projects/project-card";

export default async function ProjectsPage() {
  const user = await requireUser();

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { prompts: true } } },
  });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Projects"
        description="Group prompts by initiative, client, or product area."
        action={<CreateProjectDialog />}
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start capturing reusable prompts."
          action={<CreateProjectDialog label="Create project" />}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={{
                id: project.id,
                name: project.name,
                description: project.description,
                promptCount: project._count.prompts,
                updatedAt: project.updatedAt,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
