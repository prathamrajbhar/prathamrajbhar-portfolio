"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Briefcase } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import type { ExperienceDTO } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function ExperienceTimeline({ experiences }: { experiences: ExperienceDTO[] }) {
  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative space-y-10 pl-10"
    >
      {/* Immersive Vertical Timeline Line */}
      <div className="absolute inset-y-0 left-[19px] w-[2px] bg-gradient-to-b from-primary/60 via-border/40 to-transparent">
         <motion.div 
            animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 h-20 w-full bg-gradient-to-b from-transparent via-primary to-transparent"
         />
      </div>

      {experiences.map((item) => (
        <motion.article 
          key={item.id} 
          variants={fadeInUp}
          className="group relative"
        >
          {/* Timeline Connector & Glow */}
          <div className="absolute -left-[29px] top-4 z-10">
            <div className="relative flex h-4 w-4 items-center justify-center">
              <div className="absolute h-full w-full rounded-full bg-primary/20 animate-pulse group-hover:bg-primary/40" />
              <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
            </div>
          </div>

          <div className="relative rounded-2xl border border-border/50 bg-surface/30 p-6 backdrop-blur-xl transition-all duration-500 hover:border-primary/20 hover:bg-surface/50 sm:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
              {/* Logo/Icon Container */}
              <div className="relative h-14 w-14 shrink-0">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-transparent p-[1px] group-hover:from-primary/30">
                  <div className="h-full w-full rounded-xl bg-bg/80 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                    {item.logoUrl ? (
                      <Image 
                        src={item.logoUrl} 
                        alt={item.company} 
                        fill 
                        className="object-cover p-2.5 transition-transform duration-700 group-hover:scale-110" 
                        sizes="56px" 
                      />
                    ) : (
                      <Briefcase className="h-7 w-7 text-primary/40 group-hover:text-primary transition-colors duration-500" />
                    )}
                  </div>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-xl font-bold tracking-tight text-text sm:text-2xl">
                        {item.role}
                      </h3>
                      {item.current && (
                        <Badge variant="success" className="h-5 rounded-full px-2.5 text-[9px] font-black uppercase tracking-[0.15em] shadow-sm">
                          Current
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="text-base font-bold text-primary">{item.company}</span>
                      {item.location && (
                        <span className="flex items-center gap-1.5 text-xs text-muted/70">
                          <MapPin size={14} className="text-primary/40" />
                          {item.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-border/50 bg-bg/40 px-4 py-1.5 text-[10px] font-bold tracking-widest text-muted/80 transition-all duration-300 group-hover:border-primary/20 group-hover:text-text">
                    <Calendar size={12} className="text-primary/60" />
                    <span className="uppercase">
                      {formatDate(item.startDate, "MMM yyyy")} — {item.current ? "Now" : item.endDate ? formatDate(item.endDate, "MMM yyyy") : ""}
                    </span>
                  </div>
                </div>

                <div className="mt-5 border-t border-border/10 pt-5">
                  <p className="text-sm leading-relaxed text-muted/90 transition-colors duration-300 group-hover:text-text sm:text-base">
                    {item.description}
                  </p>
                </div>

                {item.skills.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.skills.map((skill, index) => (
                      <Badge 
                        key={`${skill}-${index}`} 
                        variant="muted" 
                        className="rounded-lg border-border/50 bg-surface/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted/70 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}
