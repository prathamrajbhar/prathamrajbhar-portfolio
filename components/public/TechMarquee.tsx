"use client";

import { motion } from "framer-motion";
import type { SkillDTO } from "@/lib/types";

export function TechMarquee({ skills }: { skills: SkillDTO[] }) {
  // Duplicate skills to ensure seamless looping
  const duplicatedSkills = [...skills, ...skills, ...skills, ...skills];

  return (
    <div className="relative flex w-full overflow-hidden border-y border-border/50 bg-surface/30 py-6 dark:bg-surface/10">
      <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-bg to-transparent" />
      <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-bg to-transparent" />
      
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {duplicatedSkills.map((skill, index) => (
          <div
            key={`${skill.id}-${index}`}
            className="flex items-center gap-3 text-lg font-bold tracking-tight text-muted/60 transition-colors hover:text-primary"
          >
            <span className="h-2 w-2 rounded-full bg-primary/40" />
            {skill.name}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
