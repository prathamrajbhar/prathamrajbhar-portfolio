"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";

type State = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setError("");
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.error || "Something went wrong. Please try again.";
        throw new Error(message);
      }

      event.currentTarget.reset();
      setState("success");
      setTimeout(() => setState("idle"), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("error");
      setTimeout(() => setState("idle"), 5000);
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass group relative grid gap-6 overflow-hidden rounded-[3rem] p-8 md:p-12 shadow-2xl">
      <div className="grid gap-2">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-muted/60" htmlFor="name">Full Name</label>
        <Input 
          id="name" 
          name="name" 
          required 
          minLength={2} 
          placeholder="John Doe"
          className="h-14 rounded-2xl border-border/50 bg-surface/50 px-6 font-bold placeholder:text-muted/30 focus:border-primary focus:bg-surface dark:bg-surface/10 dark:focus:bg-surface/20"
        />
      </div>
      
      <div className="grid gap-2">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-muted/60" htmlFor="email">Email Address</label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          required 
          placeholder="john@example.com"
          className="h-14 rounded-2xl border-border/50 bg-surface/50 px-6 font-bold placeholder:text-muted/30 focus:border-primary focus:bg-surface dark:bg-surface/10 dark:focus:bg-surface/20"
        />
      </div>
      
      <div className="grid gap-2">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-muted/60" htmlFor="subject">Subject</label>
        <Input 
          id="subject" 
          name="subject" 
          required 
          minLength={3} 
          placeholder="Project Collaboration"
          className="h-14 rounded-2xl border-border/50 bg-surface/50 px-6 font-bold placeholder:text-muted/30 focus:border-primary focus:bg-surface dark:bg-surface/10 dark:focus:bg-surface/20"
        />
      </div>
      
      <div className="grid gap-2">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-muted/60" htmlFor="message">Message</label>
        <Textarea 
          id="message" 
          name="message" 
          required 
          minLength={10} 
          placeholder="Tell me about your project..."
          className="min-h-[150px] rounded-2xl border-border/50 bg-surface/50 p-6 font-bold placeholder:text-muted/30 focus:border-primary focus:bg-surface dark:bg-surface/10 dark:focus:bg-surface/20"
        />
      </div>

      <AnimatePresence mode="wait">
        {state === "success" && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 p-4 text-sm font-bold text-emerald-500"
          >
            <CheckCircle2 size={18} />
            Message sent! I&apos;ll get back to you soon.
          </motion.div>
        )}
        
        {state === "error" && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 rounded-2xl bg-red-500/10 p-4 text-sm font-bold text-red-500"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <Button 
        type="submit" 
        disabled={state === "loading"} 
        size="xl" 
        className="mt-4 rounded-2xl py-8 text-lg font-black tracking-tight"
        icon={<Send size={20} className={cn("transition-transform", state === "loading" && "animate-pulse")} />}
      >
        {state === "loading" ? "Transmitting..." : "Send Message"}
      </Button>
    </form>
  );
}
