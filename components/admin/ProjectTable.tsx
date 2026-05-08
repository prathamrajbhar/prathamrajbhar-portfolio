"use client";

import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { ProjectDTO } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ProjectTable({ projects }: { projects: ProjectDTO[] }) {
  const router = useRouter();
  const [target, setTarget] = useState<ProjectDTO | null>(null);

  async function remove() {
    if (!target) return;
    await fetch(`/api/projects/${target.id}`, { method: "DELETE" });
    setTarget(null);
    router.refresh();
  }

  const columns: Column<ProjectDTO>[] = [
    {
      key: "image",
      header: "Image",
      render: (project) => (
        <div className="relative h-12 w-16 overflow-hidden rounded-[6px] bg-bg">
          <Image src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=200&fit=crop"} alt={project.title} fill className="object-cover" sizes="64px" />
        </div>
      )
    },
    { key: "title", header: "Title", render: (project) => project.title, sortable: true, sortValue: (project) => project.title },
    { key: "category", header: "Category", render: (project) => <span className="text-muted">{project.category ?? "Uncategorized"}</span> },
    { key: "status", header: "Status", render: (project) => <Badge variant={project.status === "completed" ? "success" : "warning"}>{project.status}</Badge> },
    { key: "featured", header: "Featured", render: (project) => <Badge variant={project.featured ? "default" : "muted"}>{project.featured ? "Yes" : "No"}</Badge> },
    { key: "tags", header: "Tags", render: (project) => <span className="text-muted">{project.tags.map((tag) => tag.name).join(", ")}</span> },
    { key: "date", header: "Date", sortable: true, sortValue: (project) => project.createdAt, render: (project) => formatDate(project.createdAt) },
    {
      key: "actions",
      header: "Actions",
      render: (project) => (
        <div className="flex gap-2">
          <Button href={`/admin/projects/${project.id}/edit`} size="icon" variant="ghost" aria-label="Edit project"><Pencil size={16} /></Button>
          <Button size="icon" variant="ghost" onClick={() => setTarget(project)} aria-label="Delete project"><Trash2 size={16} /></Button>
        </div>
      )
    }
  ];

  return (
    <>
      <DataTable rows={projects} columns={columns} />
      <Modal open={Boolean(target)} title="Delete project" onClose={() => setTarget(null)}>
        <p className="text-sm text-muted">This permanently deletes {target?.title}.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={remove}>Delete</Button>
        </div>
      </Modal>
    </>
  );
}
