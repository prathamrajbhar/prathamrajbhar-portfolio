"use client";
import { useState, useRef, useCallback } from "react";
import { X, Image as ImageIcon, Loader2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MultiFileUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
}

interface UploadingFile {
  id: string;
  name: string;
}

export function MultiFileUpload({
  value = [],
  onChange,
  label = "Upload gallery images",
  accept = "image/*",
  maxSizeMB = 5,
}: MultiFileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFiles = useCallback(async (filesList: FileList) => {
    // Check if Supabase is configured
    const supabaseUrl = process.env.STORAGE_URL;
    const supabaseAnonKey = process.env.STORAGE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      setError("Storage is not configured. Please set STORAGE_URL and STORAGE_KEY.");
      return;
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const BUCKET_NAME = "portfolio-uploads";
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const newUrls: string[] = [];

    setError(null);

    // Filter valid images and size limit
    const filesToUpload: File[] = [];
    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        continue;
      }
      if (file.size > maxSizeBytes) {
        setError(`File ${file.name} exceeds the ${maxSizeMB}MB size limit.`);
        continue;
      }
      filesToUpload.push(file);
    }

    if (filesToUpload.length === 0) return;

    // Track uploading states
    const newUploading: UploadingFile[] = filesToUpload.map((f) => ({
      id: Math.random().toString(36).substring(2),
      name: f.name,
    }));

    setUploadingFiles((prev) => [...prev, ...newUploading]);

    // Upload sequentially or concurrently
    await Promise.all(
      filesToUpload.map(async (file, idx) => {
        const uploadState = newUploading[idx];
        try {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
              upsert: true,
            });

          if (uploadError) {
            throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`);
          }

          const {
            data: { publicUrl },
          } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

          newUrls.push(publicUrl);
        } catch (err) {
          console.error("Upload error for file:", file.name, err);
          setError(err instanceof Error ? err.message : `Failed to upload ${file.name}`);
        } finally {
          // Remove from uploading list
          setUploadingFiles((prev) => prev.filter((item) => item.id !== uploadState.id));
        }
      })
    );

    if (newUrls.length > 0) {
      onChange([...value, ...newUrls]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [value, onChange, maxSizeMB]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await handleUploadFiles(e.target.files);
    }
  }, [handleUploadFiles]);

  const handleRemove = useCallback((urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  }, [value, onChange]);

  const hasItems = value.length > 0 || uploadingFiles.length > 0;

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={uploadingFiles.length > 0}
        multiple
        className="hidden"
        id="multi-file-upload-input"
      />

      {hasItems ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border border-border/40 bg-surface/10 rounded-3xl p-4">
          <AnimatePresence initial={false}>
            {value.map((url, index) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative aspect-[16/10] group overflow-hidden rounded-2xl border border-border/50 shadow-md bg-bg/50 p-1.5"
              >
                <div className="relative w-full h-full overflow-hidden rounded-xl bg-surface/50 border border-border/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Uploaded gallery ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Ordinal numbering badge */}
                  <div className="absolute top-2 left-2 z-10 select-none">
                    <span className="text-[9px] font-black uppercase tracking-wider bg-bg/85 border border-border/50 text-text/80 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemove(url)}
                      className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/20 transform scale-90 group-hover:scale-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {uploadingFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-[16/10] flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-surface/30 backdrop-blur-sm p-4 text-center"
              >
                <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                <span className="text-[10px] font-bold text-muted/80 truncate w-full px-2">
                  {file.name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          <label
            htmlFor="multi-file-upload-input"
            className="group relative flex flex-col items-center justify-center aspect-[16/10] border-2 border-dashed border-border/50 rounded-2xl bg-surface/30 hover:border-primary/50 hover:bg-surface/50 transition-all duration-300 backdrop-blur-sm cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg border border-border/50 text-muted transition-all group-hover:scale-110 group-hover:text-primary group-hover:border-primary/30 group-hover:shadow-lg">
              <Plus size={18} />
            </div>
            <span className="block text-[10px] font-bold text-muted mt-2 group-hover:text-primary transition-colors">
              Add Images
            </span>
          </label>
        </div>
      ) : (
        <div className="group relative border-2 border-dashed border-border/50 rounded-2xl bg-surface/30 p-10 text-center hover:border-primary/50 hover:bg-surface/50 transition-all duration-300 backdrop-blur-sm">
          <label
            htmlFor="multi-file-upload-input"
            className="cursor-pointer flex flex-col items-center gap-4"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bg border border-border/50 text-muted transition-all group-hover:scale-110 group-hover:text-primary group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10">
              <ImageIcon className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <span className="block text-sm font-bold text-text group-hover:text-primary transition-colors">
                {label}
              </span>
              <span className="block text-xs text-muted/60 font-medium">
                Max size: {maxSizeMB}MB (Multiple allowed)
              </span>
            </div>
          </label>
        </div>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-bold uppercase tracking-wider text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
