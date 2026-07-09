import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { checkIsAdmin, listArticlesAdmin } from "@/lib/admin.functions";
import { FileText, Sparkles, PlusCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: Overview,
});

function Overview() {
  const check = useServerFn(checkIsAdmin);
  const list = useServerFn(listArticlesAdmin);
  const admin = useQuery({ queryKey: ["is-admin"], queryFn: () => check() });
  const articles = useQuery({
    queryKey: ["admin-articles"],
    queryFn: () => list(),
    enabled: admin.data?.isAdmin === true,
  });

  if (!admin.data) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  if (!admin.data.isAdmin) {
    return (
      <div className="card-surface p-8 text-center">
        <h1 className="font-display text-2xl font-bold text-primary">Welcome</h1>
        <p className="mt-2 text-muted-foreground">
          Your account isn't an admin yet. Ask an existing admin to grant you the role, or contact
          support.
        </p>
      </div>
    );
  }

  const rows = articles.data ?? [];
  const published = rows.filter((r) => r.status === "published").length;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-primary">Overview</h1>
      <p className="mt-1 text-muted-foreground">
        Manage guides, generate AI drafts, and keep the LeasonAI library fresh.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Stat label="Total articles" value={rows.length} />
        <Stat label="Published" value={published} />
        <Stat label="Drafts" value={rows.length - published} />
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Link
          to="/dashboard/articles/new"
          className="card-surface card-surface-hover flex items-start gap-3 p-5"
        >
          <span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground">
            <PlusCircle className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display font-semibold text-primary">New article</h3>
            <p className="text-sm text-muted-foreground">Start from a blank editor.</p>
          </div>
        </Link>
        <Link
          to="/dashboard/ai-draft"
          className="card-surface card-surface-hover flex items-start gap-3 p-5"
        >
          <span className="grid h-10 w-10 place-items-center rounded-md bg-warm text-warm-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display font-semibold text-primary">Generate with AI (Gemini)</h3>
            <p className="text-sm text-muted-foreground">
              Draft a full guide from a topic idea.
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-primary">Recent articles</h2>
          <Link to="/dashboard/articles" className="text-sm font-semibold text-accent hover:underline">
            View all →
          </Link>
        </div>
        <div className="card-surface divide-y divide-border">
          {rows.slice(0, 8).map((r) => (
            <Link
              key={r.id}
              to="/dashboard/articles/$id/edit"
              params={{ id: r.id }}
              className="flex items-center justify-between p-4 hover:bg-muted"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.category}</p>
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  r.status === "published"
                    ? "bg-accent/15 text-accent"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {r.status}
              </span>
            </Link>
          ))}
          {rows.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">No articles yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card-surface p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold text-primary">{value}</p>
    </div>
  );
}
