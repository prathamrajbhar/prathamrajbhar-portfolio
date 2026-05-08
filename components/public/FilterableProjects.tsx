"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/public/ProjectCard";
import type { ProjectDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FilterableProjects({ projects }: { projects: ProjectDTO[] }) {
  const [active, setActive] = useState("All");
  const tags = useMemo(() => ["All", ...Array.from(new Set(projects.flatMap((project) => project.tags.map((tag) => tag.name))))], [projects]);
  const visible = active === "All" ? projects : projects.filter((project) => project.tags.some((tag) => tag.name === active));

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center gap-3">
        <span className="mr-4 text-xs font-bold uppercase tracking-widest text-muted/60">Filter by</span>
        {tags.map((tag) => (
          <button 
            key={tag} 
            onClick={() => setActive(tag)} 
            className={cn(
              "rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300",
              active === tag 
                ? "bg-primary text-white shadow-lg shadow-primary/30" 
                : "bg-surface/50 text-muted border border-border/50 hover:bg-surface hover:text-text dark:bg-surface/20"
            )}
          >
            {tag}
          </button>
        ))}
      </div>
      
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>

      {visible.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/30 p-12 text-center">
          <p className="text-xl font-bold text-muted">No projects found for this category.</p>
          <button onClick={() => setActive("All")} className="mt-4 text-primary hover:underline">View all projects</button>
        </div>
      )}
    </div>
  );
}
