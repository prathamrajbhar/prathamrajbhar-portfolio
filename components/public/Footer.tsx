"use client";

import { ArrowUp } from "lucide-react";
import { Github, Linkedin, X } from "@/components/ui/BrandIcons";
import Link from "next/link";
import type { SiteSettingsDTO } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettingsDTO }) {
  const socialLinks = [
    settings.github ? { href: settings.github, label: "GitHub", icon: Github } : null,
    settings.linkedin ? { href: settings.linkedin, label: "LinkedIn", icon: Linkedin } : null,
    settings.twitter ? { href: settings.twitter, label: "Twitter", icon: X } : null,
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
    <footer className="relative border-t border-border/50 bg-bg pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top Section: CTA */}
        <div className="mb-20 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {(() => {
                const words = settings.footerTitle?.split(" ") ?? [];
                const splitAt = Math.max(0, words.length - 3);
                const head = words.slice(0, splitAt).join(" ");
                const tail = words.slice(splitAt).join(" ");
                return (
                  <>
                    {head && <>{head} <br /></>}
                    <span className="text-gradient">{tail}</span>
                  </>
                );
              })()}
            </h2>
          </div>
          <div className="flex lg:justify-end">
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-primary px-10 py-5 text-xl font-bold text-bg transition-transform hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Let&apos;s talk</span>
              <ArrowUp className="relative z-10 rotate-45 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" size={24} />
              <div className="absolute inset-0 z-0 bg-gradient-to-tr from-primary to-primary/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </Link>
          </div>
        </div>

        {/* Middle Section: Navigation & Info */}
        <div className="grid gap-12 border-t border-border/50 pt-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-bg">
                 <span className="font-display text-sm font-black uppercase">{settings.name?.[0]}</span>
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                {settings.name}
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-lg leading-relaxed text-muted">
              {settings.footerBio}
            </p>
            <div className="mt-8 flex items-center gap-2">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-all hover:bg-surface hover:text-primary hover:scale-110"
                  aria-label={label}
                >
                  <Icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Explore</p>
            <ul className="mt-8 space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-lg font-medium text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Contact</p>
            <div className="mt-8 space-y-2">
              <p className="text-sm text-muted">Email me at</p>
              <Link 
                href={`mailto:${settings.email}`} 
                className="block text-xl font-bold text-text underline decoration-primary/30 decoration-2 underline-offset-8 transition-all hover:decoration-primary"
              >
                {settings.email}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-border/50 pt-10 sm:flex-row">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} {settings.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted transition-colors hover:text-text"
            >
              Back to top <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
