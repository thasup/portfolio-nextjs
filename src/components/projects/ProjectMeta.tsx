import { type Project } from "@/types/project";
import { TechBadge } from "@/components/shared/TechBadge";
import { Calendar, Globe, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ProjectMetaProps {
  project: Project;
}

export function ProjectMeta({ project }: ProjectMetaProps) {
  const t = useTranslations("projects.labels");

  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8">
      <h3 className="mb-4 text-lg font-bold">Project Info</h3>

      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">{t("yearDelivered")}</div>
            <div className="text-muted-foreground">{project.year}</div>
          </div>
        </div>

        <div>
          <div className="mb-3 text-sm font-medium">Core Technologies</div>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <TechBadge key={tech} name={tech} />
            ))}
          </div>
        </div>

        {(project.liveUrl || project.sourceUrl) && (
          <div className="space-y-3 pt-4 border-t border-border">
            {project.liveUrl && (
              <Button className="w-full justify-start" asChild>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Visit Live Site
                </a>
              </Button>
            )}

            {project.sourceUrl && (
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  View Source Code
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
