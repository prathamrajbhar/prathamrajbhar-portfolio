"use client";

import type { SkillDTO } from "@/lib/types";

export function TechMarquee({ skills }: { skills: SkillDTO[] }) {
  if (!skills.length) return null;

  // Duplicate enough times so there's always content visible during the loop
  const duplicated = [...skills, ...skills];

  return (
    <div className="relative flex w-full overflow-hidden border-y border-border py-5">
      {/* Fade masks on left and right */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-bg to-transparent" />

      {/* Inner container: two copies, CSS animation shifts by 50% for seamless loop */}
      <div className="flex animate-marquee whitespace-nowrap">
        {duplicated.map((skill, index) => (
          <div
            key={`${skill.id}-${index}`}
            className="flex items-center gap-2.5 px-5 text-sm font-medium tracking-tight text-muted/50"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
            {skill.name}
          </div>
        ))}
      </div>
    </div>
  );
}
