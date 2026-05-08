import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailClient } from "@/components/public/ProjectDetailClient";
import { fetchApi } from "@/lib/server-data";
import type { ProjectDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await fetchApi<ProjectDTO | null>(`/projects/${params.slug}`, null);
  return {
    title: project?.title ?? "Project",
    description: project?.description ?? "Project detail",
    openGraph: {
      images: [`/api/og?title=${encodeURIComponent(project?.title ?? "Project")}&subtitle=Project`]
    }
  };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const [project, allProjects] = await Promise.all([
    fetchApi<ProjectDTO | null>(`/projects/${params.slug}`, null),
    fetchApi<ProjectDTO[]>("/projects", [])
  ]);

  if (!project) notFound();
  
  const tagNames = new Set(project.tags.map((tag) => tag.name));
  const related = allProjects.filter((item) => item.id !== project.id && item.tags.some((tag) => tagNames.has(tag.name))).slice(0, 3);

  return <ProjectDetailClient project={project} related={related} />;
}
