import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { FavoriteToggle } from "@/features/prompts/favorite-toggle";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PromptRow({
  prompt,
  projectName,
}: {
  prompt: {
    id: string;
    title: string;
    favorite: boolean;
    tags: string[];
    updatedAt: Date;
  };
  projectName?: string;
}) {
  return (
    <li className="group flex items-center gap-2 px-4 py-4 transition-colors hover:bg-accent/40 sm:px-5">
      <FavoriteToggle promptId={prompt.id} favorite={prompt.favorite} className="shrink-0" />
      <Link
        href={`${ROUTES.prompts}/${prompt.id}`}
        className="flex min-w-0 flex-1 items-center gap-4 rounded-xl outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="min-w-0 flex-1 space-y-1.5">
          {projectName ? (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">{projectName}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground group-hover:text-primary">{prompt.title}</span>
            {prompt.favorite ? (
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" aria-label="Favorite" />
            ) : null}
          </div>
          {prompt.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {prompt.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
              {prompt.tags.length > 4 ? (
                <Badge variant="muted" className="text-[10px]">
                  +{prompt.tags.length - 4}
                </Badge>
              ) : null}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No tags</p>
          )}
          <p className="text-xs text-muted-foreground">
            Updated {prompt.updatedAt.toLocaleDateString(undefined, { dateStyle: "medium" })}
          </p>
        </div>
        <ChevronRight
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground/50 transition-all",
            "group-hover:translate-x-0.5 group-hover:text-primary",
          )}
        />
      </Link>
    </li>
  );
}
