"use client";

import { Github, Linkedin, Mail, Twitter, ArrowUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { SiteSettingsDTO } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettingsDTO }) {
  const socialLinks = [
    settings.github ? { href: settings.github, label: "GitHub", icon: Github } : null,
    settings.linkedin ? { href: settings.linkedin, label: "LinkedIn", icon: Linkedin } : null,
    settings.twitter ? { href: settings.twitter, label: "Twitter", icon: Twitter } : null,
    { href: `mailto:${settings.email}`, label: "Email", icon: Mail }
  ].filter((item): item is { href: string; label: string; icon: typeof Github } => Boolean(item));

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/experience", label: "Experience" },
    { href: "/contact", label: "Contact" }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border bg-surface/30 dark:bg-surface/5">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <span className="font-display text-xl font-black">P</span>
              </div>
              <span className="font-display text-2xl font-black tracking-tight">{settings.name}</span>
            </Link>
            <p className="mt-6 max-w-sm text-lg leading-relaxed text-muted/90">
              Computer engineer specializing in building high-quality, product-minded digital experiences.
            </p>
            <div className="mt-8 flex items-center gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <Link 
                  key={label} 
                  href={href} 
                  target="_blank"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-border text-muted transition-all hover:-translate-y-1 hover:border-primary hover:bg-primary/5 hover:text-primary dark:bg-surface/20" 
                  aria-label={label}
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-primary">Navigation</h3>
            <ul className="mt-6 space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-primary">Contact</h3>
            <ul className="mt-6 space-y-4">
              <li className="text-muted">{settings.location || "Remote / Global"}</li>
              <li>
                <Link href={`mailto:${settings.email}`} className="text-muted transition-colors hover:text-primary">
                  {settings.email}
                </Link>
              </li>
              <li>
                <Button href="/contact" variant="outline" size="sm" className="mt-2">Get In Touch</Button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm font-medium text-muted">
            © {new Date().getFullYear()} <span className="text-text">{settings.name}</span>. 
            Built with <span className="text-primary transition-colors hover:text-primary-hover">Next.js</span> & <span className="text-primary transition-colors hover:text-primary-hover">Tailwind</span>
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={scrollToTop} 
            className="group gap-2 text-muted hover:text-primary"
          >
            Back to top
            <ArrowUp size={16} className="transition-transform group-hover:-translate-y-1" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
