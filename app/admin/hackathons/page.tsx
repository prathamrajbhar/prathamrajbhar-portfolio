import { HackathonList } from "@/components/admin/HackathonList";
import { Button } from "@/components/ui/Button";
import { fetchApi } from "@/lib/server-data";
import type { HackathonDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminHackathonsPage() {
  const items = await fetchApi<HackathonDTO[]>("/hackathons", []);
  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted">{items.length} hackathons entries</p>
        <Button href="/admin/hackathons/new">Add Hackathon</Button>
      </div>
      <HackathonList items={items} />
    </div>
  );
}