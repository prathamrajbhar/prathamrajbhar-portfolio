"use client";

import { motion } from "framer-motion";
import { ChevronDown, Download, FolderKanban } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { SiteSettingsDTO } from "@/lib/types";

const roles = ["Full-Stack Engineer", "Computer Engineer", "Product-minded Builder"];

export function HeroSection({ settings }: { settings: SiteSettingsDTO }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    const role = roles[roleIndex % roles.length];
    if (text.length < role.length) {
      const timeout = window.setTimeout(() => setText(role.slice(0, text.length + 1)), 70);
      return () => window.clearTimeout(timeout);
    }
    const timeout = window.setTimeout(() => {
      setText("");
      setRoleIndex((current) => current + 1);
    }, 2000);
    return () => window.clearTimeout(timeout);
  }, [roleIndex, text]);

  async function trackResume() {
    await fetch("/api/settings", { method: "PATCH" });
  }

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-20">
      {/* Background visual element */}
      <div className="mesh-gradient absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-bg)_70%)]" />
      
      {/* Abstract Shape */}
      <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute -bottom-20 -left-20 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[100px]" />

      <motion.div 
        className="relative z-10 w-full max-w-6xl"
        variants={staggerContainer} 
        initial="hidden" 
        animate="visible"
      >
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            {settings.openToWork ? (
              <motion.div variants={fadeInUp} className="mb-6">
                <Badge variant="success" className="px-3 py-1 text-sm font-medium tracking-wide">
                  Available for new opportunities
                </Badge>
              </motion.div>
            ) : null}
            
            <motion.h1 
              variants={fadeInUp} 
              className="font-display text-6xl font-extrabold leading-[1.1] tracking-tight sm:text-7xl lg:text-8xl"
            >
              Hi, I&apos;m <span className="text-primary">{settings.name}</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp} 
              className="mt-6 min-h-[1.5em] font-display text-2xl font-semibold text-muted sm:text-3xl lg:text-4xl"
            >
              I build <span className="text-gradient font-bold">{text}</span>
              <span className="ml-1 inline-block h-8 w-[3px] animate-pulse bg-primary align-middle lg:h-10" />
            </motion.p>
            
            <motion.p 
              variants={fadeInUp} 
              className="mt-8 max-w-xl text-lg leading-relaxed text-muted/90 sm:text-xl"
            >
              {settings.heroTagline || settings.bio}
            </motion.p>
            
            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
              <Button 
                href="#featured-projects" 
                size="lg" 
                className="group px-8"
                icon={<FolderKanban size={20} className="transition-transform group-hover:rotate-12" />}
              >
                View My Projects
              </Button>
              {settings.resumeUrl ? (
                <Button 
                  href={settings.resumeUrl} 
                  size="lg" 
                  variant="secondary" 
                  className="px-8"
                  icon={<Download size={20} />} 
                  onClick={trackResume}
                >
                  My Resume
                </Button>
              ) : null}
            </motion.div>
          </div>

          <motion.div 
            variants={fadeInUp}
            className="hidden lg:block"
          >
            <div className="glass relative aspect-square w-full max-w-[400px] overflow-hidden rounded-[2.5rem] p-4 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-6 rounded-full bg-primary/10 p-6">
                  <FolderKanban size={64} className="text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold">Innovation focused</h3>
                <p className="mt-2 text-muted px-6 text-sm">Turning complex ideas into elegant digital solutions with a focus on user experience.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted"
        >
          <span className="text-xs font-semibold uppercase tracking-widest">Scroll</span>
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
