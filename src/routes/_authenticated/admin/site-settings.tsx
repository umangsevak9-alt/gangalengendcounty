import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense, useState, useEffect } from "react";
import { getSiteSettingsAdmin, upsertSiteSettings } from "@/lib/cms-admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";


export const Route = createFileRoute("/_authenticated/admin/site-settings")({
  head: () => ({ meta: [{ title: "Site Settings · Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Suspense fallback={<div className="p-8 text-[#525252]">Loading…</div>}><Page /></Suspense>
    </div>
  ),
});

type Settings = {
  id?: string;
  brand_name: string; brand_code: string; developer: string; partner: string;
  location: string; rera: string; phone: string; whatsapp: string; email: string;
  whatsapp_message: string;
  hero_image_path: string | null;
};

const empty: Settings = {
  brand_name: "", brand_code: "", developer: "", partner: "", location: "",
  rera: "", phone: "", whatsapp: "", email: "", whatsapp_message: "",
  hero_image_path: null,
};


function Page() {
  const load = useServerFn(getSiteSettingsAdmin);
  const save = useServerFn(upsertSiteSettings);
  const qc = useQueryClient();
  const { data } = useSuspenseQuery({ queryKey: ["admin", "site-settings"], queryFn: () => load() });
  const [form, setForm] = useState<Settings>(data ? { ...empty, ...data } : empty);

  useEffect(() => { if (data) setForm({ ...empty, ...data }); }, [data]);

  const mut = useMutation({
    mutationFn: () => save({ data: form }),
    onSuccess: () => {
      toast.success("Site settings saved");
      qc.invalidateQueries({ queryKey: ["admin", "site-settings"] });
      qc.invalidateQueries({ queryKey: ["public", "site-settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-[#525252] hover:text-[#0a0a0a] mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to admin
      </Link>
      <div className="mb-8">
        <p className="eyebrow mb-2">Global</p>
        <h1 className="text-3xl font-serif text-[#0a0a0a]">Site Settings</h1>
        <p className="text-sm text-[#525252] mt-1">
          Change website name, contact numbers, WhatsApp and other brand details. Updates reflect everywhere on the site.
        </p>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-lg p-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Website name</Label><Input value={form.brand_name} onChange={(e) => set("brand_name", e.target.value)} placeholder="Ganga Legend County" /></div>
          <div><Label>Project code / tagline</Label><Input value={form.brand_code} onChange={(e) => set("brand_code", e.target.value)} placeholder="Nova One" /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Developer</Label><Input value={form.developer} onChange={(e) => set("developer", e.target.value)} placeholder="Goel Ganga Corporation" /></div>
          <div><Label>Partner</Label><Input value={form.partner} onChange={(e) => set("partner", e.target.value)} placeholder="Unicon Group" /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Location</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Pune, India" /></div>
          <div><Label>RERA text</Label><Input value={form.rera} onChange={(e) => set("rera", e.target.value)} placeholder="RERA Approved" /></div>
        </div>

        <div className="pt-4 border-t border-[#e5e5e5]">
          <h2 className="font-serif text-lg text-[#0a0a0a] mb-1">Hero image</h2>
          <p className="text-[11px] text-[#737373] mb-3">Main photo shown at the top of the homepage. Upload a high-quality landscape image (recommended 1920×1080 or larger). Leave empty to use the default.</p>
          <MediaUpload
            value={form.hero_image_path}
            onChange={(p) => set("hero_image_path", p)}
            folder="hero"
            accept="image/*"
            label="Upload hero image"
          />
        </div>

        <div className="pt-4 border-t border-[#e5e5e5]">

          <h2 className="font-serif text-lg text-[#0a0a0a] mb-3">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Call number</Label>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98220 00000" />
              <p className="text-[11px] text-[#737373] mt-1">Displayed on site. Used for the Call button.</p>
            </div>
            <div>
              <Label>WhatsApp number</Label>
              <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="919822000000" />
              <p className="text-[11px] text-[#737373] mt-1">Only digits with country code, e.g. 919822000000.</p>
            </div>
          </div>
          <div className="mt-4">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="sales@example.com" />
          </div>
          <div className="mt-4">
            <Label>WhatsApp default message</Label>
            <Textarea rows={3} value={form.whatsapp_message} onChange={(e) => set("whatsapp_message", e.target.value)} placeholder="Hi, I am interested in Nova One..." />
            <p className="text-[11px] text-[#737373] mt-1">Pre-filled when a visitor taps the WhatsApp button.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#e5e5e5] flex justify-end">
          <Button onClick={() => mut.mutate()} disabled={!form.brand_name || mut.isPending}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
            {mut.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
