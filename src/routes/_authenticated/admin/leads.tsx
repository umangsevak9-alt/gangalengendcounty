import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense } from "react";
import { listLeadsAdmin, deleteLead } from "@/lib/cms-admin.functions";
import { getMyRoles } from "@/lib/auth.functions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Download, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  head: () => ({ meta: [{ title: "Leads · Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => (
    <div className="min-h-screen bg-[#faf8f5]">
      <Suspense fallback={<div className="p-8 text-[#5c4d3c]">Loading…</div>}><Page /></Suspense>
    </div>
  ),
});

type Lead = {
  id: string; name: string; phone: string; email: string | null;
  property_interest: string | null; message: string | null; source: string | null; created_at: string;
};

function csvEscape(v: string | null | undefined) {
  const s = (v ?? "").replaceAll('"', '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}

function downloadCsv(leads: Lead[]) {
  const rows = [
    ["Date", "Name", "Phone", "Email", "Interest", "Message", "Source"].join(","),
    ...leads.map((l) => [
      new Date(l.created_at).toISOString(),
      csvEscape(l.name), csvEscape(l.phone), csvEscape(l.email),
      csvEscape(l.property_interest), csvEscape(l.message), csvEscape(l.source),
    ].join(",")),
  ];
  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function Page() {
  const list = useServerFn(listLeadsAdmin);
  const remove = useServerFn(deleteLead);
  const roles = useServerFn(getMyRoles);
  const qc = useQueryClient();
  const { data } = useSuspenseQuery({ queryKey: ["admin", "leads"], queryFn: () => list() });
  const { data: me } = useSuspenseQuery({ queryKey: ["me", "roles"], queryFn: () => roles() });

  const delMut = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", "leads"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-[#5c4d3c] hover:text-[#2d2d2d] mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to admin
      </Link>
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div>
          <p className="eyebrow mb-2">Contacts</p>
          <h1 className="text-3xl font-serif text-[#2d2d2d]">Leads</h1>
          <p className="text-sm text-[#5c4d3c] mt-1">{data.length} submissions</p>
        </div>
        <Button onClick={() => downloadCsv(data)} disabled={data.length === 0}
          className="bg-[#8b7355] hover:bg-[#6b5a44] text-white">
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#e8e4dd] p-10 text-center text-[#8b7355]">
          No leads yet — submissions from the contact form will show up here.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[#e8e4dd] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f0ebe3] text-[#5c4d3c] text-left">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Interest</th>
                  <th className="p-3">Message</th>
                  {me.isAdmin && <th className="p-3"></th>}
                </tr>
              </thead>
              <tbody>
                {data.map((l) => (
                  <tr key={l.id} className="border-t border-[#e8e4dd] align-top">
                    <td className="p-3 whitespace-nowrap text-[#5c4d3c]">{new Date(l.created_at).toLocaleString()}</td>
                    <td className="p-3 font-medium text-[#2d2d2d]">{l.name}</td>
                    <td className="p-3"><a href={`tel:${l.phone}`} className="text-[#8b7355] hover:underline">{l.phone}</a></td>
                    <td className="p-3">{l.email ? <a href={`mailto:${l.email}`} className="text-[#8b7355] hover:underline">{l.email}</a> : <span className="text-[#8b7355]">—</span>}</td>
                    <td className="p-3">{l.property_interest ?? "—"}</td>
                    <td className="p-3 max-w-xs">{l.message ?? <span className="text-[#8b7355]">—</span>}</td>
                    {me.isAdmin && (
                      <td className="p-3">
                        <Button variant="outline" size="sm" onClick={() => { if (confirm("Delete this lead?")) delMut.mutate(l.id); }}
                          className="text-[#b91c1c] hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
