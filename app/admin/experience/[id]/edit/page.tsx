import { notFound } from "next/navigation";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { getExperienceById } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const experience = await getExperienceById(id);
  if (!experience) notFound();
  return <ExperienceForm experience={experience} />;
}
