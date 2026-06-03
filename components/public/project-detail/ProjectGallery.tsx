"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import type { ProjectDTO } from "@/lib/types";

interface ProjectGalleryProps {
  project: ProjectDTO;
}

export function ProjectGallery({ project }: ProjectGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const images = project.galleryImages || [];

  useEffect(() => {
    if (activeImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveImageIndex(null);
      } else if (e.key === "ArrowLeft" && images.length > 1) {
        setActiveImageIndex((prev) => (prev === null || prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight" && images.length > 1) {
        setActiveImageIndex((prev) => (prev === null || prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, images]);

  if (images.length === 0) return null;

  return (
    <section className="space-y-6">
      <div>
        <h3 className="font-display text-2xl font-bold tracking-tight">Project Gallery</h3>
        <p className="text-sm text-muted mt-1">Take a closer look at screenshots and live visuals of the build.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((imageUrl, index) => (
          <div
            key={imageUrl}
            onClick={() => setActiveImageIndex(index)}
            className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/50 bg-surface/30 cursor-pointer group hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
          >
            <Image
              src={imageUrl}
              alt={`${project.title} screenshot ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 backdrop-blur-[2px] transition-all duration-300">
              <span className="rounded-full bg-surface px-4 py-2 text-xs font-semibold tracking-wider text-text border border-border/50 shadow-md">
                Zoom Screen
              </span>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-md"
            onClick={() => setActiveImageIndex(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white rounded-full transition-all duration-300 z-50 cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X size={24} />
            </button>

            {/* Next / Prev buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev === null || prev === 0 ? images.length - 1 : prev - 1));
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/15 hover:scale-105 active:scale-95 text-white rounded-full transition-all duration-300 z-50 cursor-pointer"
                  aria-label="Previous Image"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev === null || prev === images.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/15 hover:scale-105 active:scale-95 text-white rounded-full transition-all duration-300 z-50 cursor-pointer"
                  aria-label="Next Image"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            {/* Main image container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-5xl max-h-[80vh] w-full aspect-[16/10] md:aspect-auto md:h-[80vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[activeImageIndex]}
                alt="Enlarged screenshot"
                fill
                priority
                className="object-contain max-h-[80vh] select-none pointer-events-none"
                sizes="100vw"
              />
            </motion.div>

            {/* Indicator / caption */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs font-black uppercase tracking-[0.2em] bg-white/5 px-6 py-3 border border-white/10 rounded-full backdrop-blur-md z-50 select-none">
              {activeImageIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
