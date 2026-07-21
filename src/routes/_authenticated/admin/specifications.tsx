import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense, useState, useEffect } from "react";
import {
  listSpecificationsAdmin,
  upsertSpecification,
  deleteSpecification,
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

export const Route = createFileRoute("/_authenticated/admin/specifications")({
  head: () => ({ meta: [{ title: "Specifications · Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Suspense fallback={<div className="p-8 text-[#525252]">Loading…</div>}>
        <Page />
      </Suspense>
    </div>
  ),
});

type Spec = {
  id: string;
  group_name: string;
  detail: string;
  image_path: string | null;
  sort_order: number;
};

function Page() {
  const list = useServerFn(listSpecificationsAdmin);
  const save = useServerFn(upsertSpecification);
  const remove = useServerFn(deleteSpecification);
  const qc = useQueryClient();
  const { data } = useSuspenseQuery({ queryKey: ["admin", "specifications"], queryFn: () => list() });

  const [editing, setEditing] = useState<Partial<Spec> | null>(null);

  const saveMut = useMutation({
    mutationFn: (row: Partial<Spec>) => save({
      data: {
        id: row.id,
        group_name: row.group_name!,
        detail: row.detail!,
        image_path: row.image_path ?? null,
        sort_order: row.sort_order ?? 0,
      },
    }),
    onSuccess: () => {
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin", "specifications"] });
      qc.invalidateQueries({ queryKey: ["public", "specifications"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: async (row: Spec) => {
      await remove({ data: { id: row.id } });
      if (row.image_path) await supabase.storage.from("cms-media").remove([row.image_path]);
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", "specifications"] });
      qc.invalidateQueries({ queryKey: ["public", "specifications"] });
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
          <h1 className="text-3xl font-serif text-[#0a0a0a]">Specifications</h1>
          <p className="text-sm text-[#525252] mt-1">{data.length} items</p>
        </div>
        <Button onClick={() => setEditing({ sort_order: (data.at(-1)?.sort_order ?? 0) + 10 })} className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
          <Plus className="h-4 w-4 mr-2" /> Add specification
        </Button>
      </div>

      <div className="grid gap-3">
        {data.map((row) => (
          <SpecCard
            key={row.id}
            row={row}
            onEdit={() => setEditing(row)}
            onDelete={() => confirm(`Delete "${row.group_name}"?`) && delMut.mutate(row)}
          />
        ))}
        {data.length === 0 && (
          <div className="rounded-lg border border-dashed border-[#e5e5e5] p-10 text-center text-[#737373]">
            No specifications yet.
          </div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">{editing?.id ? "Edit specification" : "New specification"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Group name</Label>
                <Input placeholder="e.g. Kitchen" value={editing.group_name ?? ""} onChange={(e) => setEditing({ ...editing, group_name: e.target.value })} />
              </div>
              <div>
                <Label>Detail</Label>
                <Textarea rows={3} value={editing.detail ?? ""} onChange={(e) => setEditing({ ...editing, detail: e.target.value })} />
              </div>
              <div>
                <Label>Sort order</Label>
                <Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Image (optional)</Label>
                <MediaUpload
                  value={editing.image_path ?? null}
                  onChange={(path) => setEditing({ ...editing, image_path: path })}
                  folder="specifications"
                  label="Upload image"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button
              onClick={() => editing && saveMut.mutate(editing)}
              disabled={!editing?.group_name || !editing?.detail || saveMut.isPending}
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

function SpecCard({ row, onEdit, onDelete }: { row: Spec; onEdit: () => void; onDelete: () => void }) {
  const [thumb, setThumb] = useState<string | null>(null);
  useEffect(() => {
    if (!row.image_path) return;
    supabase.storage.from("cms-media").createSignedUrl(row.image_path, 3600).then(({ data }) => {
      if (data?.signedUrl) setThumb(data.signedUrl);
    });
  }, [row.image_path]);
  return (
    <div className="bg-white rounded-lg border border-[#e5e5e5] p-4 flex items-start gap-4">
      <div className="h-16 w-24 rounded bg-[#f0f0f0] grid place-items-center overflow-hidden shrink-0">
        {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : <span className="text-xs text-[#737373]">No image</span>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-serif text-[#0a0a0a]">{row.group_name}</h3>
          <span className="text-xs px-1.5 py-0.5 rounded bg-[#f0f0f0] text-[#525252]">#{row.sort_order}</span>
        </div>
        <p className="text-sm text-[#525252] mt-1">{row.detail}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={onEdit}><Pencil className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm" onClick={onDelete} className="text-[#b91c1c] hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
