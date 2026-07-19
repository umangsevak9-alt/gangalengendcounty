import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense } from "react";
import { getMyRoles } from "@/lib/auth.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShieldCheck, PencilLine, LogOut, Home, FileText, Users, Image, MapPin, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard · Ganga Legend County" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Suspense fallback={<div className="p-8 text-[#5c4d3c]">Loading…</div>}>
        <Dashboard />
      </Suspense>
    </div>
  );
}

function Dashboard() {
  const fetchRoles = useServerFn(getMyRoles);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: me } = useSuspenseQuery({
    queryKey: ["me", "roles"],
    queryFn: () => fetchRoles(),
  });

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };

  if (me.roles.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-6">
        <div className="bg-white border border-[#e8e4dd] rounded-lg p-8 text-center">
          <ShieldCheck className="h-10 w-10 mx-auto text-[#8b7355] mb-4" />
          <h1 className="text-2xl font-serif text-[#2d2d2d]">No role assigned</h1>
          <p className="mt-2 text-sm text-[#5c4d3c]">
            Your account ({me.email}) exists but has not been granted admin or editor access yet.
            Contact a workspace administrator to assign a role.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild variant="outline">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" /> Return home
              </Link>
            </Button>
            <Button onClick={handleSignOut} className="bg-[#8b7355] hover:bg-[#6b5a44] text-white">
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const sections = [
    { icon: FileText, title: "Hero & Copy", desc: "Headline, subhead, CTAs", editorOk: true },
    { icon: Image, title: "Gallery", desc: "Upload & reorder images", editorOk: true },
    { icon: FileText, title: "Towers & Floor Plans", desc: "Aarambh, Udaan, Samarasya, Jeevanam", editorOk: true },
    { icon: MapPin, title: "Location & Connectivity", desc: "Distances, map, POIs", editorOk: true },
    { icon: HelpCircle, title: "FAQs & Specifications", desc: "Buyer questions & fittings", editorOk: true },
    { icon: Users, title: "Leads", desc: "Enquiries & export", editorOk: true },
    { icon: ShieldCheck, title: "Users & Roles", desc: "Invite admins and editors", editorOk: false },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <header className="flex items-start justify-between gap-4 mb-10">
        <div className="min-w-0">
          <p className="eyebrow mb-2">Admin Panel</p>
          <h1 className="text-3xl md:text-4xl font-serif text-[#2d2d2d]">Ganga Legend County CMS</h1>
          <p className="mt-2 text-sm text-[#5c4d3c] flex flex-wrap items-center gap-2">
            <span>{me.email}</span>
            <span className="text-[#c9b99a]">·</span>
            {me.isAdmin ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#2d2d2d] text-white text-xs">
                <ShieldCheck className="h-3 w-3" /> Admin
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#c9b99a] text-[#2d2d2d] text-xs">
                <PencilLine className="h-3 w-3" /> Editor
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button asChild variant="outline" size="sm">
            <Link to="/"><Home className="h-4 w-4 mr-2" />View site</Link>
          </Button>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => {
          const locked = !s.editorOk && !me.isAdmin;
          return (
            <div
              key={s.title}
              className={`bg-white border border-[#e8e4dd] rounded-lg p-5 transition ${
                locked ? "opacity-50" : "hover:shadow-md hover:border-[#c9b99a] cursor-pointer"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded bg-[#f0ebe3] grid place-items-center shrink-0">
                  <s.icon className="h-5 w-5 text-[#8b7355]" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-lg text-[#2d2d2d]">{s.title}</h3>
                  <p className="text-sm text-[#5c4d3c] mt-1">{s.desc}</p>
                  {locked && (
                    <p className="text-xs text-[#b91c1c] mt-2">Admin only</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 p-5 bg-[#f0ebe3] rounded-lg border border-[#e8e4dd]">
        <p className="text-sm text-[#5c4d3c]">
          <strong className="text-[#2d2d2d]">Next step:</strong> CMS editors for each section
          will be wired here. Role gating (admin vs editor) is already enforced server-side —
          adding UI won't compromise it.
        </p>
      </div>
    </div>
  );
}
