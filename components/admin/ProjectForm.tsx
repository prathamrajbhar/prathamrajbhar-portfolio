"use client";

import { Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { TagInput } from "@/components/admin/TagInput";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { ProjectDTO, ProjectLinkDTO } from "@/lib/types";
import { slugify } from "@/lib/utils";

type ProjectState = {
  title: string;
  slug: string;
  description: string;
  content: string;
  subtitle: string;
  role: string;
  client: string;
  category: string;
  timeline: string;
  year: string;
  problem: string;
  solution: string;
  impact: string;
  features: string[];
  outcomes: string[];
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  imageUrl: string;
  galleryImages: string[];
  projectLinks: ProjectLinkDTO[];
  featured: boolean;
  status: "completed" | "in-progress" | "archived";
  tags: string[];
};

export function ProjectForm({ project }: { project?: ProjectDTO }) {
  const router = useRouter();
  const [state, setState] = useState<ProjectState>({
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    description: project?.description ?? "",
    content: project?.content ?? "<p></p>",
    subtitle: project?.subtitle ?? "",
    role: project?.role ?? "",
    client: project?.client ?? "",
    category: project?.category ?? "",
    timeline: project?.timeline ?? "",
    year: project?.year ?? "",
    problem: project?.problem ?? "",
    solution: project?.solution ?? "",
    impact: project?.impact ?? "",
    features: project?.features ?? [],
    outcomes: project?.outcomes ?? [],
    techStack: project?.techStack ?? [],
    liveUrl: project?.liveUrl ?? "",
    githubUrl: project?.githubUrl ?? "",
    imageUrl: project?.imageUrl ?? "",
    galleryImages: project?.galleryImages ?? [],
    projectLinks: project?.projectLinks ?? [],
    featured: project?.featured ?? false,
    status: (project?.status as ProjectState["status"]) ?? "completed",
    tags: project?.tags.map((tag) => tag.name) ?? []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function setLink(index: number, field: keyof ProjectLinkDTO, value: string) {
    setState((current) => ({
      ...current,
      projectLinks: current.projectLinks.map((link, linkIndex) => (linkIndex === index ? { ...link, [field]: value } : link))
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const payload: ProjectState = {
      ...state,
      features: state.features.filter(Boolean),
      outcomes: state.outcomes.filter(Boolean),
      galleryImages: state.galleryImages.filter(Boolean),
      projectLinks: state.projectLinks.filter((link) => link.label && link.url)
    };
    const response = await fetch(project ? `/api/projects/${project.id}` : "/api/projects", {
      method: project ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setLoading(false);
    if (response.ok) {
      router.push("/admin/projects");
      router.refresh();
    } else {
      const json = (await response.json()) as { error?: string };
      setError(json.error ?? "Unable to save project.");
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
          <label className="text-sm font-medium" htmlFor="description">Description</label>
          <Textarea id="description" value={state.description} onChange={(event) => setState((current) => ({ ...current, description: event.target.value }))} required />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="subtitle">Subtitle</label>
          <Input id="subtitle" value={state.subtitle} onChange={(event) => setState((current) => ({ ...current, subtitle: event.target.value }))} placeholder="Short one-line context for the hero" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Input placeholder="Role" value={state.role} onChange={(event) => setState((current) => ({ ...current, role: event.target.value }))} />
          <Input placeholder="Client / Team" value={state.client} onChange={(event) => setState((current) => ({ ...current, client: event.target.value }))} />
          <Input placeholder="Category" value={state.category} onChange={(event) => setState((current) => ({ ...current, category: event.target.value }))} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Timeline" value={state.timeline} onChange={(event) => setState((current) => ({ ...current, timeline: event.target.value }))} />
          <Input placeholder="Year" value={state.year} onChange={(event) => setState((current) => ({ ...current, year: event.target.value }))} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="problem">Problem</label>
            <Textarea id="problem" value={state.problem} onChange={(event) => setState((current) => ({ ...current, problem: event.target.value }))} placeholder="What was broken, slow, or missing?" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="solution">Solution</label>
            <Textarea id="solution" value={state.solution} onChange={(event) => setState((current) => ({ ...current, solution: event.target.value }))} placeholder="What did you build?" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="impact">Impact</label>
            <Textarea id="impact" value={state.impact} onChange={(event) => setState((current) => ({ ...current, impact: event.target.value }))} placeholder="What changed after shipping?" />
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Content</label>
          <RichTextEditor value={state.content} onChange={(content) => setState((current) => ({ ...current, content }))} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Key Features</label>
          <TagInput values={state.features} onChange={(features) => setState((current) => ({ ...current, features }))} placeholder="Add a feature" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Outcomes</label>
          <TagInput values={state.outcomes} onChange={(outcomes) => setState((current) => ({ ...current, outcomes }))} placeholder="Add an outcome or metric" />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Tech Stack</label>
          <TagInput values={state.techStack} onChange={(techStack) => setState((current) => ({ ...current, techStack }))} placeholder="Type and press Enter" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Live URL" value={state.liveUrl} onChange={(event) => setState((current) => ({ ...current, liveUrl: event.target.value }))} />
          <Input placeholder="GitHub URL" value={state.githubUrl} onChange={(event) => setState((current) => ({ ...current, githubUrl: event.target.value }))} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Image</label>
          <Input value={state.imageUrl} onChange={(event) => setState((current) => ({ ...current, imageUrl: event.target.value }))} placeholder="Image URL" />
          <ImageUpload onUploaded={(imageUrl) => setState((current) => ({ ...current, imageUrl }))} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Gallery Images</label>
          <TagInput values={state.galleryImages} onChange={(galleryImages) => setState((current) => ({ ...current, galleryImages }))} placeholder="Add image URL" />
          <ImageUpload onUploaded={(imageUrl) => setState((current) => ({ ...current, galleryImages: [...current.galleryImages, imageUrl] }))} />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium">Project Links</label>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              icon={<Plus size={16} />}
              onClick={() => setState((current) => ({ ...current, projectLinks: [...current.projectLinks, { label: "", url: "" }] }))}
            >
              Add Link
            </Button>
          </div>
          {state.projectLinks.length === 0 ? <p className="text-sm text-muted">Add docs, case study, demo video, app store, or any other project link.</p> : null}
          {state.projectLinks.map((link, index) => (
            <div key={index} className="grid gap-2 rounded-[8px] border border-border bg-bg p-3 md:grid-cols-[1fr_2fr_auto]">
              <Input placeholder="Label" value={link.label} onChange={(event) => setLink(index, "label", event.target.value)} />
              <Input placeholder="https://..." value={link.url} onChange={(event) => setLink(index, "url", event.target.value)} />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Remove link"
                onClick={() => setState((current) => ({ ...current, projectLinks: current.projectLinks.filter((_, linkIndex) => linkIndex !== index) }))}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Tags</label>
          <TagInput values={state.tags} onChange={(tags) => setState((current) => ({ ...current, tags }))} placeholder="Add a tag" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={state.featured} onChange={(event) => setState((current) => ({ ...current, featured: event.target.checked }))} /> Featured</label>
          <select className="h-10 rounded-[6px] border border-border bg-bg px-3 text-sm" value={state.status} onChange={(event) => setState((current) => ({ ...current, status: event.target.value as ProjectState["status"] }))}>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </Card>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading} icon={<Save size={18} />}>{loading ? "Saving..." : "Save Project"}</Button>
        <Button type="button" variant="secondary" onClick={() => setState((current) => ({ ...current, status: "in-progress" }))}>Save as Draft</Button>
        <Button type="button" variant="secondary" onClick={() => setState((current) => ({ ...current, status: "completed" }))}>Publish</Button>
      </div>
    </form>
  );
}
