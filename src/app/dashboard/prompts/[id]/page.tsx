import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BackLink } from "@/components/layout/back-link";
import { ROUTES } from "@/constants/routes";
import { FavoriteToggle } from "@/features/prompts/favorite-toggle";
import { PromptEditForm } from "@/features/prompts/prompt-edit-form";
import { DeletePromptButton } from "@/features/prompts/delete-prompt-button";

type Props = { params: Promise<{ id: string }> };

export default async function PromptDetailPage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;

  const prompt = await prisma.prompt.findFirst({
    where: { id, userId: user.id },
    include: { project: { select: { id: true, name: true } } },
  });

  if (!prompt) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <Card className="overflow-hidden">
        <CardHeader className="space-y-4 border-b border-border/60 bg-muted/20 pb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <BackLink href={ROUTES.prompts}>All prompts</BackLink>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {prompt.title}
                </CardTitle>
                <FavoriteToggle promptId={prompt.id} favorite={prompt.favorite} />
              </div>
              <p className="text-sm text-muted-foreground">
                Project:{" "}
                <Link
                  className="font-medium text-primary underline-offset-4 hover:text-primary/80"
                  href={`${ROUTES.projects}/${prompt.project.id}`}
                >
                  {prompt.project.name}
                </Link>
              </p>
              {prompt.description ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {prompt.description}
                </p>
              ) : null}
              {prompt.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
            <DeletePromptButton promptId={prompt.id} promptTitle={prompt.title} />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Content</h2>
          <pre className="mt-3 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-xl border border-border/60 bg-muted/30 p-5 font-mono text-sm leading-relaxed">
            {prompt.content}
          </pre>
        </CardContent>
      </Card>

      <div className="rounded-2xl border bg-card p-6 shadow-soft">
        <h2 className="text-lg font-semibold tracking-tight">Edit prompt</h2>
        <p className="mt-1 text-sm text-muted-foreground">Changes are validated on the client and server.</p>
        <Separator className="my-6" />
        <PromptEditForm prompt={prompt} />
      </div>
    </div>
  );
}
