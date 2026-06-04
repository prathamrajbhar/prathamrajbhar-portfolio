"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { supabase, BUCKET_NAME } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  aspect?: string;
  folder?: string;
}

export function ImageUpload({ 
  value, 
  onChange, 
  label = "Upload Image", 
  className,
  aspect = "aspect-square",
  folder = "avatars"
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size too large (max 5MB)");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (err: unknown) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const clearImage = () => {
    onChange("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-[0.3em] text-text/40">{label}</label>
        {value && (
          <button
            type="button"
            onClick={clearImage}
            className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5"
          >
            <X size={10} strokeWidth={3} />
            Remove
          </button>
        )}
      </div>

      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          "relative group cursor-pointer rounded-[2.5rem] border-2 border-dashed transition-all duration-500 overflow-hidden flex flex-col items-center justify-center gap-4",
          aspect,
          value 
            ? "border-primary/50 bg-primary/5" 
            : "border-border/50 bg-surface/30 hover:border-primary/40 hover:bg-surface/50",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-2"
            >
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Uploading...</p>
            </motion.div>
          ) : value ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 w-full h-full p-4"
            >
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden group/image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={value} 
                  alt="Avatar" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110" 
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="text-white h-8 w-8" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center px-6 gap-3"
            >
              <div className="h-16 w-16 rounded-2xl bg-surface/50 border border-border/50 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
                <ImageIcon className="text-text/20 group-hover:text-primary/40 transition-colors" size={32} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-text/80">Click to upload</p>
                <p className="text-[10px] text-text/40 uppercase tracking-widest">PNG, JPG or WebP (max 5MB)</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p className="absolute bottom-4 left-0 right-0 text-center text-[10px] font-bold text-red-500 px-4 line-clamp-1">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
