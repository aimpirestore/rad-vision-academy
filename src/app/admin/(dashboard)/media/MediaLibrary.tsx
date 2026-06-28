"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Upload, Trash2, Copy, Search, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/app/admin/_components/Form";

type MediaFile = {
  id: string;
  name: string;
  publicUrl: string;
  size: number;
  created_at: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function MediaLibrary({ initialFiles }: { initialFiles: MediaFile[] }) {
  const [files, setFiles] = useState<MediaFile[]>(initialFiles);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    const supabase = createClient();
    const newFiles: MediaFile[] = [];

    for (const file of Array.from(fileList)) {
      const ext = file.name.split(".").pop();
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage.from("media").upload(path, file);
      if (error) {
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      newFiles.push({
        id: path,
        name: file.name,
        publicUrl: urlData.publicUrl,
        size: file.size,
        created_at: new Date().toISOString(),
      });
    }

    setFiles((prev) => [...newFiles, ...prev]);
    setUploading(false);
    toast.success(`${newFiles.length} file(s) uploaded`);
    // Reset input
    e.target.value = "";
  }, []);

  async function handleDelete(file: MediaFile) {
    setDeleting(file.id);
    const supabase = createClient();
    const { error } = await supabase.storage.from("media").remove([file.id]);
    if (error) {
      toast.error(error.message);
      setDeleting(null);
      return;
    }
    setFiles((prev) => prev.filter((f) => f.id !== file.id));
    setDeleting(null);
    toast.success("File deleted");
  }

  async function handleCopy(url: string) {
    await navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  }

  return (
    <div>
      {/* Upload bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-800" />
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-red px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-red-deep">
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload Files"}
          <input type="file" accept="image/*,.pdf,.doc,.docx" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
          <ImageIcon className="mb-4 h-12 w-12 text-slate-300" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">No media files</h3>
          <p className="mt-1 text-sm text-slate-400">Upload images, PDFs, and documents to your media library.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((file) => (
            <div key={file.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
              {file.name.match(/\.(png|jpe?g|gif|webp|svg)$/i) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={file.publicUrl} alt={file.name} className="h-40 w-full object-cover" />
              ) : (
                <div className="flex h-40 items-center justify-center bg-slate-50 dark:bg-slate-800">
                  <ImageIcon className="h-8 w-8 text-slate-300" />
                </div>
              )}
              {/* Overlay actions */}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex w-full items-center justify-between p-2">
                  <button onClick={() => handleCopy(file.publicUrl)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-slate-700 hover:bg-white" title="Copy URL">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(file)} disabled={deleting === file.id} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/90 text-white hover:bg-red-700" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">{file.name}</p>
                <p className="text-[10px] text-slate-400">{formatBytes(file.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
