import Image from "next/image";
import type { SkillDTO } from "@/lib/types";

export function SkillsCloud({ skills }: { skills: SkillDTO[] }) {
  const grouped = skills.reduce<Record<string, SkillDTO[]>>((acc, skill) => {
    acc[skill.category] = [...(acc[skill.category] ?? []), skill];
    return acc;
  }, {});

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="glass group relative overflow-hidden rounded-[2rem] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 transition-transform group-hover:scale-150" />
          
          <h3 className="font-display text-xl font-black uppercase tracking-[0.1em] text-primary">
            {category}
          </h3>
          
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {items.map((skill) => (
              <div 
                key={skill.id} 
                className="group/skill relative flex items-center gap-4 overflow-hidden rounded-xl border border-border/40 bg-surface/20 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-surface/60 hover:shadow-md hover:shadow-primary/5 dark:bg-surface/5"
              >
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/0 via-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover/skill:opacity-100" />
                
                {skill.iconUrl ? (
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface/50 p-2 shadow-sm dark:bg-black/20">
                    <Image
                      src={skill.iconUrl}
                      alt={skill.name}
                      fill
                      className="object-contain p-2 transition-transform duration-300 group-hover/skill:scale-110"
                    />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-display text-lg font-black text-primary shadow-sm">
                    {skill.name.charAt(0)}
                  </div>
                )}
                <span className="font-semibold tracking-tight text-muted/90 transition-colors group-hover/skill:text-text">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
