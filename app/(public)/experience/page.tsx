import type { Metadata } from "next";
import { GraduationCap, Sparkles } from "lucide-react";
import { ExperienceTimeline } from "@/components/public/ExperienceTimeline";
import { SkillsCloud } from "@/components/public/SkillsCloud";
import { Card } from "@/components/ui/Card";
import { fetchApi } from "@/lib/server-data";
import type { ExperienceDTO, SkillDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Experience",
  description: "Professional experience and education timeline."
};

export default async function ExperiencePage() {
  const [experiences, skills] = await Promise.all([
    fetchApi<ExperienceDTO[]>("/experience", []),
    fetchApi<SkillDTO[]>("/skills", [])
  ]);

  return (
    <div className="relative overflow-hidden">
      {/* Background Visuals */}
      <div className="mesh-gradient absolute inset-0 opacity-10" />

      <section className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Resume</p>
          <h1 className="mt-6 font-display text-5xl font-black tracking-tight sm:text-7xl">
            Professional <span className="text-gradient">Trajectory.</span>
          </h1>
          <p className="mt-8 text-xl leading-relaxed text-muted/90">
            A chronicle of my engineering roles, academic background, and the technical arsenal I&apos;ve built over the years.
          </p>
        </div>

        <div className="mt-24 grid gap-16 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="mb-10 flex items-center gap-3 font-display text-3xl font-black tracking-tight">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles size={20} />
              </span>
              Work Experience
            </h2>
            <ExperienceTimeline experiences={experiences} />
          </div>

          <div className="space-y-16">
            <div>
              <h2 className="mb-10 flex items-center gap-3 font-display text-3xl font-black tracking-tight">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <GraduationCap size={20} />
                </span>
                Education
              </h2>
              <Card className="glass relative overflow-hidden p-8 transition-transform hover:-translate-y-1">
                <div className="absolute right-0 top-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full bg-amber-500/10" />
                <h3 className="font-display text-2xl font-black tracking-tight">B.Tech in Computer Engineering</h3>
                <p className="mt-4 text-lg leading-relaxed text-muted/90">
                  Specialized in distributed systems, high-performance computing, and human-centered design.
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted/50">
                  <span className="text-primary">2020 — 2024</span>
                </div>
              </Card>
            </div>

            <div>
              <h2 className="mb-10 flex items-center gap-3 font-display text-3xl font-black tracking-tight">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                  <Sparkles size={20} />
                </span>
                Top Skills
              </h2>
              <div className="grid gap-4">
                {skills.slice(0, 6).map((skill) => (
                  <div key={skill.id} className="glass flex items-center gap-4 p-4 px-6 rounded-2xl transition-all hover:translate-x-1">
                    {skill.iconUrl ? (
                      <div className="relative h-6 w-6 flex-shrink-0">
                        <img src={skill.iconUrl} alt={skill.name} className="h-full w-full object-contain" />
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
                        {skill.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex flex-1 items-center justify-between">
                      <span className="font-bold tracking-tight">{skill.name}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">{skill.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32">
          <h2 className="mb-12 text-center font-display text-4xl font-black tracking-tight">Technical Arsenal</h2>
          <SkillsCloud skills={skills} />
        </div>
      </section>
    </div>
  );
}

