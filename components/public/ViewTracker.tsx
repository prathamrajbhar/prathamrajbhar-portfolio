"use client";

import { useEffect } from "react";

export function ViewTracker({ path }: { path: string }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `viewed:${path}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    }).catch(() => {
      // Silently fail — view tracking is non-critical
    });
  }, [path]);

  return null;
}
