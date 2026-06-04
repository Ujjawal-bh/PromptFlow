import { FolderKanban, Sparkles, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { ROUTES } from "@/constants/routes";

export default async function DashboardPage() {
  const user = await requireUser();

  const [projectCount, promptCount, favoriteCount] = await Promise.all([
    prisma.project.count({ where: { userId: user.id } }),
    prisma.prompt.count({ where: { userId: user.id } }),
    prisma.prompt.count({ where: { userId: user.id, favorite: true } }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`Hello, ${user.name.split(" ")[0] ?? user.name}`}
        description="Your workspace at a glance. Create projects, capture prompts, and mark favorites for quick access."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Projects"
          value={projectCount}
          href={ROUTES.projects}
          linkLabel="Manage projects"
          icon={FolderKanban}
          accent="violet"
        />
        <StatCard
          title="Prompts"
          value={promptCount}
          href={ROUTES.prompts}
          linkLabel="View all prompts"
          icon={Sparkles}
          accent="blue"
        />
        <StatCard
          title="Favorites"
          value={favoriteCount}
          href={ROUTES.favorites}
          linkLabel="Open favorites"
          icon={Star}
          accent="amber"
        />
      </div>
    </div>
  );
}
