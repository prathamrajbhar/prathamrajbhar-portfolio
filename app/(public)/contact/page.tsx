import type { Metadata } from "next";
import { Mail, Sparkles, MapPin, MessageSquare, ArrowUpRight } from "lucide-react";
import { Github, Linkedin, X } from "@/components/ui/BrandIcons";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ContactForm } from "@/components/public/ContactForm";
import { getSiteSettings } from "@/lib/data";
import { defaultSettings } from "@/lib/defaults";
import { Card } from "@/components/ui/Card";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for collaborations, projects, or inquiries.",
  alternates: {
    canonical: "/contact"
  }
};

export default async function ContactPage() {
  const settings = await getSiteSettings().then(s => s || defaultSettings);
  const socials = [
    settings.github ? { href: settings.github, label: "GitHub", icon: Github, color: "hover:text-[#24292e]" } : null,
    settings.linkedin ? { href: settings.linkedin, label: "LinkedIn", icon: Linkedin, color: "hover:text-[#0077b5]" } : null,
    settings.twitter ? { href: settings.twitter, label: "Twitter", icon: X, color: "hover:text-[#1da1f2]" } : null
  ].filter((item): item is { href: string; label: string; icon: typeof Github; color: string } => Boolean(item));

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg/50">
      {/* Background Decorative Elements */}
      <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:py-32">
        <div className="mb-16 text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Contact me</p>
          <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl lg:text-7xl">
            Say <span className="text-gradient">hello.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:grid-rows-6">
          {/* Main Contact Form Card */}
          <Card className="lg:col-span-7 lg:row-span-6 p-1 md:p-2 bg-gradient-to-br from-border/50 to-transparent">
            <div className="h-full rounded-[calc(var(--radius-lg)-4px)] bg-surface p-6 md:p-10">
              <div className="mb-10">
                <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
                  <MessageSquare className="text-primary" size={24} />
                  Send me a message
                </h2>
                <p className="mt-2 text-muted">I will get back to you in a day.</p>
              </div>
              <ContactForm />
            </div>
          </Card>

          {/* Contact Details Card */}
          <Card className="flex flex-col justify-between p-8 lg:col-span-5 lg:row-span-2 group hover:border-primary/30 transition-all duration-500">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-semibold">Email me</h3>
              <p className="mt-2 text-muted leading-relaxed">For work or just to say hi.</p>
            </div>
            <a href={`mailto:${settings.email}`} className="mt-8 flex items-center justify-between text-lg font-medium hover:text-primary transition-colors">
              {settings.email}
              <ArrowUpRight size={20} className="text-muted group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </a>
          </Card>

          {/* Social Links Card */}
          <Card className="p-8 lg:col-span-3 lg:row-span-2 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold">Socials</h3>
              <p className="mt-1 text-sm text-muted">Check my social media.</p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {socials.map(({ href, label, icon: Icon, color }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  className={`flex h-14 w-full items-center justify-center rounded-2xl border border-border bg-bg/50 text-muted transition-all duration-300 hover:border-primary/20 ${color} hover:bg-surface hover:shadow-lg hover:shadow-primary/5`}
                  aria-label={label}
                >
                  <Icon size={22} />
                </Link>
              ))}
            </div>
          </Card>

          {/* Status/Availability Card */}
          <Card className="p-8 lg:col-span-2 lg:row-span-2 flex flex-col items-center justify-center text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="relative z-10">
               <div className="relative mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface border border-border shadow-inner">
                  <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${settings.openToWork ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <Sparkles size={28} className={settings.openToWork ? 'text-emerald-500' : 'text-amber-500'} />
               </div>
               <h3 className="font-semibold">Work status</h3>
               <div className="mt-3">
                 {settings.openToWork ? (
                   <Badge variant="success" className="px-4 py-1 text-xs font-bold uppercase tracking-wider">Available for work</Badge>
                 ) : (
                   <Badge variant="muted" className="px-4 py-1 text-xs font-bold uppercase tracking-wider">Currently busy</Badge>
                 )}
               </div>
             </div>
          </Card>

          {/* Location Card */}
          <Card className="p-8 lg:col-span-5 lg:row-span-2 flex items-center gap-8 group hover:border-primary/30 transition-all duration-500">
             <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary group-hover:scale-110 transition-transform duration-500">
               <MapPin size={32} />
             </div>
             <div>
               <h3 className="text-xl font-semibold">Location</h3>
               <p className="mt-1 text-muted leading-relaxed">{settings.location ? `I work from ${settings.location}, but can work with anyone in the world.` : ""}</p>
             </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
