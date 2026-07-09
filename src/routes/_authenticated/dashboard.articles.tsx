import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listArticlesAdmin, deleteArticle } from "@/lib/admin.functions";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/articles")({
  component: ArticlesList,
});

function ArticlesList() {
  const qc = useQueryClient();
  const list = useServerFn(listArticlesAdmin);
  const del = useServerFn(deleteArticle);
  const q = useQuery({ queryKey: ["admin-articles"], queryFn: () => list() });

  async function handleDelete(id: string) {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    try {
      await del({ data: { id } });
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-articles"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  const rows = q.data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Articles</h1>
          <p className="mt-1 text-muted-foreground">All drafts and published guides.</p>
        </div>
        <Link
          to="/dashboard/articles/new"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          <PlusCircle className="h-4 w-4" /> New article
        </Link>
      </div>

      <div className="card-surface mt-8 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3">
                  <Link
                    to="/dashboard/articles/$id/edit"
                    params={{ id: r.id }}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {r.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">/{r.slug}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{r.category}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      r.status === "published"
                        ? "bg-accent/15 text-accent"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(r.updated_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-destructive hover:opacity-80"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No articles yet — start with{" "}
                  <Link to="/dashboard/articles/new" className="text-accent underline">
                    a new one
                  </Link>{" "}
                  or the{" "}
                  <Link to="/dashboard/ai-draft" className="text-accent underline">
                    AI generator
                  </Link>
                  .
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
