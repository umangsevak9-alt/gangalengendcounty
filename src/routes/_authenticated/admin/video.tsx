import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense, useState, useEffect } from "react";
import { getVideoSectionAdmin, upsertVideoSection } from "@/lib/cms-admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/video")({
  head: () => ({ meta: [{ title: "Video Section · Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <div className="min-h-screen bg-[#faf8f5]">
      <Suspense fallback={<div className="p-8 text-[#5c4d3c]">Loading…</div>}>
        <Page />
      </Suspense>
    </div>
  ),
});

type VideoRow = {
  id?: string;
  title: string;
  subtitle: string | null;
  provider: "upload" | "youtube" | "vimeo";
  video_url: string | null;
  video_path: string | null;
  poster_path: string | null;
  is_active: boolean;
};

function Page() {
  const load = useServerFn(getVideoSectionAdmin);
  const save = useServerFn(upsertVideoSection);
  const qc = useQueryClient();
  const { data: initial } = useSuspenseQuery({ queryKey: ["admin", "video"], queryFn: () => load() });
  const [row, setRow] = useState<VideoRow>({
    title: "Experience Nova One",
    subtitle: "",
    provider: "youtube",
    video_url: "",
    video_path: null,
    poster_path: null,
    is_active: true,
  });

  useEffect(() => {
    if (initial) {
      setRow({
        id: initial.id,
        title: initial.title,
        subtitle: initial.subtitle,
        provider: initial.provider as VideoRow["provider"],
        video_url: initial.video_url,
        video_path: initial.video_path,
        poster_path: initial.poster_path,
        is_active: initial.is_active,
      });
    }
  }, [initial]);

  const saveMut = useMutation({
    mutationFn: () => save({
      data: {
        id: row.id,
        title: row.title,
        subtitle: row.subtitle,
        provider: row.provider,
        video_url: row.video_url,
        video_path: row.video_path,
        poster_path: row.poster_path,
        is_active: row.is_active,
      },
    }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin", "video"] });
      qc.invalidateQueries({ queryKey: ["public", "video"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="max-w-2xl mx-auto py-8 px-6">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-[#5c4d3c] hover:text-[#2d2d2d] mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to admin
      </Link>
      <div className="mb-8">
        <p className="eyebrow mb-2">Content</p>
        <h1 className="text-3xl font-serif text-[#2d2d2d]">Video Section</h1>
        <p className="text-sm text-[#5c4d3c] mt-1">A single video showcased on the landing page.</p>
      </div>

      <div className="bg-white rounded-lg border border-[#e8e4dd] p-6 space-y-5">
        <div>
          <Label>Title</Label>
          <Input value={row.title} onChange={(e) => setRow({ ...row, title: e.target.value })} />
        </div>
        <div>
          <Label>Subtitle</Label>
          <Textarea rows={2} value={row.subtitle ?? ""} onChange={(e) => setRow({ ...row, subtitle: e.target.value })} />
        </div>
        <div>
          <Label>Source type</Label>
          <Select value={row.provider} onValueChange={(v) => setRow({ ...row, provider: v as VideoRow["provider"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="youtube">YouTube URL</SelectItem>
              <SelectItem value="vimeo">Vimeo URL</SelectItem>
              <SelectItem value="upload">Upload MP4 file</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {row.provider === "upload" ? (
          <div>
            <Label>Video file (MP4)</Label>
            <MediaUpload
              value={row.video_path}
              onChange={(path) => setRow({ ...row, video_path: path, video_url: null })}
              accept="video/mp4,video/webm"
              folder="video"
              label="Upload video"
            />
          </div>
        ) : (
          <div>
            <Label>Video URL</Label>
            <Input
              placeholder={row.provider === "youtube" ? "https://www.youtube.com/embed/…" : "https://player.vimeo.com/video/…"}
              value={row.video_url ?? ""}
              onChange={(e) => setRow({ ...row, video_url: e.target.value, video_path: null })}
            />
            <p className="text-xs text-[#8b7355] mt-1">
              Use the embed URL (e.g. paste a YouTube link like <code>youtube.com/watch?v=ID</code> and change it to <code>youtube.com/embed/ID</code>).
            </p>
          </div>
        )}
        <div>
          <Label>Poster image (thumbnail)</Label>
          <MediaUpload
            value={row.poster_path}
            onChange={(path) => setRow({ ...row, poster_path: path })}
            folder="video"
            label="Upload poster"
          />
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={row.is_active} onCheckedChange={(v) => setRow({ ...row, is_active: v })} />
          <Label className="mb-0">Show on landing page</Label>
        </div>
        <div className="pt-2 flex justify-end">
          <Button
            onClick={() => saveMut.mutate()}
            disabled={saveMut.isPending || !row.title.trim()}
            className="bg-[#8b7355] hover:bg-[#6b5a44] text-white"
          >
            {saveMut.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
