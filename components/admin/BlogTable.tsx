"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { BlogPostDTO } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function BlogTable({ posts }: { posts: BlogPostDTO[] }) {
  const router = useRouter();
  const [target, setTarget] = useState<BlogPostDTO | null>(null);

  async function toggle(post: BlogPostDTO) {
    await fetch(`/api/blog/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...post,
        published: !post.published,
        tags: post.tags.map((tag) => tag.name),
        coverImage: post.coverImage ?? "",
        contentFormat: post.contentFormat ?? "mdx"
      })
    });
    router.refresh();
  }

  async function remove() {
    if (!target) return;
    await fetch(`/api/blog/${target.id}`, { method: "DELETE" });
    setTarget(null);
    router.refresh();
  }

  const columns: Column<BlogPostDTO>[] = [
    { key: "title", header: "Title", render: (post) => post.title, sortable: true, sortValue: (post) => post.title },
    { key: "published", header: "Published", render: (post) => <button onClick={() => void toggle(post)}><Badge variant={post.published ? "success" : "muted"}>{post.published ? "Published" : "Draft"}</Badge></button> },
    { key: "format", header: "Format", render: (post) => <Badge variant="muted">{post.contentFormat ?? "mdx"}</Badge> },
    { key: "reading", header: "Reading", render: (post) => `${post.readingTime} min` },
    { key: "date", header: "Date", sortable: true, sortValue: (post) => post.createdAt, render: (post) => formatDate(post.createdAt) },
    {
      key: "actions",
      header: "Actions",
      render: (post) => (
        <div className="flex gap-2">
          <Button href={`/admin/blog/${post.id}/edit`} size="icon" variant="ghost" aria-label="Edit post"><Pencil size={16} /></Button>
          <Button size="icon" variant="ghost" onClick={() => setTarget(post)} aria-label="Delete post"><Trash2 size={16} /></Button>
        </div>
      )
    }
  ];

  return (
    <>
      <DataTable rows={posts} columns={columns} />
      <Modal open={Boolean(target)} title="Delete post" onClose={() => setTarget(null)}>
        <p className="text-sm text-muted">This permanently deletes {target?.title}.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={remove}>Delete</Button>
        </div>
      </Modal>
    </>
  );
}
