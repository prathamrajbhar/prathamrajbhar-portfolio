import { CertificationList } from "@/components/admin/CertificationList";
import { Button } from "@/components/ui/Button";
import { fetchApi } from "@/lib/server-data";
import type { CertificationDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage() {
  const items = await fetchApi<CertificationDTO[]>("/certifications", []);
  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted">{items.length} certifications entries</p>
        <Button href="/admin/certifications/new">Add Certification</Button>
      </div>
      <CertificationList items={items} />
    </div>
  );
}