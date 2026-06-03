"use client";

import { useState, useRef, useCallback } from "react";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
}

export function FileUpload({ 
  value, 
  onChange, 
  label = "Upload image", 
  accept = "image/*",
  maxSizeMB = 5 
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.STORAGE_URL;
    const supabaseAnonKey = process.env.STORAGE_KEY;
    
    console.log('Supabase config check:', { 
      urlPresent: !!supabaseUrl, 
      keyPresent: !!supabaseAnonKey,
      url: supabaseUrl?.substring(0, 20) + '...'
    });
    
    if (!supabaseUrl || !supabaseAnonKey) {
      setError('Storage is not configured. Please set STORAGE_URL and STORAGE_KEY in your environment variables.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      console.log('Starting upload for file:', file.name, 'size:', file.size);
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const BUCKET_NAME = 'portfolio-uploads';

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Uploading to bucket:', BUCKET_NAME, 'path:', filePath);

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('Upload successful, getting public URL...');
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);
      onChange(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file. Please try again.';
      setError(errorMessage);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [onChange, maxSizeMB]);

  const handleRemove = useCallback(() => {
    onChange('');
  }, [onChange]);

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-surface/30 backdrop-blur-md p-3 group">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-border/30 bg-bg/50 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded Banner"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
            />
            {/* Glossy overlay with actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest bg-primary text-bg px-2.5 py-1 rounded-md shadow-sm">
                  Active Banner
                </span>
                <span className="text-[10px] font-bold text-white/80 bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm max-w-[200px] truncate">
                  {value.split('/').pop()}
                </span>
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-red-500/20 transform scale-95 group-hover:scale-100 transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <X size={14} />
                  Remove Banner
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="group relative border-2 border-dashed border-border/50 rounded-2xl bg-surface/30 p-12 text-center hover:border-primary/50 hover:bg-surface/50 transition-all duration-300 backdrop-blur-sm">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center gap-4"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bg border border-border/50 text-muted transition-all group-hover:scale-110 group-hover:text-primary group-hover:border-primary/30 group-hover:shadow-xl group-hover:shadow-primary/10">
              {uploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : (
                <ImageIcon className="h-8 w-8" />
              )}
            </div>
            <div className="space-y-1">
              <span className="block text-sm font-bold text-text group-hover:text-primary transition-colors">{label}</span>
              <span className="block text-xs text-muted/60 font-medium">
                Max size: {maxSizeMB}MB
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
