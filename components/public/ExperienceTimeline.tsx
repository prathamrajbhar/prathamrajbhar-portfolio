import { BriefcaseBusiness, Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import type { ExperienceDTO } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ExperienceTimeline({ experiences }: { experiences: ExperienceDTO[] }) {
  return (
    <div className="relative space-y-12 before:absolute before:left-[19px] before:top-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-primary/50 before:via-border/50 before:to-transparent">
      {experiences.map((item) => (
        <article key={item.id} className="relative pl-12 group">
          {/* Timeline Marker */}
          <span className="absolute left-0 top-1 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-bg border-2 border-primary/50 shadow-sm transition-transform group-hover:scale-110">
            <span className="h-3 w-3 rounded-full bg-primary" />
          </span>
          
          <div className="glass flex flex-col gap-6 rounded-[2rem] p-8 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary/5 sm:flex-row">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-surface border border-border/50 shadow-inner">
              {item.logoUrl ? (
                <Image src={item.logoUrl} alt={item.company} fill className="object-cover p-2" sizes="64px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-2xl font-black text-primary/40">
                  {item.company.slice(0, 1)}
                </div>
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-2xl font-black tracking-tight">{item.role}</h3>
                    {item.current ? (
                      <Badge variant="success" className="px-3 py-0.5 text-[10px] font-black uppercase tracking-widest">Active</Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-3 text-sm font-bold tracking-tight text-muted">
                    <span className="flex items-center gap-1.5 text-primary">
                      <BriefcaseBusiness size={16} />
                      {item.company}
                    </span>
                    {item.location && (
                      <span className="flex items-center gap-1.5 text-muted/60">
                        <MapPin size={16} />
                        {item.location}
                      </span>
                    )}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary">
                  <Calendar size={14} />
                  {formatDate(item.startDate, "MMM yyyy")} — {item.current ? "Present" : item.endDate ? formatDate(item.endDate, "MMM yyyy") : ""}
                </div>
              </div>

              <p className="mt-6 text-lg leading-relaxed text-muted/90">
                {item.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {item.skills.map((skill) => (
                  <Badge key={skill} variant="muted" className="border-border/50 bg-surface/50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted/80">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
