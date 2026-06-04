import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, ExternalLink, Trophy, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getHackathonBySlug } from "@/lib/data";

export const revalidate = 86400;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hackathon = await getHackathonBySlug(slug);
  if (!hackathon) return { title: "Not Found" };
  return {
    title: `${hackathon.title} | Hackathon`,
    description: hackathon.description,
  };
}

export default async function HackathonDetailPage({ params }: Props) {
  const { slug } = await params;
  const hackathon = await getHackathonBySlug(slug);
  if (!hackathon) notFound();

  // Split description by newlines for clean structuring
  const paragraphs = hackathon.description
    .split("\n")
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      {/* Back Button */}
      <div className="mb-10">
        <Link href="/experience" className="group inline-flex items-center text-xs font-black uppercase tracking-[0.3em] text-muted hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Experience
        </Link>
      </div>

      <div className="space-y-12">
        {/* Title, Badge & Meta */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            {hackathon.result && (
              <Badge variant="default" className="bg-primary/10 border-primary/20 text-primary py-0.5 px-3 uppercase text-[10px] font-black tracking-wider">
                {hackathon.result}
              </Badge>
            )}
            <span className="flex items-center gap-1.5 text-xs text-muted/80 font-medium">
              <Calendar size={14} className="text-primary/60" />
              {new Date(hackathon.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            {hackathon.location && (
              <span className="flex items-center gap-1.5 text-xs text-muted/80 font-medium">
                <MapPin size={14} className="text-primary/60" />
                {hackathon.location}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-text leading-tight">
              {hackathon.title}
            </h1>
            <p className="text-xl font-bold text-primary">
              {hackathon.project}
            </p>
            {hackathon.role && (
              <div className="inline-flex items-center gap-2 rounded-xl bg-surface/50 border border-border/50 px-4 py-2 text-xs font-bold text-muted">
                <User size={12} className="text-primary/70" />
                <span>Role: <strong className="text-text font-black">{hackathon.role}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Certificate / Project Image Display Frame */}
        {hackathon.image && (
          <div className="relative group rounded-[2rem] border border-border/50 bg-surface/10 p-4 backdrop-blur-md shadow-2xl transition-all duration-500 hover:border-primary/20">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 via-fuchsia-500/5 to-primary/10 rounded-[2.2rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-bg/50">
              <Image
                src={hackathon.image}
                alt={hackathon.title}
                fill
                className="object-contain p-2 transition-transform duration-700 group-hover:scale-[1.01]"
                sizes="(min-width: 1024px) 800px, 100vw"
                priority
              />
            </div>
          </div>
        )}

        {/* Structured Description Section */}
        <div className="space-y-8">
          <div className="border-b border-border/30 pb-3">
            <h2 className="text-lg font-black uppercase tracking-widest text-text/90">Project Overview</h2>
          </div>

          <div className="space-y-6 text-base leading-relaxed text-muted/90">
            {paragraphs.map((p, idx) => {
              // Check if it's a bullet point starting with a dash, dot, or typical bullet indicator
              const isBullet = p.startsWith("—") || p.startsWith("-") || p.startsWith("*") || p.startsWith(">") || p.startsWith("•");
              
              if (isBullet) {
                return (
                  <div key={idx} className="flex gap-3 pl-2">
                    <span className="text-primary font-black select-none">•</span>
                    <p className="flex-1 text-muted/80">{p.replace(/^[-*—•>]\s*/, "")}</p>
                  </div>
                );
              }

              // Check if it's a line that starts with an emoji, we can give it custom spacing
              const startsWithEmoji = /^\p{Emoji}/u.test(p);
              if (startsWithEmoji) {
                return (
                  <div key={idx} className="flex items-start gap-3.5 pl-1 py-1 bg-surface/5 rounded-2xl border border-border/10 p-4">
                    <p className="flex-1 text-muted/80">{p}</p>
                  </div>
                );
              }

              return <p key={idx}>{p}</p>;
            })}
          </div>
        </div>

        {/* Project Link CTA Footer */}
        {hackathon.link && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-8 rounded-3xl border border-border/50 bg-surface/10 backdrop-blur-md">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text/80">
                <Trophy size={16} className="text-primary" />
                <span>Hackathon Submission</span>
              </div>
              <p className="text-xs text-muted/60 font-medium">Explore the live repository, documentation, or code case study built during this event.</p>
            </div>

            <Button 
              href={hackathon.link} 
              target="_blank" 
              className="rounded-2xl px-6 py-3 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all font-bold text-sm shrink-0"
              icon={<ExternalLink size={14} className="ml-1" />}
            >
              View Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
