"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Loader2, Zap, Settings2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ServiceDTO } from "@/lib/types";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/admin/services");
        const json = await res.json() as { data?: ServiceDTO[] };
        setServices(json.data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setServices(services.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    } finally {
      setDeleting(null);
    }
  };

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(filter.toLowerCase()) || 
    s.description.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
        <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-muted">Indexing services...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            <Settings2 size={12} />
            Services Config
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-text sm:text-6xl">Services Matrix</h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">Manage the &quot;What I use&quot; / Services that highlight your focus areas.</p>
        </div>

        <Link href="/admin/services/new">
          <button className="group flex items-center gap-3 rounded-2xl bg-primary px-8 py-5 text-sm font-black uppercase tracking-widest text-bg shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <Plus size={20} className="transition-transform group-hover:rotate-90" />
            Inject New Service
          </button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Search across title or description..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-14 w-full rounded-2xl border border-border/50 bg-surface/30 pl-12 pr-4 text-sm font-medium text-text outline-none backdrop-blur-md transition-all focus:border-primary/50 focus:bg-surface/50 focus:ring-4 focus:ring-primary/5"
          />
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredServices.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full"
            >
              <Card className="flex flex-col items-center justify-center border-dashed border-border/50 bg-surface/10 p-24 text-center backdrop-blur-sm">
                <div className="flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-primary/5 text-primary mb-6 animate-pulse">
                  <Zap size={40} />
                </div>
                <h3 className="font-display text-2xl font-bold">No results found</h3>
                <p className="mt-2 text-muted max-w-sm mx-auto">Try refining your search or add a fresh service to your toolkit.</p>
                <Button variant="outline" className="mt-8 rounded-xl" onClick={() => setFilter("")}>
                  Clear Filters
                </Button>
              </Card>
            </motion.div>
          ) : (
            filteredServices.map((service) => (
              <motion.div
                key={service.id}
                variants={item}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="group relative h-full overflow-hidden border-border/50 bg-surface/30 p-8 backdrop-blur-md transition-all duration-500 hover:border-primary/40 hover:bg-surface/50 hover:shadow-2xl hover:shadow-primary/5">
                  <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/20" />
                  
                  <div className="flex items-start justify-between relative z-10 mb-8">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-bg border border-border/50 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 flex items-center justify-center">
                      {service.icon ? (
                        <Image src={service.icon} alt="" width={24} height={24} className="object-contain" unoptimized />
                      ) : (
                        <Settings2 size={24} className="text-primary" />
                      )}
                    </div>

                    <div className="flex gap-2 opacity-0 -translate-y-2 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <Link href={`/admin/services/edit/${service.id}`}>
                        <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg border border-border/50 text-muted transition-all hover:bg-primary hover:text-bg hover:border-primary active:scale-90 shadow-lg">
                          <Pencil size={18} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(service.id)}
                        disabled={deleting === service.id}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg border border-border/50 text-muted transition-all hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-90 shadow-lg"
                      >
                        {deleting === service.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted/40">
                        #{service.order}
                      </span>
                    </div>
                    
                    <h3 className="font-display text-xl font-bold tracking-tight text-text group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
