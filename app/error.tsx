"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 text-red-500 mb-8">
        <AlertCircle size={40} />
      </div>
      <h1 className="font-display text-4xl font-bold tracking-tight mb-4">Something went wrong!</h1>
      <p className="max-w-md text-lg text-muted mb-10">
        An unexpected error occurred. We have been notified and are looking into it.
      </p>
      <div className="flex items-center gap-4">
        <Button onClick={() => reset()} icon={<RotateCcw size={18} />} size="lg">
          Try again
        </Button>
        <Button href="/" variant="secondary" size="lg">
          Go Home
        </Button>
      </div>
    </div>
  );
}
