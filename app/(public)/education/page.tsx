import type { Metadata } from "next";
import { MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getEducation, getSiteSettings } from "@/lib/data";
import { defaultSettings } from "@/lib/defaults";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Education",
  description: "Academic background and educational journey.",
  alternates: {
    canonical: "/education"
  }
};

export default async function EducationPage() {
  const [educations, settings] = await Promise.all([
    getEducation(),
    getSiteSettings().then(s => s || defaultSettings),
  ]);

  return (
    <div className="relative overflow-hidden">
      <section className="relative z-10 mx-auto max-w-4xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">Education</p>
          <h1 className="mt-6 font-display text-4xl tracking-tight sm:text-5xl">
            Education
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
            {settings.educationHeroDesc || ""}
          </p>
        </div>

        <div className="mt-14 space-y-8">
          {educations.map((edu) => (
            <Card key={edu.id} className="overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="flex items-center gap-1.5 text-xs text-muted">
                    <Calendar size={14} />
                    {edu.startYear} — {edu.current ? "Now" : edu.endYear}
                  </span>
                  {edu.location && (
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      <MapPin size={14} />
                      {edu.location}
                    </span>
                  )}
                  {edu.current && (
                    <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] text-white">Current</span>
                  )}
                </div>

                <h2 className="font-display text-xl tracking-tight sm:text-2xl">
                  {edu.degree}
                </h2>
                <p className="mt-2 text-sm font-medium text-primary">
                  {edu.institution}
                </p>
                {edu.field && (
                  <p className="mt-1 text-sm text-muted">Field: {edu.field}</p>
                )}

                {edu.description && (
                  <p className="mt-5 text-sm leading-relaxed text-muted">
                    {edu.description}
                  </p>
                )}

                {edu.gpa && (
                  <div className="mt-5 inline-flex items-center rounded-lg bg-surface border border-border px-3 py-2">
                    <span className="text-xs text-muted">GPA:</span>
                    <span className="ml-2 text-sm font-medium">{edu.gpa}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <Button href="/experience" variant="secondary">
            See my jobs
          </Button>
        </div>
      </section>
    </div>
  );
}
