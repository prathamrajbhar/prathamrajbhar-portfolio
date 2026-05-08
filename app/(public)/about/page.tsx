import type { Metadata } from "next";
import Image from "next/image";
import { SkillsCloud } from "@/components/public/SkillsCloud";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { defaultSettings } from "@/lib/defaults";
import { fetchApi } from "@/lib/server-data";
import type { SiteSettingsDTO, SkillDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description: "About the engineer behind the portfolio."
};

export default async function AboutPage() {
  const [settings, skills] = await Promise.all([
    fetchApi<SiteSettingsDTO>("/settings", defaultSettings),
    fetchApi<SkillDTO[]>("/skills", [])
  ]);

  return (
    <div className="relative overflow-hidden">
      {/* Background Visuals */}
      <div className="mesh-gradient absolute inset-0 opacity-10" />
      
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Identity</p>
            <h1 className="mt-6 font-display text-5xl font-black tracking-tight sm:text-7xl">
              Engineering with <span className="text-gradient">Intent.</span>
            </h1>
            <p className="mt-8 text-2xl font-medium leading-relaxed text-muted/90 sm:text-3xl">
              I am {settings.name}, a {settings.title} focused on building scalable, user-centric digital solutions.
            </p>
            <div className="mt-10 space-y-6 text-lg leading-relaxed text-muted/80 md:text-xl">
              <p>{settings.bio}</p>
              <p>
                My approach combines technical rigor with a deep understanding of product goals, ensuring that every line of code contributes to a meaningful user experience.
              </p>
            </div>
            
            <div className="mt-12 flex flex-wrap gap-8">
              <div className="flex flex-col">
                <span className="text-4xl font-black text-primary">2+</span>
                <span className="text-xs font-black uppercase tracking-widest text-muted/50">Years of Focus</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-black text-primary">15+</span>
                <span className="text-xs font-black uppercase tracking-widest text-muted/50">Projects Shipped</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-black text-primary">100%</span>
                <span className="text-xs font-black uppercase tracking-widest text-muted/50">Commitment</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-primary/20 to-transparent blur-3xl opacity-50" />
            <Card className="glass group relative aspect-[4/5] overflow-hidden rounded-[3rem] p-4 shadow-2xl">
              <div className="relative h-full w-full overflow-hidden rounded-[2.2rem]">
                <Image
                  src={settings.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&h=900&fit=crop"}
                  alt={settings.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(min-width: 1024px) 35vw, 100vw"
                />
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-32">
          <div className="mb-16 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Expertise</p>
            <h2 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-6xl">Technical Arsenal</h2>
          </div>
          <SkillsCloud skills={skills} />
        </div>

        <div className="mt-32 rounded-[3rem] border border-border bg-surface/30 p-12 text-center dark:bg-surface/5">
          <h2 className="font-display text-3xl font-black tracking-tight">Looking for a collaborator?</h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-muted">
            I&apos;m currently open to new opportunities and interesting projects. If you have a problem to solve, let&apos;s talk.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button href="/contact" size="xl">Get In Touch</Button>
            <Button href="/projects" variant="secondary" size="xl">View My Work</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
