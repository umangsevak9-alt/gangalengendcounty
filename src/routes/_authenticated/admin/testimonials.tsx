import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense, useState, useEffect } from "react";
import {
  listTestimonialsAdmin, upsertTestimonial, deleteTestimonial,
} from "@/lib/cms-admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, Star, Video as VideoIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/testimonials")({
  head: () => ({ meta: [{ title: "Testimonials · Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Suspense fallback={<div className="p-8 text-[#525252]">Loading…</div>}>
        <Page />
      </Suspense>
    </div>
  ),
});

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  rating: number;
  provider: "none" | "upload" | "youtube" | "vimeo";
  video_url: string | null;
  video_path: string | null;
  image_path: string | null;
  sort_order: number;
  is_active: boolean;
};

function Page() {
  const list = useServerFn(listTestimonialsAdmin);
  const save = useServerFn(upsertTestimonial);
  const remove = useServerFn(deleteTestimonial);
  const qc = useQueryClient();
  const { data } = useSuspenseQuery({ queryKey: ["admin", "testimonials"], queryFn: () => list() });

  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);

  const saveMut = useMutation({
    mutationFn: (row: Partial<Testimonial>) => save({
      data: {
        id: row.id,
        name: row.name!,
        role: row.role ?? null,
        quote: row.quote!,
        rating: row.rating ?? 5,
        provider: (row.provider ?? "none") as "none" | "upload" | "youtube" | "vimeo",
        video_url: row.video_url ?? null,
        video_path: row.video_path ?? null,
        image_path: row.image_path ?? null,
        sort_order: row.sort_order ?? 0,
        is_active: row.is_active ?? true,
      },
    }),
    onSuccess: () => {
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      qc.invalidateQueries({ queryKey: ["public", "testimonials"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: async (row: Testimonial) => {
      await remove({ data: { id: row.id } });
      const paths = [row.image_path, row.video_path].filter(Boolean) as string[];
      if (paths.length) await supabase.storage.from("cms-media").remove(paths);
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      qc.invalidateQueries({ queryKey: ["public", "testimonials"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-[#525252] hover:text-[#0a0a0a] mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to admin
      </Link>
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div>
          <p className="eyebrow mb-2">Content</p>
          <h1 className="text-3xl font-serif text-[#0a0a0a]">Testimonials</h1>
          <p className="text-sm text-[#525252] mt-1">{data.length} items · Upload a photo or video for each customer.</p>
        </div>
        <Button
          onClick={() => setEditing({ sort_order: (data.at(-1)?.sort_order ?? 0) + 10, rating: 5, provider: "none", is_active: true })}
          className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Add testimonial
        </Button>
      </div>

      <div className="grid gap-3">
        {data.map((row) => (
          <Card
            key={row.id}
            row={row as Testimonial}
            onEdit={() => setEditing(row as Testimonial)}
            onDelete={() => { if (confirm(`Delete "${row.name}"?`)) delMut.mutate(row as Testimonial); }}
          />
        ))}
        {data.length === 0 && (
          <div className="rounded-lg border border-dashed border-[#e5e5e5] p-10 text-center text-[#737373]">
            No testimonials yet — click "Add testimonial" to create one.
          </div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">{editing?.id ? "Edit testimonial" : "New testimonial"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Customer name</Label>
                <Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <Label>Role / sub-line (optional)</Label>
                <Input placeholder="Home Buyer · 3 BHK" value={editing.role ?? ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
              </div>
              <div>
                <Label>Quote</Label>
                <Textarea rows={4} value={editing.quote ?? ""} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Rating (1–5)</Label>
                  <Input type="number" min={1} max={5} value={editing.rating ?? 5} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Sort order</Label>
                  <Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <Label>Profile photo (optional)</Label>
                <MediaUpload
                  value={editing.image_path ?? null}
                  onChange={(path) => setEditing({ ...editing, image_path: path })}
                  folder="testimonials"
                  label="Upload photo"
                />
              </div>
              <div>
                <Label>Video source</Label>
                <Select
                  value={editing.provider ?? "none"}
                  onValueChange={(v) => setEditing({ ...editing, provider: v as Testimonial["provider"] })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No video (text only)</SelectItem>
                    <SelectItem value="upload">Upload MP4 file</SelectItem>
                    <SelectItem value="youtube">YouTube URL</SelectItem>
                    <SelectItem value="vimeo">Vimeo URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editing.provider === "upload" && (
                <div>
                  <Label>Video file (MP4 / WebM)</Label>
                  <MediaUpload
                    value={editing.video_path ?? null}
                    onChange={(path) => setEditing({ ...editing, video_path: path, video_url: null })}
                    accept="video/mp4,video/webm"
                    folder="testimonials"
                    label="Upload video"
                  />
                  <p className="text-xs text-[#737373] mt-1">Recommended: horizontal 16:9, under 50 MB.</p>
                </div>
              )}
              {(editing.provider === "youtube" || editing.provider === "vimeo") && (
                <div>
                  <Label>{editing.provider === "youtube" ? "YouTube URL" : "Vimeo URL"}</Label>
                  <Input
                    placeholder={editing.provider === "youtube" ? "https://www.youtube.com/watch?v=…" : "https://vimeo.com/…"}
                    value={editing.video_url ?? ""}
                    onChange={(e) => setEditing({ ...editing, video_url: e.target.value, video_path: null })}
                  />
                </div>
              )}
              <div className="flex items-center gap-3">
                <Switch checked={editing.is_active ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                <Label className="mb-0">Show on landing page</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button
              onClick={() => editing && saveMut.mutate(editing)}
              disabled={!editing?.name || !editing?.quote || saveMut.isPending}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
            >
              {saveMut.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Card({ row, onEdit, onDelete }: { row: Testimonial; onEdit: () => void; onDelete: () => void }) {
  const [thumb, setThumb] = useState<string | null>(null);
  useEffect(() => {
    if (!row.image_path) return;
    supabase.storage.from("cms-media").createSignedUrl(row.image_path, 3600).then(({ data }) => {
      if (data?.signedUrl) setThumb(data.signedUrl);
    });
  }, [row.image_path]);

  const hasVideo = (row.provider === "upload" && row.video_path) || ((row.provider === "youtube" || row.provider === "vimeo") && row.video_url);

  return (
    <div className="bg-white rounded-lg border border-[#e5e5e5] p-4 flex items-center gap-4">
      <div className="h-16 w-16 rounded-full bg-[#f0f0f0] grid place-items-center overflow-hidden shrink-0">
        {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : <span className="text-xs text-[#737373]">{row.name.charAt(0)}</span>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-serif text-[#0a0a0a] truncate">{row.name}</h3>
          <span className="text-xs px-1.5 py-0.5 rounded bg-[#f0f0f0] text-[#525252]">#{row.sort_order}</span>
          <span className="inline-flex items-center gap-0.5 text-[#DC2626]">
            {Array.from({ length: Math.max(0, Math.min(5, row.rating || 5)) }).map((_, i) => (
              <Star key={i} className="h-3 w-3 fill-current" />
            ))}
          </span>
          {hasVideo && (
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 uppercase tracking-wider">
              <VideoIcon className="h-3 w-3" /> Video
            </span>
          )}
          {!row.is_active && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f0f0f0] text-[#737373] uppercase">Hidden</span>}
        </div>
        {row.role && <p className="text-xs text-[#737373] mt-0.5">{row.role}</p>}
        <p className="text-sm text-[#525252] mt-1 line-clamp-2">"{row.quote}"</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={onEdit}><Pencil className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm" onClick={onDelete} className="text-[#b91c1c] hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
