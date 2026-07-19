import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense, useState } from "react";
import { listFaqsAdmin, upsertFaq, deleteFaq } from "@/lib/cms-admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/faqs")({
  head: () => ({ meta: [{ title: "FAQs · Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <div className="min-h-screen bg-[#faf8f5]">
      <Suspense fallback={<div className="p-8 text-[#5c4d3c]">Loading…</div>}><Page /></Suspense>
    </div>
  ),
});

type Row = { id: string; question: string; answer: string; sort_order: number };

function Page() {
  const list = useServerFn(listFaqsAdmin);
  const save = useServerFn(upsertFaq);
  const remove = useServerFn(deleteFaq);
  const qc = useQueryClient();
  const { data } = useSuspenseQuery({ queryKey: ["admin", "faqs"], queryFn: () => list() });
  const [editing, setEditing] = useState<Partial<Row> | null>(null);

  const saveMut = useMutation({
    mutationFn: (r: Partial<Row>) => save({ data: {
      id: r.id, question: r.question!, answer: r.answer!, sort_order: r.sort_order ?? 0,
    } }),
    onSuccess: () => {
      toast.success("Saved"); setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin", "faqs"] });
      qc.invalidateQueries({ queryKey: ["public", "faqs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: (r: Row) => remove({ data: { id: r.id } }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", "faqs"] });
      qc.invalidateQueries({ queryKey: ["public", "faqs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-[#5c4d3c] hover:text-[#2d2d2d] mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to admin
      </Link>
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div>
          <p className="eyebrow mb-2">Content</p>
          <h1 className="text-3xl font-serif text-[#2d2d2d]">FAQs</h1>
          <p className="text-sm text-[#5c4d3c] mt-1">{data.length} questions</p>
        </div>
        <Button onClick={() => setEditing({ sort_order: (data.at(-1)?.sort_order ?? 0) + 10 })}
          className="bg-[#8b7355] hover:bg-[#6b5a44] text-white">
          <Plus className="h-4 w-4 mr-2" /> Add FAQ
        </Button>
      </div>

      <div className="grid gap-3">
        {data.map((row) => (
          <div key={row.id} className="bg-white rounded-lg border border-[#e8e4dd] p-4 flex items-start gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-[#2d2d2d]">{row.question}</h3>
                <span className="text-xs px-1.5 py-0.5 rounded bg-[#f0ebe3] text-[#5c4d3c]">#{row.sort_order}</span>
              </div>
              <p className="text-sm text-[#5c4d3c] mt-1 line-clamp-2">{row.answer}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => setEditing(row)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => { if (confirm("Delete?")) delMut.mutate(row); }} className="text-[#b91c1c] hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="rounded-lg border border-dashed border-[#e8e4dd] p-10 text-center text-[#8b7355]">No FAQs yet.</div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-serif">{editing?.id ? "Edit FAQ" : "New FAQ"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Question</Label><Input value={editing.question ?? ""} onChange={(e) => setEditing({ ...editing, question: e.target.value })} /></div>
              <div><Label>Answer</Label><Textarea rows={5} value={editing.answer ?? ""} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} /></div>
              <div><Label>Sort order</Label><Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => editing && saveMut.mutate(editing)}
              disabled={!editing?.question || !editing?.answer || saveMut.isPending}
              className="bg-[#8b7355] hover:bg-[#6b5a44] text-white">
              {saveMut.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
