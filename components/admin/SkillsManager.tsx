"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { SkillDTO } from "@/lib/types";

const categories = ["Languages", "Frameworks", "Tools", "Cloud", "Other"];

type Draft = {
  name: string;
  category: string;
  order: number;
  iconUrl: string;
};

export function SkillsManager({ skills }: { skills: SkillDTO[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>({ name: "", category: "Languages", order: 0, iconUrl: "" });
  const [editing, setEditing] = useState<Record<string, Draft>>(
    Object.fromEntries(skills.map((skill) => [skill.id, { name: skill.name, category: skill.category, order: skill.order, iconUrl: skill.iconUrl ?? "" }]))
  );

  async function save(id: string) {
    await fetch(`/api/skills/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing[id])
    });
    router.refresh();
  }

  async function add() {
    await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });
    setDraft({ name: "", category: "Languages", order: 0, iconUrl: "" });
    router.refresh();
  }

  async function remove(id: string) {
    if (window.confirm("Delete this skill?")) {
      await fetch(`/api/skills/${id}`, { method: "DELETE" });
      router.refresh();
    }
  }

  return (
    <div className="overflow-hidden rounded-[8px] border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-border text-left text-muted">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Icon URL</th>
              <th className="p-3 w-24">Order</th>
              <th className="p-3 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => {
              const value = editing[skill.id];
              return (
                <tr key={skill.id} className="border-b border-border">
                  <td className="p-3"><Input value={value.name} onChange={(event) => setEditing((current) => ({ ...current, [skill.id]: { ...value, name: event.target.value } }))} /></td>
                  <td className="p-3">
                    <select className="h-10 w-full rounded-[6px] border border-border bg-bg px-3" value={value.category} onChange={(event) => setEditing((current) => ({ ...current, [skill.id]: { ...value, category: event.target.value } }))}>
                      {categories.map((category) => <option key={category}>{category}</option>)}
                    </select>
                  </td>
                  <td className="p-3"><Input placeholder="Logo URL" value={value.iconUrl} onChange={(event) => setEditing((current) => ({ ...current, [skill.id]: { ...value, iconUrl: event.target.value } }))} /></td>
                  <td className="p-3"><Input type="number" value={value.order} onChange={(event) => setEditing((current) => ({ ...current, [skill.id]: { ...value, order: Number(event.target.value) } }))} /></td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => void save(skill.id)}>Save</Button>
                      <Button size="icon" variant="ghost" onClick={() => void remove(skill.id)} aria-label="Delete skill"><Trash2 size={16} /></Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr className="bg-primary/5">
              <td className="p-3"><Input placeholder="New skill" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} /></td>
              <td className="p-3">
                <select className="h-10 w-full rounded-[6px] border border-border bg-bg px-3" value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}>
                  {categories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </td>
              <td className="p-3"><Input placeholder="Logo URL" value={draft.iconUrl} onChange={(event) => setDraft((current) => ({ ...current, iconUrl: event.target.value }))} /></td>
              <td className="p-3"><Input type="number" value={draft.order} onChange={(event) => setDraft((current) => ({ ...current, order: Number(event.target.value) }))} /></td>
              <td className="p-3"><Button className="w-full" onClick={() => void add()}>Add</Button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
