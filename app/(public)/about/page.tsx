import type { Metadata } from "next";
import Image from "next/image";
import { SkillsCloud } from "@/components/public/SkillsCloud";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { defaultSettings } from "@/lib/defaults";
import { getSiteSettings, getSkills } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the background, skills, and approach.",
  alternates: {
    canonical: "/about"
  }
};

export default async function AboutPage() {
  const [settings, skills] = await Promise.all([
    getSiteSettings().then(s => s || defaultSettings),
    getSkills()
  ]);

  return (
    <div className="relative overflow-hidden">
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary">Who I am</p>
            <h1 className="mt-6 font-display text-4xl tracking-tight sm:text-5xl lg:text-6xl">
              {settings.aboutTitle?.split(" ").slice(0, -2).join(" ")} <span className="text-gradient">{settings.aboutTitle?.split(" ").slice(-2).join(" ")}</span>
            </h1>
            <p className="mt-8 text-xl leading-relaxed text-muted sm:text-2xl">
              I am {settings.name}, a {settings.title || settings.heroTagline || "Software Engineer"} focused on building good digital solutions and crafting beautiful user experiences.
            </p>
            <div className="mt-10 space-y-5 text-base leading-relaxed text-muted md:text-lg">
              <p>{settings.heroBio}</p>
              {settings.aboutExtraBio && <p>{settings.aboutExtraBio}</p>}
            </div>

            <div className="mt-12 flex flex-wrap gap-10">
              <div className="flex flex-col">
                <span className="text-3xl font-medium text-text">{settings.aboutStatsWork}</span>
                <span className="mt-1 text-xs text-muted">Years Work</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-medium text-text">{settings.aboutStatsProjects}</span>
                <span className="mt-1 text-xs text-muted">Projects Done</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-medium text-text">{settings.aboutStatsCommitment}</span>
                <span className="mt-1 text-xs text-muted">Commitment</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent blur-2xl opacity-40" />
            <Card className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={settings.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&h=900&fit=crop"}
                  alt={settings.name}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(min-width: 1024px) 35vw, 100vw"
                />
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-32">
          <div className="mb-12">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">Skills</p>
            <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">My Skills</h2>
          </div>
          <SkillsCloud skills={skills} />
        </div>

        <div className="mt-32 rounded-2xl border border-border bg-surface p-10 text-center sm:p-16">
          <h2 className="font-display text-2xl tracking-tight sm:text-3xl">{settings.contactCtaTitle}</h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted">
            {settings.contactCtaDesc}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/contact" size="lg">Get In Touch</Button>
            <Button href="/projects" variant="secondary" size="lg">View My Work</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
