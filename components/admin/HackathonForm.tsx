"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import type { HackathonDTO } from "@/lib/types";

export function HackathonForm({ initialData }: { initialData?: HackathonDTO }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Partial<HackathonDTO>>(
    initialData || {
      title: "", project: "", role: "", date: new Date().toISOString(), location: "", result: "", link: "", description: "", image: ""
    }
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const method = initialData ? "PUT" : "POST";
    const url = initialData ? `/api/hackathons/${initialData.id}` : "/api/hackathons";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    router.push("/admin/hackathons");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-6">
      <div className="grid gap-4 rounded-[8px] border border-border bg-surface p-6">
        <h2 className="font-display text-xl font-bold">{initialData ? "Edit" : "New"} Hackathon</h2>
        
        <div className="grid gap-2">
          <Label>Title</Label>
          <Input value={data.title || ""} onChange={(e) => setData({ ...data, title: e.target.value })} required />
        </div>
        <div className="grid gap-2">
          <Label>Project Name</Label>
          <Input value={data.project || ""} onChange={(e) => setData({ ...data, project: e.target.value })} required />
        </div>
        <div className="grid gap-2">
          <Label>Role</Label>
          <Input value={data.role || ""} onChange={(e) => setData({ ...data, role: e.target.value })}  />
        </div>
        <div className="grid gap-2">
          <Label>Date</Label>
          <Input type="date" value={data.date ? new Date(data.date).toISOString().split('T')[0] : ""} onChange={(e) => setData({ ...data, date: e.target.value })} required />
        </div>
        <div className="grid gap-2">
          <Label>Location</Label>
          <Input value={data.location || ""} onChange={(e) => setData({ ...data, location: e.target.value })}  />
        </div>
        <div className="grid gap-2">
          <Label>Result (e.g., Winner)</Label>
          <Input value={data.result || ""} onChange={(e) => setData({ ...data, result: e.target.value })}  />
        </div>
        <div className="grid gap-2">
          <Label>Link</Label>
          <Input value={data.link || ""} onChange={(e) => setData({ ...data, link: e.target.value })}  />
        </div>
        <div className="grid gap-2">
          <Label>Image URL</Label>
          <Input value={data.image || ""} onChange={(e) => setData({ ...data, image: e.target.value })}  />
        </div>
        <div className="grid gap-2">
          <Label>Description</Label>
          <Textarea value={data.description || ""} onChange={(e) => setData({ ...data, description: e.target.value })} />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
      </div>
    </form>
  );
}