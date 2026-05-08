import { notFound } from "next/navigation";
import { HackathonForm } from "@/components/admin/HackathonForm";
import { fetchApi } from "@/lib/server-data";
import type { HackathonDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditHackathonPage({ params }: { params: { id: string } }) {
  const item = await fetchApi<HackathonDTO | null>(`/hackathons/${params.id}`, null);
  if (!item) notFound();
  return <HackathonForm initialData={item} />;
}