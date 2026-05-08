"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import type { CertificationDTO } from "@/lib/types";

export function CertificationForm({ initialData }: { initialData?: CertificationDTO }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Partial<CertificationDTO>>(
    initialData || {
      name: "", issuer: "", date: new Date().toISOString(), url: "", credentialId: "", image: ""
    }
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const method = initialData ? "PUT" : "POST";
    const url = initialData ? `/api/certifications/${initialData.id}` : "/api/certifications";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    router.push("/admin/certifications");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-6">
      <div className="grid gap-4 rounded-[8px] border border-border bg-surface p-6">
        <h2 className="font-display text-xl font-bold">{initialData ? "Edit" : "New"} Certification</h2>
        
        <div className="grid gap-2">
          <Label>Name</Label>
          <Input value={data.name || ""} onChange={(e) => setData({ ...data, name: e.target.value })} required />
        </div>
        <div className="grid gap-2">
          <Label>Issuer</Label>
          <Input value={data.issuer || ""} onChange={(e) => setData({ ...data, issuer: e.target.value })} required />
        </div>
        <div className="grid gap-2">
          <Label>Date</Label>
          <Input type="date" value={data.date ? new Date(data.date).toISOString().split('T')[0] : ""} onChange={(e) => setData({ ...data, date: e.target.value })} required />
        </div>
        <div className="grid gap-2">
          <Label>URL</Label>
          <Input value={data.url || ""} onChange={(e) => setData({ ...data, url: e.target.value })}  />
        </div>
        <div className="grid gap-2">
          <Label>Credential ID</Label>
          <Input value={data.credentialId || ""} onChange={(e) => setData({ ...data, credentialId: e.target.value })}  />
        </div>
        <div className="grid gap-2">
          <Label>Image URL</Label>
          <Input value={data.image || ""} onChange={(e) => setData({ ...data, image: e.target.value })}  />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
      </div>
    </form>
  );
}