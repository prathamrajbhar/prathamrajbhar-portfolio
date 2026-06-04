"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Check, Loader2, Sparkles, Command } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface IconSelectorProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

interface IconifyResult {
  icons: string[];
  total: number;
}

const ICON_COLORS = [
  "#EC4899", // pink-500
  "#8B5CF6", // purple-500
  "#3B82F6", // blue-500
  "#06B6D4", // cyan-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#6366F1", // indigo-500
];

const GLOW_COLORS = [
  "from-pink-500/10 to-transparent",
  "from-purple-500/10 to-transparent",
  "from-blue-500/10 to-transparent",
  "from-cyan-500/10 to-transparent",
  "from-emerald-500/10 to-transparent",
  "from-amber-500/10 to-transparent",
  "from-red-500/10 to-transparent",
  "from-indigo-500/10 to-transparent",
];

export function IconSelector({ value, onChange, label = "Select Icon" }: IconSelectorProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchIcons = async (query: string) => {
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=48`);
      const data = await res.json() as IconifyResult;
      setResults(data.icons || []);
    } catch (error) {
      console.error("Icon search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { supabase, BUCKET_NAME } = await import("@/lib/supabase");
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    if (search.length > 1) {
      searchTimeout.current = setTimeout(() => {
        fetchIcons(search);
      }, 400);
    }

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search]);

  const getIconUrl = (fullName: string, index: number) => {
    const [prefix, name] = fullName.split(":");
    // If it's the 'logos' prefix, it's already colorful, so we don't force a color
    if (prefix === "logos") {
      return `https://api.iconify.design/${prefix}/${name}.svg`;
    }
    // Otherwise, we apply a vibrant color from our palette
    const color = ICON_COLORS[index % ICON_COLORS.length].replace("#", "");
    return `https://api.iconify.design/${prefix}/${name}.svg?color=%23${color}`;
  };

  const getGlowColor = (index: number) => GLOW_COLORS[index % GLOW_COLORS.length];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-[0.3em] text-text/40">{label}</label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept="image/*"
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isUploading ? <Loader2 size={10} className="animate-spin" /> : <Search size={10} strokeWidth={3} />}
            Upload Custom
          </button>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => onChange("")}
              className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors flex items-center gap-1.5"
            >
              <X size={10} strokeWidth={3} />
              Clear
            </motion.button>
          )}
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-fuchsia-500/20 to-primary/20 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        <div className="relative">
          <Input
            placeholder="Search 100,000+ icons (e.g. react, apple, brand)..."
            value={search}
            onChange={(e) => {
              const val = e.target.value;
              setSearch(val);
              if (val.length === 0) setResults([]);
            }}
            className="h-16 pl-14 pr-14 rounded-[1.5rem] bg-surface/50 border-border/50 text-lg font-medium placeholder:text-text/20 focus:ring-primary/20 transition-all"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-text/20 group-focus-within:text-primary transition-colors" />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
            {loading ? (
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            ) : (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-bg/50 border border-border/50 text-[10px] font-bold text-text/30">
                <Command size={10} />
                <span>K</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative border border-border/50 rounded-[2rem] bg-surface/20 p-2">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 h-[400px] overflow-y-auto overflow-x-hidden p-4 custom-scrollbar rounded-[1.8rem]">
          <AnimatePresence>
            {/* Custom/Selected Icon Preview */}
            {value && !results.some(r => getIconUrl(r, 0).includes(value.split('?')[0])) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative aspect-square flex items-center justify-center rounded-2xl border border-primary bg-surface/80 shadow-lg z-10 scale-105"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={value} 
                  alt="Current Selection" 
                  className="relative h-10 w-10 object-contain transition-all duration-500 z-10" 
                />
                <div className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm z-20">
                  <Check size={11} strokeWidth={4} />
                </div>
              </motion.div>
            )}

            {results.length > 0 ? (
              results.map((fullName, index) => {
                const url = getIconUrl(fullName, index);
                const isSelected = value === url;
                const glowClass = getGlowColor(index);
                
                return (
                  <motion.button
                    key={fullName}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: (index % 16) * 0.01, type: "spring", stiffness: 300, damping: 25 }}
                    type="button"
                    onClick={() => onChange(url)}
                    className={cn(
                      "group relative aspect-square flex items-center justify-center rounded-2xl border transition-all duration-500 overflow-hidden",
                      isSelected 
                        ? "border-primary bg-surface/80 shadow-lg z-10 scale-105" 
                        : "bg-surface/30 border-border/50 hover:border-primary/50 hover:bg-surface/80 hover:scale-105"
                    )}
                    title={fullName}
                  >
                    {/* Background Glow */}
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                      glowClass
                    )} />
                    
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={url} 
                      alt={fullName} 
                      className={cn(
                        "relative h-10 w-10 object-contain transition-all duration-500 z-10",
                        isSelected ? "scale-110" : "opacity-90 group-hover:opacity-100 group-hover:scale-110"
                      )} 
                    />
                    
                    {isSelected && (
                      <motion.div 
                        layoutId="active-check"
                        className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm z-20"
                      >
                        <Check size={11} strokeWidth={4} />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })
            ) : !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full h-full flex flex-col items-center justify-center text-center gap-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                  <div className="relative h-20 w-20 rounded-[2rem] bg-surface/50 border border-border/50 flex items-center justify-center shadow-2xl">
                    <Sparkles className="text-primary/40 animate-pulse" size={32} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-text/80">
                    {search.length < 2 ? "Explore the Library" : "No Icons Found"}
                  </p>
                  <p className="text-sm text-text/40 max-w-[240px] mx-auto">
                    {search.length < 2 
                      ? "Search for any brand, technology, or concept to find the perfect asset." 
                      : `We couldn't find anything matching "${search}". Try something else!`}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid transparent;
          background-clip: padding-box;
        }
      `}</style>
    </div>
  );
}
