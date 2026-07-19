import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Mail, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Sign In · Ganga Legend County" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Signed in");
      navigate({ to: "/admin", replace: true });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: { full_name: fullName },
        },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Account created — signing you in…");
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signInErr) return toast.error(signInErr.message);
      navigate({ to: "/admin", replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#5c4d3c] hover:text-[#2d2d2d] mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
        <div className="bg-white rounded-lg border border-[#e8e4dd] shadow-sm p-8">
          <div className="mb-6">
            <p className="eyebrow mb-2">Admin Access</p>
            <h1 className="text-3xl font-serif text-[#2d2d2d]">
              {mode === "signin" ? "Sign in" : "Create account"}
            </h1>
            <p className="mt-2 text-sm text-[#5c4d3c]">
              {mode === "signin"
                ? "Restricted to authorised administrators and editors."
                : "New accounts have no permissions until an admin assigns a role."}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1"
                  placeholder="Priya Sharma"
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b7355]" />
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b7355]" />
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  placeholder="At least 8 characters"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8b7355] hover:bg-[#6b5a44] text-white"
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-6 text-xs text-[#8b7355] hover:text-[#2d2d2d] w-full text-center"
          >
            {mode === "signin"
              ? "First time here? Create an admin account →"
              : "Already registered? Sign in →"}
          </button>
        </div>
      </div>
    </div>
  );
}
