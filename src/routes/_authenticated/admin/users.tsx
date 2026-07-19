import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Suspense, useState } from "react";
import { listUsers, setUserRole } from "@/lib/users-admin.functions";
import { getMyRoles } from "@/lib/auth.functions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck, PencilLine, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({
    meta: [
      { title: "Users & Roles · Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Suspense fallback={<div className="p-8 text-[#5c4d3c]">Loading…</div>}>
        <UsersInner />
      </Suspense>
    </div>
  );
}

function UsersInner() {
  const fetchMe = useServerFn(getMyRoles);
  const fetchUsers = useServerFn(listUsers);
  const changeRole = useServerFn(setUserRole);
  const qc = useQueryClient();
  const [pending, setPending] = useState<string | null>(null);

  const { data: me } = useSuspenseQuery({ queryKey: ["me", "roles"], queryFn: () => fetchMe() });
  const { data: users } = useSuspenseQuery({ queryKey: ["admin", "users"], queryFn: () => fetchUsers() });

  if (!me.isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-6">
        <div className="bg-white border border-[#e8e4dd] rounded-lg p-8 text-center">
          <h1 className="text-2xl font-serif text-[#2d2d2d]">Admin only</h1>
          <p className="mt-2 text-sm text-[#5c4d3c]">This page is restricted to administrators.</p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/admin"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Link>
          </Button>
        </div>
      </div>
    );
  }

  const toggle = async (userId: string, role: "admin" | "editor", grant: boolean) => {
    const key = `${userId}:${role}`;
    setPending(key);
    try {
      await changeRole({ data: { user_id: userId, role, grant } });
      toast.success(`${grant ? "Granted" : "Removed"} ${role}`);
      await qc.invalidateQueries({ queryKey: ["admin", "users"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <header className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow mb-2">Access Control</p>
          <h1 className="text-3xl md:text-4xl font-serif text-[#2d2d2d]">Users & Roles</h1>
          <p className="mt-2 text-sm text-[#5c4d3c]">
            Grant or revoke admin and editor access. New sign-ups have no role until you approve them here.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/admin"><ArrowLeft className="h-4 w-4 mr-2" /> Dashboard</Link>
        </Button>
      </header>

      <div className="bg-white border border-[#e8e4dd] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f0ebe3] text-[#5c4d3c]">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Roles</th>
                <th className="text-left px-4 py-3 font-medium">Last sign-in</th>
                <th className="text-right px-4 py-3 font-medium">Access</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isAdmin = u.roles.includes("admin");
                const isEditor = u.roles.includes("editor");
                const isSelf = u.id === me.userId;
                return (
                  <tr key={u.id} className="border-t border-[#e8e4dd]">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#2d2d2d]">{u.email ?? "—"}</div>
                      {isSelf && <div className="text-xs text-[#8b7355]">You</div>}
                      {!u.email_confirmed_at && (
                        <div className="text-xs text-amber-700">Email not confirmed</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#2d2d2d] text-white text-xs">
                            <ShieldCheck className="h-3 w-3" /> Admin
                          </span>
                        )}
                        {isEditor && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#c9b99a] text-[#2d2d2d] text-xs">
                            <PencilLine className="h-3 w-3" /> Editor
                          </span>
                        )}
                        {!isAdmin && !isEditor && (
                          <span className="text-xs text-[#8b7355]">No access</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#5c4d3c] whitespace-nowrap">
                      {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end flex-wrap">
                        <RoleBtn
                          label="Admin"
                          active={isAdmin}
                          disabled={pending !== null || (isSelf && isAdmin)}
                          loading={pending === `${u.id}:admin`}
                          onClick={() => toggle(u.id, "admin", !isAdmin)}
                        />
                        <RoleBtn
                          label="Editor"
                          active={isEditor}
                          disabled={pending !== null}
                          loading={pending === `${u.id}:editor`}
                          onClick={() => toggle(u.id, "editor", !isEditor)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[#5c4d3c]">
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-[#8b7355]">
        Admins can manage all content and access. Editors can manage content but cannot grant roles.
      </p>
    </div>
  );
}

function RoleBtn({
  label, active, disabled, loading, onClick,
}: {
  label: string; active: boolean; disabled?: boolean; loading?: boolean; onClick: () => void;
}) {
  return (
    <Button
      size="sm"
      variant={active ? "default" : "outline"}
      disabled={disabled}
      onClick={onClick}
      className={active ? "bg-[#2d2d2d] hover:bg-[#1a1a1a] text-white" : ""}
    >
      {loading && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
      {active ? `Revoke ${label}` : `Grant ${label}`}
    </Button>
  );
}
