"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Sparkles, X, Loader2, Send, Bot, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { normalize } from "@/lib/ai-autofill";

type SupportedModule =
  | "experience"
  | "projects"
  | "blog"
  | "certifications"
  | "hackathons"
  | "education"
  | "skills"
  | "services";

interface AIAssistantProps<T> {
  module: SupportedModule;
  onFill: (data: Partial<T>) => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  parts: { type: string; text?: string; toolInvocation?: unknown }[];
}

function extractFillFormData(parts: unknown[]): unknown | null {
  for (const part of parts) {
    if (!part || typeof (part as Record<string, unknown>).type !== "string") continue;
    const p = part as Record<string, unknown>;
    if (p.type === "tool-invocation") {
      const inv = p.toolInvocation as Record<string, unknown> | undefined;
      if (inv?.toolName === "fill_form") {
        if (inv.result && typeof inv.result === "object") {
          const result = inv.result as Record<string, unknown>;
          return result.data ?? inv.result;
        }
        if (inv.args && typeof inv.args === "object") {
          return inv.args;
        }
      }
    }
    if ((p.type as string).startsWith("tool-")) {
      return p.result ?? p.args ?? p.input;
    }
  }
  return null;
}

export function AIAssistant<T>({ module, onFill }: AIAssistantProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const onFillRef = useRef(onFill);

  useEffect(() => {
    onFillRef.current = onFill;
  }, [onFill]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!text || isLoading) return;
      setInput("");
      setError(false);

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        parts: [{ type: "text", text }],
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const res = await fetch("/api/admin/ai-autofill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            module,
            messages: [
              ...messages.map((m) => ({ role: m.role, content: m.parts.map((p) => p.text).join("\n"), parts: m.parts })),
              { role: "user", content: text, parts: userMsg.parts },
            ],
          }),
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = (await res.json()) as Message;
        setMessages((prev) => [...prev, data]);

        if (data.role === "assistant" && Array.isArray(data.parts)) {
          const extracted = extractFillFormData(data.parts);
          if (extracted) {
            onFillRef.current(normalize(module, extracted) as Partial<T>);
          }
        }
      } catch (err) {
        console.error("AI Assistant error:", err);
        setError(true);
        setInput(text);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, module],
  );

  const filled = useMemo(() => {
    const last = messages[messages.length - 1];
    if (!last || !Array.isArray(last.parts)) return false;
    return extractFillFormData(last.parts) !== null;
  }, [messages]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSend(input.trim());
    },
    [input, handleSend],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend(input.trim());
      }
    },
    [input, handleSend],
  );

  return (
    <div className="mb-8">
      {!isOpen ? (
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="w-full h-14 rounded-2xl border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition-all group shadow-sm flex items-center justify-center gap-2"
        >
          <Sparkles className="h-5 w-5 group-hover:scale-110 transition-transform" />
          <span className="font-semibold tracking-wide">
            Auto-fill with AI Assistant
          </span>
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          className="rounded-2xl border border-primary/20 bg-surface/50 backdrop-blur-md overflow-hidden shadow-xl shadow-primary/5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-primary/10 bg-primary/5 px-6 py-4">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles size={18} />
              <h3 className="font-bold uppercase tracking-widest text-xs">
                AI Auto-fill
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-muted hover:text-text transition-colors p-1"
              aria-label="Close AI Assistant"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <p className="text-sm text-muted">
              Paste your raw notes, resume snippets, or describe the{" "}
              <span className="font-medium text-text capitalize">{module}</span>{" "}
              entry, and I&apos;ll fill out the form for you.
            </p>

            {/* Message Thread */}
            <AnimatePresence>
              {messages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-h-[300px] overflow-y-auto space-y-4 pr-1"
                >
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "flex gap-3",
                        m.role === "user" ? "justify-end" : "justify-start",
                      )}
                    >
                      {m.role === "assistant" && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Bot size={16} />
                        </div>
                      )}
                      <div
                        className={cn(
                          "px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed",
                          m.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-bg/80 border border-border/50 rounded-tl-sm text-text",
                        )}
                      >
                        {/* Render text parts — UIMessage in AI SDK v6 always has parts */}
                        {m.parts.map((part: unknown, i) => {
                          const p = part as Record<string, unknown>;
                          if (p.type === "text" && p.text) {
                            return <div key={i}>{String(p.text)}</div>;
                          }
                          // Show a success indicator for any tool call part
                          if (
                            p.type === "tool-invocation" ||
                            (typeof p.type === "string" &&
                              p.type.startsWith("tool-"))
                          ) {
                            return (
                              <div
                                key={i}
                                className="mt-2 text-xs flex items-center gap-1.5 text-emerald-500"
                              >
                                <CheckCircle2 size={12} />
                                Form fields populated!
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  ))}

                  {error && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                        <AlertCircle size={16} />
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-bg/80 border border-red-500/20 rounded-tl-sm text-text">
                        <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
                      </div>
                    </div>
                  )}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Bot size={16} />
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-bg/80 border border-border/50 rounded-tl-sm text-text flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-muted">Thinking…</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success banner */}
            <AnimatePresence>
              {filled && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-500"
                >
                  <CheckCircle2 size={16} />
                  Form auto-filled! Review and submit when ready.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="relative flex items-end gap-2"
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`e.g. Worked at Vercel as a SWE from Jan 2023 to present…`}
                className="min-h-[80px] w-full resize-none rounded-xl pr-14 focus:ring-primary/20 text-sm"
                disabled={isLoading}
              />
              <div className="absolute bottom-2 right-2">
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="h-10 w-10 rounded-lg shadow-md transition-all disabled:opacity-50"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
}
