import { useMemo } from "react";
import Image from "next/image";
import type { SkillDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

const deviconMap: Record<string, string> = {
  "REST APIs": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg",
  "LangChain": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
};

function getSkillIcon(skill: SkillDTO): string | null {
  if (skill.iconUrl) return skill.iconUrl;
  return deviconMap[skill.name] ?? null;
}

export function SkillsCloud({ skills }: { skills: SkillDTO[] }) {
  // Group skills by category
  const grouped = useMemo(() => {
    return skills.reduce<Record<string, SkillDTO[]>>((acc, skill) => {
      acc[skill.category] = [...(acc[skill.category] ?? []), skill];
      return acc;
    }, {});
  }, [skills]);

  // Order categories: Frontend/Languages -> AI/LLMs -> Databases/Tools
  const orderedCategories = useMemo(() => {
    const keys = Object.keys(grouped);
    
    const frontendKey = keys.find(k => k.toLowerCase().includes("lang") || k.toLowerCase().includes("front")) || "";
    const aiKey = keys.find(k => k.toLowerCase().includes("ai") || k.toLowerCase().includes("llm")) || "";
    const dbKey = keys.find(k => k.toLowerCase().includes("data") || k.toLowerCase().includes("tool")) || "";
    
    const sorted: string[] = [];
    if (frontendKey) sorted.push(frontendKey);
    if (aiKey) sorted.push(aiKey);
    if (dbKey) sorted.push(dbKey);
    
    keys.forEach(k => {
      if (!sorted.includes(k)) sorted.push(k);
    });
    
    return sorted;
  }, [grouped]);

  // Theme colors and outlines per category
  const getCategoryTheme = (category: string) => {
    const name = category.toLowerCase();
    if (name.includes("lang") || name.includes("front")) {
      return {
        dotClass: "bg-primary",
        borderHover: "hover:border-primary/40 hover:shadow-primary/5",
        textClass: "text-primary bg-primary/5 border-primary/10"
      };
    }
    if (name.includes("ai") || name.includes("llm")) {
      return {
        dotClass: "bg-amber-500",
        borderHover: "hover:border-amber-500/40 hover:shadow-amber-500/5",
        textClass: "text-amber-500 bg-amber-500/5 border-amber-500/10"
      };
    }
    if (name.includes("data") || name.includes("tool")) {
      return {
        dotClass: "bg-emerald-500",
        borderHover: "hover:border-emerald-500/40 hover:shadow-emerald-500/5",
        textClass: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10"
      };
    }
    return {
      dotClass: "bg-muted/70",
      borderHover: "hover:border-primary/30 hover:shadow-primary/5",
      textClass: "text-muted bg-surface/50 border-border/50"
    };
  };

  return (
    <div className="relative rounded-3xl border border-border/50 bg-surface/20 p-8 backdrop-blur-md shadow-xl shadow-black/5 divide-y divide-border/10 space-y-12 lg:p-12">
      {orderedCategories.map((category, idx) => {
        const items = grouped[category] || [];
        const theme = getCategoryTheme(category);

        return (
          <div 
            key={category} 
            className={cn(
              "grid gap-6 lg:grid-cols-12 items-start",
              idx > 0 ? "pt-12" : ""
            )}
          >
            {/* Category Sidebar Title */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="text-base font-bold uppercase tracking-[0.18em] text-text/90 leading-snug">
                {category}
              </h3>
              <span className="inline-flex items-center rounded-full border border-border/40 bg-bg/50 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.15em] text-muted/70">
                {items.length} {items.length === 1 ? "tool" : "tools"}
              </span>
            </div>

            {/* Category Skills Pill Cloud */}
            <div className="lg:col-span-9 flex flex-wrap gap-3">
              {items.map((skill) => {
                const iconUrl = getSkillIcon(skill);
                return (
                  <div
                    key={skill.id}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-2xl border border-border/40 bg-surface/30 px-4 py-2.5 transition-all duration-300 hover:bg-surface/50 hover:-translate-y-0.5 hover:shadow-md",
                      theme.borderHover
                    )}
                  >
                    {/* Small High-fidelity Icon or Color Dot */}
                    {iconUrl ? (
                      <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                        <Image
                          src={iconUrl}
                          alt={skill.name}
                          fill
                          className="object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", theme.dotClass)} />
                    )}

                    {/* Skill Label (No truncations!) */}
                    <span className="text-sm font-semibold text-muted transition-colors duration-300 group-hover:text-text">
                      {skill.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
