import { notFound } from "next/navigation";
import { CertificationForm } from "@/components/admin/CertificationForm";
import { fetchApi } from "@/lib/server-data";
import type { CertificationDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditCertificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await fetchApi<CertificationDTO | null>(`/certifications/${id}`, null);
  if (!item) notFound();
  return <CertificationForm initialData={item} />;
}