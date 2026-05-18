"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeColorPicker } from "@/components/public/ThemeColorPicker";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" }
];

export function Navbar({ name, openToWork }: { name: string; openToWork?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "dark";
    const rootTheme = document.documentElement.dataset.theme;
    if (rootTheme === "light" || rootTheme === "dark") return rootTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;
    setTheme(next);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 pointer-events-none">
      <nav
        className={cn(
          "pointer-events-auto relative flex items-center justify-between gap-8 rounded-full border border-border/40 bg-surface/60 px-4 py-2 shadow-2xl backdrop-blur-2xl transition-all duration-500",
          scrolled ? "max-w-[95%] lg:max-w-4xl" : "max-w-[98%] lg:max-w-5xl"
        )}
      >
        {/* Glass Shine Effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        <Link href="/" className="group flex items-center gap-3 pl-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-bg shadow-lg shadow-primary/20 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
             <span className="font-display text-sm font-black uppercase">{name[0]}</span>
          </div>
          <span className="hidden font-display text-lg font-bold tracking-tight text-text sm:block">
            {name.split(" ")[0]}
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300",
                  isActive ? "text-bg" : "text-muted hover:text-text"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 z-[-1] rounded-full bg-primary shadow-lg shadow-primary/20"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 pr-1">
          <div className="flex items-center rounded-full bg-bg/40 p-1 border border-border/20">
            <ThemeColorPicker />
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-all duration-300 hover:bg-surface hover:text-text"
              aria-label="Toggle color theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 30, scale: 0.5 }}
                  transition={{ duration: 0.3, ease: "backOut" }}
                >
                  {theme === "dark" ? <Sun size={14} strokeWidth={2.5} /> : <Moon size={14} strokeWidth={2.5} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 hover:bg-primary hover:text-bg md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={2.5} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-bg/95 p-8 backdrop-blur-2xl pointer-events-auto md:hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                   <span className="font-display text-sm font-black uppercase">{name[0]}</span>
                </div>
                <span className="font-display text-2xl tracking-tight">{name}</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border/50 text-muted transition-all hover:bg-surface hover:text-text"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mt-20 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center justify-between rounded-2xl px-6 py-5 text-2xl font-bold tracking-tight transition-all",
                      pathname === link.href
                        ? "bg-primary text-bg shadow-2xl shadow-primary/20"
                        : "text-muted hover:bg-surface hover:text-text"
                    )}
                  >
                    {link.label}
                    <ArrowRight 
                      size={24} 
                      className={cn(
                        "transition-transform duration-300 group-hover:translate-x-1",
                        pathname === link.href ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )} 
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-6 rounded-3xl bg-surface/50 p-8 border border-border/50">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-primary/60">Status</p>
                <p className="mt-1 text-lg font-medium">{openToWork ? "Available for work" : "Not looking for work"}</p>
              </div>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-5 text-lg font-bold text-bg transition-transform active:scale-95"
              >
                Contact Me <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
