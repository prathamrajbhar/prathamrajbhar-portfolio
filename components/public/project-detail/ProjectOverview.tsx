"use client";

import { Sparkles, LinkIcon, User, Briefcase, Layers, Clock, Calendar, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ProjectDTO } from "@/lib/types";

interface ProjectOverviewProps {
  project: ProjectDTO;
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  const projectLinks = Array.isArray(project.projectLinks) ? project.projectLinks : [];

  // Metadata items with relevant icons
  const metadataConfig = [
    { label: "Role", value: project.role, icon: User },
    { label: "Client", value: project.client, icon: Briefcase },
    { label: "Category", value: project.category, icon: Layers },
    { label: "Timeline", value: project.timeline, icon: Clock },
    { label: "Year", value: project.year, icon: Calendar }
  ];

  const activeMetadata = metadataConfig.filter(item => Boolean(item.value));

  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      {/* Quick Details Card */}
      <div className="rounded-2xl border border-border/50 bg-surface/30 backdrop-blur-md p-6 shadow-xl shadow-black/5 hover:border-border transition-colors duration-300">
        <h3 className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
          <Sparkles size={14} className="animate-pulse" />
          Overview
        </h3>
        
        <div className="divide-y divide-border/30 space-y-4">
          {activeMetadata.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center justify-between pt-4 first:pt-0">
              <div className="flex items-center gap-2.5 text-muted">
                <Icon size={16} className="text-muted/70" />
                <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
              </div>
              <span className="text-sm font-medium text-text text-right max-w-[160px] truncate">{value}</span>
            </div>
          ))}
          
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2.5 text-muted">
              <Sparkles size={16} className="text-muted/70" />
              <span className="text-xs font-semibold uppercase tracking-wider">Status</span>
            </div>
            <span className="capitalize font-bold text-xs">
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${project.status === "completed" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
              {project.status}
            </span>
          </div>
        </div>
      </div>

      {/* Technologies Card */}
      <div className="rounded-2xl border border-border/50 bg-surface/30 backdrop-blur-md p-6 shadow-xl shadow-black/5 hover:border-border transition-colors duration-300">
        <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-primary">Core Tech</h3>
        <ul className="space-y-2.5">
          {project.techStack
            .flatMap((tech) => tech.split(",").map((t) => t.trim()))
            .filter(Boolean)
            .map((tech) => (
              <li key={tech} className="flex items-center gap-2.5 text-sm font-semibold text-text">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/80 shrink-0" />
                <span>{tech}</span>
              </li>
            ))}
        </ul>
      </div>

      {/* Additional Resource Links */}
      {projectLinks.length > 0 && (
        <div className="rounded-2xl border border-border/50 bg-surface/30 backdrop-blur-md p-6 shadow-xl shadow-black/5 hover:border-border transition-colors duration-300">
          <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
            <LinkIcon size={14} />
            Project Links
          </h3>
          <div className="grid gap-2">
            {projectLinks.map((link) => (
              <Button
                key={`${link.label}-${link.url}`}
                href={link.url}
                target="_blank"
                variant="secondary"
                className="justify-between text-xs border-border/60 hover:bg-surface/60 transition-all duration-300 text-muted hover:text-text"
                icon={<ExternalLink size={14} className="order-last ml-auto" />}
              >
                {link.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
