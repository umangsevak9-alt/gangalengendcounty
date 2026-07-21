import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense, useEffect, useState } from "react";
import { listFloorPlansAdmin, upsertFloorPlan, deleteFloorPlan } from "@/lib/cms-admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/floor-plans")({
  head: () => ({ meta: [{ title: "Floor Plans · Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Suspense fallback={<div className="p-8 text-[#525252]">Loading…</div>}><Page /></Suspense>
    </div>
  ),
});

type Row = {
  id: string; name: string; tower: string | null; area: string | null;
  price: string | null; status: string | null; is_limited: boolean;
  image_path: string | null; sort_order: number;
};

function Page() {
  const list = useServerFn(listFloorPlansAdmin);
  const save = useServerFn(upsertFloorPlan);
  const remove = useServerFn(deleteFloorPlan);
  const qc = useQueryClient();
  const { data } = useSuspenseQuery({ queryKey: ["admin", "floorplans"], queryFn: () => list() });
  const [editing, setEditing] = useState<Partial<Row> | null>(null);

  const saveMut = useMutation({
    mutationFn: (r: Partial<Row>) => save({ data: {
      id: r.id, name: r.name!, tower: r.tower ?? null, area: r.area ?? null,
      price: r.price ?? null, status: r.status ?? null, is_limited: !!r.is_limited,
      image_path: r.image_path ?? null, sort_order: r.sort_order ?? 0,
    } }),
    onSuccess: () => {
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin", "floorplans"] });
      qc.invalidateQueries({ queryKey: ["public", "floorplans"] });
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
      qc.invalidateQueries({ queryKey: ["admin", "floorplans"] });
      qc.invalidateQueries({ queryKey: ["public", "floorplans"] });
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
          <h1 className="text-3xl font-serif text-[#0a0a0a]">Floor Plans</h1>
          <p className="text-sm text-[#525252] mt-1">{data.length} plans</p>
        </div>
        <Button onClick={() => setEditing({ sort_order: (data.at(-1)?.sort_order ?? 0) + 10, is_limited: false })}
          className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
          <Plus className="h-4 w-4 mr-2" /> Add plan
        </Button>
      </div>

      <div className="grid gap-3">
        {data.map((row) => (
          <Card key={row.id} row={row} onEdit={() => setEditing(row)}
            onDelete={() => { if (confirm(`Delete "${row.name}"?`)) delMut.mutate(row); }} />
        ))}
        {data.length === 0 && (
          <div className="rounded-lg border border-dashed border-[#e5e5e5] p-10 text-center text-[#737373]">
            No floor plans yet.
          </div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-serif">{editing?.id ? "Edit plan" : "New plan"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Tower</Label><Input value={editing.tower ?? ""} onChange={(e) => setEditing({ ...editing, tower: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Carpet Area</Label><Input value={editing.area ?? ""} placeholder="1,720 sq.ft." onChange={(e) => setEditing({ ...editing, area: e.target.value })} /></div>
                <div><Label>Starting Price</Label><Input value={editing.price ?? ""} placeholder="₹1.95 Cr onwards" onChange={(e) => setEditing({ ...editing, price: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Status Label</Label><Input value={editing.status ?? ""} placeholder="Filling Fast" onChange={(e) => setEditing({ ...editing, status: e.target.value })} /></div>
                <div><Label>Sort order</Label><Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={!!editing.is_limited} onCheckedChange={(v) => setEditing({ ...editing, is_limited: v })} />
                <Label>Show red "limited" badge</Label>
              </div>
              <div>
                <Label>Plan image</Label>
                <MediaUpload value={editing.image_path ?? null}
                  onChange={(p) => setEditing({ ...editing, image_path: p })}
                  folder="floor-plans" label="Upload plan image" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => editing && saveMut.mutate(editing)}
              disabled={!editing?.name || saveMut.isPending}
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
    if (!row.image_path) return;
    supabase.storage.from("cms-media").createSignedUrl(row.image_path, 3600).then(({ data }) => {
      if (data?.signedUrl) setThumb(data.signedUrl);
    });
  }, [row.image_path]);
  return (
    <div className="bg-white rounded-lg border border-[#e5e5e5] p-4 flex items-center gap-4">
      <div className="h-16 w-24 rounded bg-[#f0f0f0] overflow-hidden shrink-0">
        {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : <div className="h-full grid place-items-center text-xs text-[#737373]">No img</div>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-serif text-[#0a0a0a]">{row.name}</h3>
          {row.is_limited && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 uppercase">{row.status || "Limited"}</span>}
          <span className="text-xs px-1.5 py-0.5 rounded bg-[#f0f0f0] text-[#525252]">#{row.sort_order}</span>
        </div>
        <div className="text-xs text-[#525252] mt-1">{row.tower} · {row.area} · {row.price}</div>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={onEdit}><Pencil className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm" onClick={onDelete} className="text-[#b91c1c] hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
