import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getArticleAdmin } from "@/lib/admin.functions";
import { ArticleEditor, emptyDraft, type ArticleDraft } from "@/components/article-editor";

export const Route = createFileRoute("/_authenticated/dashboard/articles/$id/edit")({
  component: EditPage,
});

function EditPage() {
  const { id } = Route.useParams();
  const getFn = useServerFn(getArticleAdmin);
  const q = useQuery({
    queryKey: ["admin-article", id],
    queryFn: () => getFn({ data: { id } }),
  });

  if (q.isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!q.data) return <p className="text-muted-foreground">Not found.</p>;

  const r = q.data;
  const initial: ArticleDraft = {
    id: r.id,
    slug: r.slug ?? "",
    title: r.title ?? "",
    excerpt: r.excerpt ?? "",
    body_md: r.body_md ?? "",
    cover_url: r.cover_url ?? "",
    category: r.category ?? "guides",
    tags: (r.tags ?? []).join(", "),
    reading_time_minutes: r.reading_time_minutes ?? 8,
    seo_title: r.seo_title ?? "",
    seo_description: r.seo_description ?? "",
    status: (r.status ?? "draft") as "draft" | "published",
  };

  return <ArticleEditor initial={initial} key={id} />;
}

// Ensure emptyDraft import doesn't get shaken (keeps tree-shaker happy in unused-imports mode)
void emptyDraft;
