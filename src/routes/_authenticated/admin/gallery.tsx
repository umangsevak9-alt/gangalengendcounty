import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense, useEffect, useState } from "react";
import { listGalleryAdmin, upsertGalleryImage, deleteGalleryImage } from "@/lib/cms-admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  head: () => ({ meta: [{ title: "Gallery · Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Suspense fallback={<div className="p-8 text-[#525252]">Loading…</div>}><Page /></Suspense>
    </div>
  ),
});

type Row = { id: string; title: string | null; image_path: string; aspect: string; sort_order: number };

function Page() {
  const list = useServerFn(listGalleryAdmin);
  const save = useServerFn(upsertGalleryImage);
  const remove = useServerFn(deleteGalleryImage);
  const qc = useQueryClient();
  const { data } = useSuspenseQuery({ queryKey: ["admin", "gallery"], queryFn: () => list() });
  const [editing, setEditing] = useState<Partial<Row> | null>(null);

  const saveMut = useMutation({
    mutationFn: (r: Partial<Row>) => save({ data: {
      id: r.id, title: r.title ?? null, image_path: r.image_path!,
      aspect: (r.aspect as "wide" | "tall" | "square") ?? "wide",
      sort_order: r.sort_order ?? 0,
    } }),
    onSuccess: () => {
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
      qc.invalidateQueries({ queryKey: ["public", "gallery"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: async (r: Row) => {
      await remove({ data: { id: r.id } });
      if (r.image_path) await supabase.storage.from("cms-media").remove([r.image_path]);
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
      qc.invalidateQueries({ queryKey: ["public", "gallery"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-[#525252] hover:text-[#0a0a0a] mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to admin
      </Link>
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div>
          <p className="eyebrow mb-2">Content</p>
          <h1 className="text-3xl font-serif text-[#0a0a0a]">Gallery</h1>
          <p className="text-sm text-[#525252] mt-1">{data.length} images</p>
        </div>
        <Button onClick={() => setEditing({ sort_order: (data.at(-1)?.sort_order ?? 0) + 10, aspect: "wide" })}
          className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
          <Plus className="h-4 w-4 mr-2" /> Add image
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((row) => (
          <Card key={row.id} row={row}
            onEdit={() => setEditing(row)}
            onDelete={() => { if (confirm("Delete this image?")) delMut.mutate(row); }} />
        ))}
        {data.length === 0 && (
          <div className="col-span-full rounded-lg border border-dashed border-[#e5e5e5] p-10 text-center text-[#737373]">
            No gallery images yet.
          </div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-serif">{editing?.id ? "Edit image" : "New image"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Image</Label>
                <MediaUpload value={editing.image_path ?? null}
                  onChange={(p) => setEditing({ ...editing, image_path: p ?? undefined })}
                  folder="gallery" label="Upload image" />
              </div>
              <div>
                <Label>Title (optional)</Label>
                <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Aspect ratio</Label>
                  <Select value={editing.aspect ?? "wide"} onValueChange={(v) => setEditing({ ...editing, aspect: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wide">Wide (4:3)</SelectItem>
                      <SelectItem value="tall">Tall (3:4)</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Sort order</Label>
                  <Input type="number" value={editing.sort_order ?? 0}
                    onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => editing && saveMut.mutate(editing)}
              disabled={!editing?.image_path || saveMut.isPending}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
              {saveMut.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Card({ row, onEdit, onDelete }: { row: Row; onEdit: () => void; onDelete: () => void }) {
  const [thumb, setThumb] = useState<string | null>(null);
  useEffect(() => {
    supabase.storage.from("cms-media").createSignedUrl(row.image_path, 3600).then(({ data }) => {
      if (data?.signedUrl) setThumb(data.signedUrl);
    });
  }, [row.image_path]);
  return (
    <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
      <div className="aspect-[4/3] bg-[#f0f0f0] overflow-hidden">
        {thumb ? <img src={thumb} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full" />}
      </div>
      <div className="p-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-medium text-[#0a0a0a] truncate">{row.title || "Untitled"}</div>
          <div className="text-xs text-[#737373]">#{row.sort_order} · {row.aspect}</div>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button variant="outline" size="sm" onClick={onEdit}><Pencil className="h-3.5 w-3.5" /></Button>
          <Button variant="outline" size="sm" onClick={onDelete} className="text-[#b91c1c] hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></Button>
        </div>
      </div>
    </div>
  );
}
