import { ExternalLink, Eye, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ProjectDTO } from "@/lib/types";

export function ProjectCard({ project }: { project: ProjectDTO }) {
  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border-border/50 bg-surface/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-surface/20">
      <Link href={`/projects/${project.slug}`} className="relative block aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <Image
          src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute right-3 top-3 z-20">
          <Badge variant={project.status === "completed" ? "success" : "warning"} className="glass backdrop-blur-md">
            {project.status}
          </Badge>
        </div>
      </Link>
      
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <Link href={`/projects/${project.slug}`} className="font-display text-xl font-bold tracking-tight transition-colors hover:text-primary">
            {project.title}
          </Link>
        </div>
        
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted/90">
          {project.description}
        </p>
        
        <div className="mt-auto">
          <div className="mb-5 flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="muted" className="bg-primary/5 text-[10px] font-semibold uppercase tracking-wider text-primary dark:bg-primary/10">
                {tech}
              </Badge>
            ))}
            {project.techStack.length > 3 && (
              <span className="text-[10px] font-medium text-muted">+{project.techStack.length - 3} more</span>
            )}
          </div>
          
          <div className="flex items-center justify-between border-t border-border/50 pt-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
              <Eye size={14} className="text-primary/70" /> {project.views} views
            </span>
            <div className="flex items-center gap-1">
              {project.githubUrl ? (
                <Link 
                  href={project.githubUrl} 
                  target="_blank"
                  aria-label="GitHub repository" 
                  className="rounded-full p-2 text-muted transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <Github size={18} />
                </Link>
              ) : null}
              {project.liveUrl ? (
                <Link 
                  href={project.liveUrl} 
                  target="_blank"
                  aria-label="Live project" 
                  className="rounded-full p-2 text-muted transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <ExternalLink size={18} />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
