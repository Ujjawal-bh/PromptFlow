import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { ContentPanel } from "@/components/layout/content-panel";
import { PromptRow } from "@/features/prompts/prompt-row";

export default async function FavoritesPage() {
  const user = await requireUser();

  const prompts = await prisma.prompt.findMany({
    where: { userId: user.id, favorite: true },
    orderBy: { updatedAt: "desc" },
    include: { project: { select: { name: true } } },
  });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Favorites"
        description="Prompts you've starred for quick access."
      />

      {prompts.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No favorites yet"
          description="Star a prompt from any list or detail page to pin it here."
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
