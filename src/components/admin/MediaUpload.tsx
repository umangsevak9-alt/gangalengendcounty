import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";

interface Props {
  value: string | null;
  onChange: (path: string | null) => void;
  accept?: string;
  folder: string;
  label?: string;
}

export function MediaUpload({ value, onChange, accept = "image/*", folder, label = "Upload file" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch preview signed url if we have a path
  useState(() => {
    if (value && !previewUrl) {
      supabase.storage.from("cms-media").createSignedUrl(value, 3600).then(({ data }) => {
        if (data?.signedUrl) setPreviewUrl(data.signedUrl);
      });
    }
  });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File too large (max 50 MB)");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("cms-media").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    setUploading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    const { data: signed } = await supabase.storage.from("cms-media").createSignedUrl(path, 3600);
    setPreviewUrl(signed?.signedUrl ?? null);
    onChange(path);
    toast.success("Uploaded");
  };

  const clear = () => {
    setPreviewUrl(null);
    onChange(null);
  };

  const isVideo = accept.includes("video");

  return (
    <div className="space-y-2">
      {previewUrl ? (
        <div className="relative rounded-lg border border-[#e8e4dd] overflow-hidden bg-[#f0ebe3]">
          {isVideo ? (
            <video src={previewUrl} className="w-full max-h-64 object-cover" controls />
          ) : (
            <img src={previewUrl} alt="preview" className="w-full max-h-64 object-cover" />
          )}
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 h-8 w-8 grid place-items-center rounded-full bg-white/90 hover:bg-white shadow"
            aria-label="Remove"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-[#e8e4dd] bg-[#faf8f5] p-6 text-center text-sm text-[#8b7355]">
          No file selected
        </div>
      )}
      <label className="block">
        <input type="file" accept={accept} onChange={handleFile} disabled={uploading} className="hidden" />
        <Button type="button" variant="outline" disabled={uploading} asChild>
          <span className="cursor-pointer">
            {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
            {uploading ? "Uploading…" : label}
          </span>
        </Button>
      </label>
    </div>
  );
}
