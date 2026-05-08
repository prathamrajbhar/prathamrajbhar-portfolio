import type { Metadata } from "next";
import { Github, Linkedin, Mail, MapPin, Twitter, Sparkles } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/components/public/ContactForm";
import { Badge } from "@/components/ui/Badge";
import { defaultSettings } from "@/lib/defaults";
import { fetchApi } from "@/lib/server-data";
import { cn } from "@/lib/utils";
import type { SiteSettingsDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact form and social links."
};

export default async function ContactPage() {
  const settings = await fetchApi<SiteSettingsDTO>("/settings", defaultSettings);
  const socials = [
    settings.github ? { href: settings.github, label: "GitHub", icon: Github, color: "hover:text-[#333] hover:bg-[#333]/5" } : null,
    settings.linkedin ? { href: settings.linkedin, label: "LinkedIn", icon: Linkedin, color: "hover:text-[#0077b5] hover:bg-[#0077b5]/5" } : null,
    settings.twitter ? { href: settings.twitter, label: "Twitter", icon: Twitter, color: "hover:text-[#1da1f2] hover:bg-[#1da1f2]/5" } : null
  ].filter((item): item is { href: string; label: string; icon: typeof Github; color: string } => Boolean(item));

  return (
    <div className="relative overflow-hidden">
      {/* Background Visuals */}
      <div className="mesh-gradient absolute inset-0 opacity-10" />
      
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Get in touch</p>
            <h1 className="mt-6 font-display text-5xl font-black tracking-tight sm:text-7xl">
              Let&apos;s build <span className="text-gradient">Something.</span>
            </h1>
            <p className="mt-8 text-xl leading-relaxed text-muted/90">
              I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>

            <div className="mt-12 space-y-8">
              <div className="glass flex items-center gap-6 rounded-3xl p-6 transition-transform hover:translate-x-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted/50">Email me at</p>
                  <p className="text-xl font-bold">{settings.email}</p>
                </div>
              </div>

              <div className="glass flex items-center gap-6 rounded-3xl p-6 transition-transform hover:translate-x-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted/50">Location</p>
                  <p className="text-xl font-bold">{settings.location || "Remote / Global"}</p>
                </div>
              </div>

              <div className="glass flex items-center gap-6 rounded-3xl p-6 transition-transform hover:translate-x-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                  <Sparkles size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted/50">Status</p>
                  <div className="mt-1">
                    {settings.openToWork ? (
                      <Badge variant="success" className="px-4 py-1 font-black uppercase tracking-widest">Available</Badge>
                    ) : (
                      <Badge variant="muted" className="px-4 py-1 font-black uppercase tracking-widest">Focused</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <p className="mb-6 text-xs font-black uppercase tracking-widest text-muted/50">Social Connect</p>
              <div className="flex gap-4">
                {socials.map(({ href, label, icon: Icon, color }) => (
                  <Link 
                    key={label} 
                    href={href} 
                    target="_blank"
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-2xl bg-surface border border-border/50 text-muted transition-all duration-300 hover:-translate-y-1 dark:bg-surface/10",
                      color
                    )} 
                    aria-label={label}
                  >
                    <Icon size={24} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-primary/20 to-transparent blur-2xl opacity-50" />
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
