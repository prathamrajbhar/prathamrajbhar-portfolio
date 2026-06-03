"use client";

import { ExternalLink, ArrowRight } from "lucide-react";
import { Github } from "@/components/ui/BrandIcons";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ProjectDTO } from "@/lib/types";

export function ProjectCard({ project }: { project: ProjectDTO }) {
  // Parse and split any comma-separated tech stack items dynamically
  const techItems = project.techStack
    .flatMap((tech) => tech.split(",").map((t) => t.trim()))
    .filter(Boolean);

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border border-border/50 bg-surface/20 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
      {/* Cover Image */}
      <Link href={`/projects/${project.slug}`} className="relative aspect-[16/10] w-full overflow-hidden bg-surface/10">
        <Image
          src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute right-3 top-3 z-10">
          <Badge 
            variant={project.status === "completed" ? "success" : "warning"}
            className="backdrop-blur-md bg-bg/80 border-border/60 shadow-sm text-[10px] font-bold uppercase tracking-wider px-2 py-0.5"
          >
            {project.status}
          </Badge>
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-6">
        <Link href={`/projects/${project.slug}`}>
          <h3 className="font-display text-xl font-bold tracking-tight text-text group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
        </Link>

        <p className="mt-2.5 text-sm leading-relaxed text-muted line-clamp-2">
          {project.description}
        </p>

        {/* Tech Stack - Clean Dot-separated inline list */}
        {techItems.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted/60 font-semibold">
            {techItems.slice(0, 4).map((tech, idx) => (
              <span key={`${tech}-${idx}`} className="flex items-center">
                {tech}
                {idx < Math.min(techItems.length, 4) - 1 && (
                  <span className="ml-2 text-muted/30 font-normal">·</span>
                )}
              </span>
            ))}
            {techItems.length > 4 && (
              <span className="text-muted/40 ml-1">+{techItems.length - 4} more</span>
            )}
          </div>
        )}

        {/* Actions Row */}
        <div className="mt-auto pt-6 flex items-center justify-between border-t border-border/30">
          <Link 
            href={`/projects/${project.slug}`} 
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-hover transition-colors"
          >
            Case Study 
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          
          <div className="flex items-center gap-3 text-muted/60">
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-primary transition-colors"
                aria-label="View Source Code"
              >
                <Github size={16} />
              </a>
            )}
            {project.liveUrl && (
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-primary transition-colors"
                aria-label="View Live Site"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
