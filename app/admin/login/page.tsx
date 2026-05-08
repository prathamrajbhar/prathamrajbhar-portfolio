"use client";

import { Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState(searchParams.get("error") ? "Invalid credentials." : "");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      redirect: false,
      callbackUrl: "/admin"
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid credentials.");
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-bg p-4 text-text mesh-gradient">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 mix-blend-screen blur-[128px]"></div>
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[25rem] w-[25rem] translate-x-1/3 translate-y-1/3 rounded-full bg-pink-500/10 mix-blend-screen blur-[128px]"></div>

      <Card className="z-10 w-full max-w-md border-white/10 p-8 shadow-2xl glass backdrop-blur-2xl transition-all duration-500 hover:shadow-primary/10">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-4 text-primary shadow-inner ring-1 ring-primary/20">
            <Lock size={28} className="drop-shadow-md" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-gradient">Admin Access</h1>
          <p className="mt-2 text-sm text-muted">Enter your credentials to manage the portfolio.</p>
        </div>

        <form onSubmit={submit} className="grid gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text">Email Address</label>
            <Input 
              name="email" 
              type="email" 
              placeholder="admin@example.com" 
              className="h-11 border-border/50 bg-bg/50 transition-all focus:bg-bg focus:ring-primary/30" 
              required 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text">Password</label>
            <Input 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              className="h-11 border-border/50 bg-bg/50 transition-all focus:bg-bg focus:ring-primary/30" 
              required 
            />
          </div>

          {error ? (
            <div className="animate-in fade-in slide-in-from-top-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500 backdrop-blur-md">
              {error}
            </div>
          ) : null}

          <Button 
            type="submit" 
            size="lg" 
            className="mt-2 w-full bg-gradient-to-r from-primary to-primary-hover shadow-lg transition-all hover:scale-[1.02] hover:shadow-primary/25 active:scale-[0.98] disabled:hover:scale-100" 
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign in to Dashboard"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
