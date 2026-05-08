"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import type { HackathonDTO } from "@/lib/types";

export function HackathonList({ items }: { items: HackathonDTO[] }) {
  const router = useRouter();

  async function remove(id: string) {
    if (window.confirm("Are you sure?")) {
      await fetch(`/api/hackathons/${id}`, { method: "DELETE" });
      router.refresh();
    }
  }

  return (
    <div className="overflow-hidden rounded-[8px] border border-border bg-surface">
      <table className="w-full text-sm">
        <thead className="border-b border-border text-left text-muted">
          <tr>
            <th className="p-4 font-medium">Title/Name</th>
            <th className="p-4 font-medium">Date</th>
            <th className="p-4 font-medium w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-border last:border-0 hover:bg-bg/50 transition-colors">
              <td className="p-4">
                <Link href={`/admin/hackathons/${item.id}`} className="font-bold text-primary hover:underline">
                  {item.title || item.name}
                </Link>
              </td>
              <td className="p-4">{formatDate(item.date)}</td>
              <td className="p-4">
                <Button size="icon" variant="ghost" onClick={() => void remove(item.id)}><Trash2 size={16} /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}