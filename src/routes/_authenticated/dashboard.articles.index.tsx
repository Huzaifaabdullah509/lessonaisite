import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { listArticlesAdmin, deleteArticle } from "@/lib/admin.functions";
import { PlusCircle, Trash2, Search, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/articles/")({
  component: ArticlesList,
});

type SortKey = "updated_desc" | "updated_asc" | "title_asc" | "published_desc";

function ArticlesList() {
  const qc = useQueryClient();
  const list = useServerFn(listArticlesAdmin);
  const del = useServerFn(deleteArticle);
  const q = useQuery({ queryKey: ["admin-articles"], queryFn: () => list() });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("updated_desc");

  const rows = q.data ?? [];

  const categories = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r: any) => r.category && s.add(r.category));
    return Array.from(s).sort();
  }, [rows]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    let out = rows.filter((r: any) => {
      if (category !== "all" && r.category !== category) return false;
      if (status !== "all" && r.status !== status) return false;
      if (!needle) return true;
      return (
        r.title.toLowerCase().includes(needle) ||
        (r.slug ?? "").toLowerCase().includes(needle)
      );
    });
    out = [...out].sort((a: any, b: any) => {
      switch (sort) {
        case "updated_asc":
          return +new Date(a.updated_at) - +new Date(b.updated_at);
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "published_desc":
          return +new Date(b.published_at ?? 0) - +new Date(a.published_at ?? 0);
        default:
          return +new Date(b.updated_at) - +new Date(a.updated_at);
      }
    });
    return out;
  }, [rows, search, category, status, sort]);

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

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Articles</h1>
          <p className="mt-1 text-muted-foreground">{rows.length} total • {filtered.length} shown</p>
        </div>
        <Link
          to="/dashboard/articles/new"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          <PlusCircle className="h-4 w-4" /> New article
        </Link>
      </div>

      <div className="card-surface mt-6 flex flex-wrap items-center gap-2 p-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or slug…"
            className="h-10 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-sm"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 rounded-md border border-border bg-surface px-3 text-sm"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 rounded-md border border-border bg-surface px-3 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <div className="relative">
          <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-10 rounded-md border border-border bg-surface pl-9 pr-3 text-sm"
          >
            <option value="updated_desc">Recently updated</option>
            <option value="updated_asc">Oldest updated</option>
            <option value="published_desc">Recently published</option>
            <option value="title_asc">Title A–Z</option>
          </select>
        </div>
      </div>

      <div className="card-surface mt-4 overflow-hidden">
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
            {filtered.map((r: any) => (
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No matches. Try clearing filters or{" "}
                  <Link to="/dashboard/articles/new" className="text-accent underline">
                    start a new article
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
