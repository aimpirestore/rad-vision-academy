"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function ImageUploader({
  value,
  onChange,
  bucket = "media",
  folder = "uploads",
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    onChange(urlData.publicUrl);
    setUploading(false);
  }

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      {value ? (
        <div className="group relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="h-40 w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-white"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-red-600 hover:bg-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 transition-colors hover:border-brand-red hover:text-brand-red dark:border-slate-700",
            uploading && "opacity-50",
          )}
        >
          {uploading ? (
            <span className="text-sm">Uploading...</span>
          ) : (
            <>
              <Upload className="h-6 w-6" />
              <span className="text-sm font-medium">Click to upload</span>
              <span className="text-xs">PNG, JPG, WebP up to 10MB</span>
            </>
          )}
        </button>
      )}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {/* Manual URL entry */}
      <div className="mt-2 flex items-center gap-2">
        <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="or paste image URL"
          className="flex-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-brand-red focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>
    </div>
  );
}
