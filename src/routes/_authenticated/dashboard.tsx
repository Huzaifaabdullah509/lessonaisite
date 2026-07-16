import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LayoutDashboard, FileText, Sparkles, LogOut, ExternalLink, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — LeasonAI" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-border bg-surface p-4 md:block">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-primary">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          LeasonAI
        </Link>
        <nav className="mt-8 space-y-1">
          <NavItem to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />} label="Overview" />
          <NavItem to="/dashboard/articles" icon={<FileText className="h-4 w-4" />} label="Articles" />
          <NavItem to="/dashboard/ai-draft" icon={<Sparkles className="h-4 w-4" />} label="AI draft" />
          <NavItem to="/dashboard/users" icon={<Users className="h-4 w-4" />} label="Users" />
        </nav>

        <div className="absolute inset-x-4 bottom-4 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            <ExternalLink className="h-4 w-4" /> View site
          </Link>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
          {email && (
            <p className="truncate px-3 text-xs text-muted-foreground" title={email}>
              {email}
            </p>
          )}
        </div>
      </aside>

      <main className="md:pl-60">
        <div className="container-page py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavItem({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
      activeProps={{ className: "bg-primary/10 text-primary" }}
      activeOptions={{ exact: to === "/dashboard" }}
    >
      {icon} {label}
    </Link>
  );
}
