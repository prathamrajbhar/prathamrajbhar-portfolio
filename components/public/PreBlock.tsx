"use client";

import { Check, Copy } from "lucide-react";
import { useState, useRef, type ComponentPropsWithoutRef } from "react";

export function PreBlock(props: ComponentPropsWithoutRef<"pre">) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const copy = async () => {
    if (preRef.current) {
      const text = preRef.current.textContent || "";
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={copy}
        className="absolute right-3 top-3 flex items-center justify-center rounded-lg bg-surface/50 p-2 text-muted opacity-0 backdrop-blur-sm transition-all hover:text-text group-hover:opacity-100 border border-border/50"
        aria-label="Copy code"
      >
        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
      </button>
      <pre ref={preRef} {...props} className="overflow-x-auto rounded-[8px] bg-bg/50 p-5 border border-border/50" />
    </div>
  );
}
