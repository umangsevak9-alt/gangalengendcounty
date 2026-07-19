import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense, useState, useEffect } from "react";
import {
  listAmenitiesAdmin,
  upsertAmenity,
  deleteAmenity,
} from "@/lib/cms-admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/amenities")({
  head: () => ({ meta: [{ title: "Amenities · Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <div className="min-h-screen bg-[#faf8f5]">
      <Suspense fallback={<div className="p-8 text-[#5c4d3c]">Loading…</div>}>
        <Page />
      </Suspense>
    </div>
  ),
});

type Amenity = {
  id: string;
  title: string;
  note: string | null;
  image_path: string | null;
  sort_order: number;
};

function Page() {
  const list = useServerFn(listAmenitiesAdmin);
  const save = useServerFn(upsertAmenity);
  const remove = useServerFn(deleteAmenity);
  const qc = useQueryClient();
  const { data } = useSuspenseQuery({ queryKey: ["admin", "amenities"], queryFn: () => list() });

  const [editing, setEditing] = useState<Partial<Amenity> | null>(null);

  const saveMut = useMutation({
    mutationFn: (row: Partial<Amenity>) => save({
      data: {
        id: row.id,
        title: row.title!,
        note: row.note ?? null,
        image_path: row.image_path ?? null,
        sort_order: row.sort_order ?? 0,
      },
    }),
    onSuccess: () => {
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin", "amenities"] });
      qc.invalidateQueries({ queryKey: ["public", "amenities"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: async (row: Amenity) => {
      await remove({ data: { id: row.id } });
      if (row.image_path) await supabase.storage.from("cms-media").remove([row.image_path]);
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", "amenities"] });
      qc.invalidateQueries({ queryKey: ["public", "amenities"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-[#5c4d3c] hover:text-[#2d2d2d] mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to admin
      </Link>
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div>
          <p className="eyebrow mb-2">Content</p>
          <h1 className="text-3xl font-serif text-[#2d2d2d]">Amenities</h1>
          <p className="text-sm text-[#5c4d3c] mt-1">{data.length} items</p>
        </div>
        <Button onClick={() => setEditing({ sort_order: (data.at(-1)?.sort_order ?? 0) + 10 })} className="bg-[#8b7355] hover:bg-[#6b5a44] text-white">
          <Plus className="h-4 w-4 mr-2" /> Add amenity
        </Button>
      </div>

      <div className="grid gap-3">
        {data.map((row) => (
          <AmenityCard
            key={row.id}
            row={row}
            onEdit={() => setEditing(row)}
            onDelete={() => {
              if (confirm(`Delete "${row.title}"?`)) delMut.mutate(row);
            }}
          />
        ))}
        {data.length === 0 && (
          <div className="rounded-lg border border-dashed border-[#e8e4dd] p-10 text-center text-[#8b7355]">
            No amenities yet — click "Add amenity" to create one.
          </div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">{editing?.id ? "Edit amenity" : "New amenity"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <Label>Note</Label>
                <Textarea rows={2} value={editing.note ?? ""} onChange={(e) => setEditing({ ...editing, note: e.target.value })} />
              </div>
              <div>
                <Label>Sort order</Label>
                <Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Image</Label>
                <MediaUpload
                  value={editing.image_path ?? null}
                  onChange={(path) => setEditing({ ...editing, image_path: path })}
                  folder="amenities"
                  label="Upload image"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button
              onClick={() => editing && saveMut.mutate(editing)}
              disabled={!editing?.title || saveMut.isPending}
              className="bg-[#8b7355] hover:bg-[#6b5a44] text-white"
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

function AmenityCard({ row, onEdit, onDelete }: { row: Amenity; onEdit: () => void; onDelete: () => void }) {
  const [thumb, setThumb] = useState<string | null>(null);
  useEffect(() => {
    if (!row.image_path) return;
    supabase.storage.from("cms-media").createSignedUrl(row.image_path, 3600).then(({ data }) => {
      if (data?.signedUrl) setThumb(data.signedUrl);
    });
  }, [row.image_path]);

  return (
    <div className="bg-white rounded-lg border border-[#e8e4dd] p-4 flex items-center gap-4">
      <div className="h-16 w-24 rounded bg-[#f0ebe3] grid place-items-center overflow-hidden shrink-0">
        {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : <span className="text-xs text-[#8b7355]">No image</span>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-serif text-[#2d2d2d] truncate">{row.title}</h3>
          <span className="text-xs px-1.5 py-0.5 rounded bg-[#f0ebe3] text-[#5c4d3c]">#{row.sort_order}</span>
        </div>
        {row.note && <p className="text-sm text-[#5c4d3c] mt-1 line-clamp-2">{row.note}</p>}
      </div>
      <div className="flex gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={onEdit}><Pencil className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm" onClick={onDelete} className="text-[#b91c1c] hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
