"use client";

import { AlertCircle, Lightbulb, TrendingUp, CheckCircle, Sparkles } from "lucide-react";
import type { ProjectDTO } from "@/lib/types";

interface ProjectCaseStudyProps {
  project: ProjectDTO;
}

export function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const hasNarrative = project.problem || project.solution || project.impact;
  const hasHighlights = project.features.length > 0 || project.outcomes.length > 0;

  if (!hasNarrative && !hasHighlights) return null;

  // Prepare active narrative items to dynamically size the grid
  const narrativeItems = [
    {
      value: project.problem,
      label: "The Challenge",
      title: "Problem Statement",
      icon: AlertCircle,
      wrapperClass: "border-amber-500/10 bg-amber-500/[0.02] hover:border-amber-500/20 hover:bg-amber-500/[0.04] hover:shadow-lg hover:shadow-amber-500/[0.02]",
      iconClass: "bg-amber-500/10 text-amber-500",
      labelClass: "text-amber-500/80"
    },
    {
      value: project.solution,
      label: "The Approach",
      title: "Proposed Solution",
      icon: Lightbulb,
      wrapperClass: "border-emerald-500/10 bg-emerald-500/[0.02] hover:border-emerald-500/20 hover:bg-emerald-500/[0.04] hover:shadow-lg hover:shadow-emerald-500/[0.02]",
      iconClass: "bg-emerald-500/10 text-emerald-500",
      labelClass: "text-emerald-500/80"
    },
    {
      value: project.impact,
      label: "The Outcome",
      title: "Measured Impact",
      icon: TrendingUp,
      wrapperClass: "border-indigo-500/10 bg-indigo-500/[0.02] hover:border-indigo-500/20 hover:bg-indigo-500/[0.04] hover:shadow-lg hover:shadow-indigo-500/[0.02]",
      iconClass: "bg-indigo-500/10 text-indigo-500",
      labelClass: "text-indigo-500/80"
    }
  ].filter((item) => Boolean(item.value));

  // Determine grid columns dynamically based on narrative count
  const narrativeGridCols =
    narrativeItems.length === 1
      ? "grid-cols-1"
      : narrativeItems.length === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-3";

  const showFeatures = project.features.length > 0;
  const showOutcomes = project.outcomes.length > 0;
  const bothHighlightsExist = showFeatures && showOutcomes;

  return (
    <div className="space-y-12">
      {/* Narrative Section (Problem, Solution, Impact) */}
      {hasNarrative && (
        <div className={`grid gap-6 ${narrativeGridCols}`}>
          {narrativeItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`narrative-${idx}`}
                className={`group relative rounded-2xl border p-6 transition-all duration-300 ${item.wrapperClass}`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl mb-4 ${item.iconClass}`}>
                  <Icon size={20} />
                </div>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${item.labelClass}`}>
                  {item.label}
                </h4>
                <h3 className="font-display text-lg font-bold text-text mb-3">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Features & Outcomes Sections */}
      {hasHighlights && (
        <div className={bothHighlightsExist ? "grid gap-8 md:grid-cols-2" : "space-y-8"}>
          {/* Key Features */}
          {showFeatures && (
            <section className="space-y-4">
              <h3 className="font-display text-2xl font-bold tracking-tight">Key Features</h3>
              <div className={`grid gap-3 ${bothHighlightsExist ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
                {project.features.map((feature, idx) => (
                  <div
                    key={`feat-${idx}`}
                    className="flex gap-4 rounded-xl border border-border/40 bg-surface/10 p-4 transition-colors duration-300 hover:bg-surface/30 hover:border-border"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle size={12} />
                    </div>
                    <span className="text-sm leading-relaxed text-muted font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Outcomes & Milestones */}
          {showOutcomes && (
            <section className="space-y-4">
              <h3 className="font-display text-2xl font-bold tracking-tight">Key Achievements</h3>
              <div className={`grid gap-3 ${bothHighlightsExist ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
                {project.outcomes.map((outcome, idx) => (
                  <div
                    key={`out-${idx}`}
                    className="flex gap-4 rounded-xl border border-border/40 bg-surface/10 p-4 transition-colors duration-300 hover:bg-surface/30 hover:border-border"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                      <Sparkles size={12} />
                    </div>
                    <span className="text-sm leading-relaxed text-muted font-medium">{outcome}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
