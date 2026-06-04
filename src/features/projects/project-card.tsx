import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

type ProjectCardProps = {
  project: {
    id: string;
    name: string;
    description: string | null;
    promptCount: number;
    updatedAt: Date;
  };
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group flex flex-col overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-glow">
      <CardHeader className="pb-3">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
          <FileText className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <CardTitle className="text-lg leading-snug">{project.name}</CardTitle>
        <CardDescription className="line-clamp-2 leading-relaxed">
          {project.description ?? "No description yet."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {project.promptCount} prompt{project.promptCount === 1 ? "" : "s"}
        </p>
      </CardContent>
      <CardFooter className="border-t border-border/60 bg-muted/30 pt-4">
        <Button asChild variant="outline" className="w-full rounded-xl group-hover:border-primary/40">
          <Link href={`${ROUTES.projects}/${project.id}`}>
            Open project
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
