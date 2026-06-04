"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Palette } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const colorThemes = [
  { name: "Amber", light: "#b45309", dark: "#fbbf24" },
  { name: "Blue", light: "#2563eb", dark: "#3b82f6" },
  { name: "Purple", light: "#7c3aed", dark: "#8b5cf6" },
  { name: "Green", light: "#059669", dark: "#10b981" },
  { name: "Red", light: "#dc2626", dark: "#ef4444" },
  { name: "Pink", light: "#db2777", dark: "#ec4899" },
  { name: "Orange", light: "#ea580c", dark: "#f97316" },
  { name: "Teal", light: "#0d9488", dark: "#14b8a6" },
];

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function applyColorTheme(themeName: string, isDark: boolean) {
  const theme = colorThemes.find((t) => t.name === themeName);
  if (!theme) return;
  const color = isDark ? theme.dark : theme.light;
  document.documentElement.style.setProperty("--color-primary-val", color);
  document.documentElement.style.setProperty("--color-primary-hover-val", adjustColor(color, -20));
}

/** Read saved color theme from localStorage (client-only, returns safe default). */
function getStoredTheme(): string {
  if (typeof window === "undefined") return "Amber";
  return localStorage.getItem("colorTheme") || "Amber";
}

/** Read current dark mode from the document (client-only, returns safe default). */
function getIsDark(): boolean {
  if (typeof window === "undefined") return false;
  return document.documentElement.dataset.theme === "dark";
}

export function ThemeColorPicker() {
  const [open, setOpen] = useState(false);
  // Lazy initializers run only on the client (after hydration)
  const [selectedTheme, setSelectedTheme] = useState<string>(getStoredTheme);
  const [isDark, setIsDark] = useState<boolean>(getIsDark);
  const initialized = useRef(false);

  // Apply the initial color theme once on mount (external side-effect only, no setState)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    applyColorTheme(selectedTheme, isDark);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-apply whenever selectedTheme or isDark changes (after user interaction)
  useEffect(() => {
    if (!initialized.current) return;
    applyColorTheme(selectedTheme, isDark);
  }, [selectedTheme, isDark]);

  // Subscribe to dark/light mode mutations from the theme toggle
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.dataset.theme === "dark");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  function handleColorSelect(themeName: string) {
    setSelectedTheme(themeName);
    localStorage.setItem("colorTheme", themeName);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-border/50 hover:text-text"
        aria-label="Change color theme"
      >
        <Palette size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-border bg-surface p-3 shadow-lg"
          >
            <p className="mb-3 px-2 text-xs font-medium text-muted">Color Theme</p>
            <div className="grid grid-cols-4 gap-2">
              {colorThemes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => handleColorSelect(theme.name)}
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110",
                    selectedTheme === theme.name &&
                      "ring-2 ring-offset-2 ring-offset-surface ring-primary"
                  )}
                  style={{
                    backgroundColor: isDark ? theme.dark : theme.light,
                  }}
                  title={theme.name}
                >
                  {selectedTheme === theme.name && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-2 w-2 rounded-full bg-white"
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
