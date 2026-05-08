"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { MdxEditor } from "@/components/admin/MdxEditor";
import { TagInput } from "@/components/admin/TagInput";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { BlogPostDTO } from "@/lib/types";
import { readingTimeFromContent, slugify } from "@/lib/utils";

type BlogState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentFormat: "mdx" | "html";
  coverImage: string;
  published: boolean;
  readingTime: number;
  tags: string[];
};

export function BlogForm({ post }: { post?: BlogPostDTO }) {
  const router = useRouter();
  const [state, setState] = useState<BlogState>({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "# New post\n\nStart writing in MDX here.",
    contentFormat: post?.contentFormat ?? "mdx",
    coverImage: post?.coverImage ?? "",
    published: post?.published ?? false,
    readingTime: post?.readingTime ?? 1,
    tags: post?.tags.map((tag) => tag.name) ?? []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function setContent(content: string) {
    setState((current) => ({ ...current, content, readingTime: readingTimeFromContent(content) }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch(post ? `/api/blog/${post.id}` : "/api/blog", {
      method: post ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state)
    });
    setLoading(false);
    if (response.ok) {
      router.push("/admin/blog");
      router.refresh();
    } else {
      const json = (await response.json()) as { error?: string };
      setError(json.error ?? "Unable to save post.");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      {error ? <p className="rounded-[6px] bg-red-500/10 p-3 text-sm text-red-500">{error}</p> : null}
      <Card className="grid gap-4 p-5">
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="title">Title</label>
          <Input id="title" value={state.title} onChange={(event) => setState((current) => ({ ...current, title: event.target.value, slug: current.slug || slugify(event.target.value) }))} required />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="slug">Slug</label>
          <Input id="slug" value={state.slug} onChange={(event) => setState((current) => ({ ...current, slug: slugify(event.target.value) }))} required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor="excerpt">Excerpt</label>
            <span className="text-xs text-muted">{state.excerpt.length}/200</span>
          </div>
          <Textarea id="excerpt" value={state.excerpt} maxLength={200} onChange={(event) => setState((current) => ({ ...current, excerpt: event.target.value }))} required />
        </div>
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-sm font-medium">MDX Content</label>
            <span className="text-xs text-muted">Use Markdown, tables, images, code, and JSX-style MDX.</span>
          </div>
          <MdxEditor value={state.content} onChange={setContent} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Cover Image</label>
          <Input value={state.coverImage} onChange={(event) => setState((current) => ({ ...current, coverImage: event.target.value }))} placeholder="Cover image URL" />
          <ImageUpload onUploaded={(coverImage) => setState((current) => ({ ...current, coverImage }))} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Tags</label>
          <TagInput values={state.tags} onChange={(tags) => setState((current) => ({ ...current, tags }))} placeholder="Add a tag" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input type="number" min={1} value={state.readingTime} onChange={(event) => setState((current) => ({ ...current, readingTime: Number(event.target.value) }))} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={state.published} onChange={(event) => setState((current) => ({ ...current, published: event.target.checked }))} /> Published</label>
        </div>
      </Card>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading} icon={<Save size={18} />}>{loading ? "Saving..." : "Save Post"}</Button>
        <Button type="button" variant="secondary" onClick={() => setState((current) => ({ ...current, published: false }))}>Save Draft</Button>
        <Button type="button" variant="secondary" onClick={() => setState((current) => ({ ...current, published: true }))}>Publish</Button>
      </div>
    </form>
  );
}
