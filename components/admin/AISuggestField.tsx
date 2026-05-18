"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Sparkles, X, Loader2, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface AISuggestFieldProps {
  label: string;
  module: string;
  field: string;
  context?: Record<string, unknown>;
  onApply: (value: string) => void;
  className?: string;
}

export function AISuggestField({
  label,
  module,
  field,
  context,
  onApply,
  className,
}: AISuggestFieldProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const panelWidth = 384; // w-96
    const margin = 16;
    let left = rect.left + rect.width / 2 - panelWidth / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - panelWidth - margin));
    const top = rect.bottom + 8;
    setPopupStyle({ left, top, position: "fixed", width: panelWidth, zIndex: 9999 });
  }, [open]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setSuggestions([]);

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch("/api/admin/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module, field, prompt: prompt.trim(), context }),
        signal: ctrl.signal,
      });

      const json = (await res.json()) as {
        success?: boolean;
        suggestions?: string[];
        error?: string;
      };

      if (!res.ok || !json.success) {
        setError(json.error || "Failed to get suggestions");
        return;
      }

      setSuggestions(json.suggestions ?? []);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [module, field, prompt, context]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleGenerate();
      }
    },
    [handleGenerate]
  );

  const popup = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          style={popupStyle}
          className="rounded-2xl border border-primary/20 bg-surface/95 p-5 shadow-2xl shadow-primary/10 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-primary">
              <Wand2 size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                AI Suggest — {label}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-muted hover:text-text transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Describe what you want for ${label.toLowerCase()}...`}
            className="min-h-[72px] resize-none rounded-xl text-sm"
            disabled={loading}
          />

          <div className="mt-3 flex justify-end">
            <Button
              type="button"
              size="sm"
              disabled={loading || !prompt.trim()}
              onClick={handleGenerate}
              className="rounded-xl text-xs font-bold"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin mr-1.5" />
              ) : (
                <Sparkles size={14} className="mr-1.5" />
              )}
              Generate
            </Button>
          </div>

          {error && (
            <p className="mt-3 text-[11px] font-bold text-red-500">{error}</p>
          )}

          {suggestions.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted">
                Suggestions
              </p>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onApply(s);
                    setOpen(false);
                    setSuggestions([]);
                    setPrompt("");
                  }}
                  className="w-full rounded-xl border border-border/50 bg-bg/50 p-3 text-left text-sm text-text transition-all hover:border-primary/30 hover:bg-primary/5"
                >
                  <span className="line-clamp-3">{s}</span>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={cn("relative inline-flex", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary transition-all hover:bg-primary/10 hover:scale-105 active:scale-95"
      >
        <Sparkles size={10} />
        AI
      </button>

      {mounted && typeof document !== "undefined" && createPortal(popup, document.body)}
    </div>
  );
}
