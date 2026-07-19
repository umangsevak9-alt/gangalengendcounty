import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense, useState, useEffect } from "react";
import {
  getLocationAdmin, upsertLocationSettings, upsertLandmark, deleteLandmark,
} from "@/lib/cms-admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, Save } from "lucide-react";

const ICON_KEYS = ["MapPin", "Navigation", "Building2", "ShoppingBag", "Hospital", "GraduationCap", "Trees", "Phone", "Calendar", "Trophy", "Star"];

export const Route = createFileRoute("/_authenticated/admin/location")({
  head: () => ({ meta: [{ title: "Location · Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <div className="min-h-screen bg-[#faf8f5]">
      <Suspense fallback={<div className="p-8 text-[#5c4d3c]">Loading…</div>}><Page /></Suspense>
    </div>
  ),
});

type Settings = {
  id?: string; heading: string; subtitle: string | null; address: string | null;
  map_embed_url: string | null; directions_url: string | null; is_active: boolean;
};
type Landmark = { id: string; label: string; travel_time: string | null; icon_key: string; sort_order: number };

function Page() {
  const load = useServerFn(getLocationAdmin);
  const saveSettings = useServerFn(upsertLocationSettings);
  const saveLandmark = useServerFn(upsertLandmark);
  const removeLandmark = useServerFn(deleteLandmark);
  const qc = useQueryClient();
  const { data } = useSuspenseQuery({ queryKey: ["admin", "location"], queryFn: () => load() });

  const [settings, setSettings] = useState<Settings>({
    id: data.settings?.id,
    heading: data.settings?.heading ?? "",
    subtitle: data.settings?.subtitle ?? "",
    address: data.settings?.address ?? "",
    map_embed_url: data.settings?.map_embed_url ?? "",
    directions_url: data.settings?.directions_url ?? "",
    is_active: data.settings?.is_active ?? true,
  });
  useEffect(() => {
    if (data.settings) setSettings({
      id: data.settings.id, heading: data.settings.heading, subtitle: data.settings.subtitle ?? "",
      address: data.settings.address ?? "", map_embed_url: data.settings.map_embed_url ?? "",
      directions_url: data.settings.directions_url ?? "", is_active: data.settings.is_active,
    });
  }, [data.settings]);

  const [editing, setEditing] = useState<Partial<Landmark> | null>(null);

  const saveSettingsMut = useMutation({
    mutationFn: () => saveSettings({ data: settings }),
    onSuccess: () => {
      toast.success("Location saved");
      qc.invalidateQueries({ queryKey: ["admin", "location"] });
      qc.invalidateQueries({ queryKey: ["public", "location"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveMut = useMutation({
    mutationFn: (r: Partial<Landmark>) => saveLandmark({ data: {
      id: r.id, label: r.label!, travel_time: r.travel_time ?? null,
      icon_key: r.icon_key ?? "MapPin", sort_order: r.sort_order ?? 0,
    } }),
    onSuccess: () => {
      toast.success("Saved"); setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin", "location"] });
      qc.invalidateQueries({ queryKey: ["public", "location"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: (r: Landmark) => removeLandmark({ data: { id: r.id } }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", "location"] });
      qc.invalidateQueries({ queryKey: ["public", "location"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-[#5c4d3c] hover:text-[#2d2d2d] mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to admin
      </Link>
      <div className="mb-8">
        <p className="eyebrow mb-2">Content</p>
        <h1 className="text-3xl font-serif text-[#2d2d2d]">Location</h1>
      </div>

      <section className="bg-white rounded-lg border border-[#e8e4dd] p-6 space-y-4">
        <h2 className="font-serif text-xl text-[#2d2d2d]">Section content</h2>
        <div><Label>Heading</Label><Input value={settings.heading} onChange={(e) => setSettings({ ...settings, heading: e.target.value })} /></div>
        <div><Label>Subtitle</Label><Textarea rows={2} value={settings.subtitle ?? ""} onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })} /></div>
        <div><Label>Address</Label><Input value={settings.address ?? ""} onChange={(e) => setSettings({ ...settings, address: e.target.value })} /></div>
        <div><Label>Google Maps link</Label>
          <Textarea rows={3} value={settings.map_embed_url ?? ""}
            placeholder="Paste any Google Maps link, share URL, or full <iframe> embed code"
            onChange={(e) => setSettings({ ...settings, map_embed_url: e.target.value })} />
          <p className="text-xs text-[#8b7355] mt-1">
            Paste anything — a Google Maps share link (maps.app.goo.gl/...), a place URL,
            the full &lt;iframe&gt; embed code, or even a plain address. The map on the
            home page updates automatically.
          </p>
        </div>
        <div><Label>"Get Directions" link</Label>
          <Input value={settings.directions_url ?? ""} placeholder="https://www.google.com/maps/..."
            onChange={(e) => setSettings({ ...settings, directions_url: e.target.value })} /></div>
        <Button onClick={() => saveSettingsMut.mutate()} disabled={saveSettingsMut.isPending}
          className="bg-[#8b7355] hover:bg-[#6b5a44] text-white">
          {saveSettingsMut.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} Save location
        </Button>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-[#2d2d2d]">Nearby landmarks</h2>
          <Button onClick={() => setEditing({ sort_order: (data.landmarks.at(-1)?.sort_order ?? 0) + 10, icon_key: "MapPin" })}
            className="bg-[#8b7355] hover:bg-[#6b5a44] text-white">
            <Plus className="h-4 w-4 mr-2" /> Add landmark
          </Button>
        </div>
        <div className="grid gap-3">
          {data.landmarks.map((row) => (
            <div key={row.id} className="bg-white rounded-lg border border-[#e8e4dd] p-4 flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-[#2d2d2d]">{row.label}</h3>
                  {row.travel_time && <span className="text-xs px-1.5 py-0.5 rounded bg-[#f0ebe3] text-[#5c4d3c]">{row.travel_time}</span>}
                  <span className="text-xs text-[#8b7355]">#{row.sort_order}</span>
                </div>
                <div className="text-xs text-[#8b7355] mt-1">Icon: {row.icon_key}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => setEditing(row)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => { if (confirm("Delete?")) delMut.mutate(row); }} className="text-[#b91c1c] hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          {data.landmarks.length === 0 && (
            <div className="rounded-lg border border-dashed border-[#e8e4dd] p-10 text-center text-[#8b7355]">No landmarks yet.</div>
          )}
        </div>
      </section>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-serif">{editing?.id ? "Edit landmark" : "New landmark"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Label</Label><Input value={editing.label ?? ""} onChange={(e) => setEditing({ ...editing, label: e.target.value })} /></div>
              <div><Label>Travel time</Label><Input value={editing.travel_time ?? ""} placeholder="10 min" onChange={(e) => setEditing({ ...editing, travel_time: e.target.value })} /></div>
              <div>
                <Label>Icon</Label>
                <Select value={editing.icon_key ?? "MapPin"} onValueChange={(v) => setEditing({ ...editing, icon_key: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ICON_KEYS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Sort order</Label><Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => editing && saveMut.mutate(editing)}
              disabled={!editing?.label || saveMut.isPending}
              className="bg-[#8b7355] hover:bg-[#6b5a44] text-white">
              {saveMut.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
