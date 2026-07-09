import { createFileRoute, Outlet } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { getPublicArticles } from "@/lib/content.functions";

const query = queryOptions({
  queryKey: ["all-articles"],
  queryFn: () => getPublicArticles({ data: { limit: 50 } }),
});

export const Route = createFileRoute("/guides/")({
  head: () => ({
    meta: [
      { title: "Guides — LeasonAI" },
      {
        name: "description",
        content:
          "In-depth teacher-first AI guides on lesson planning, feedback, ethics, tool selection, and classroom workflows.",
      },
      { property: "og:title", content: "AI Guides for Teachers — LeasonAI" },
      { property: "og:description", content: "Long-form guides on using AI in the classroom." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(query),
  component: GuidesIndex,
});

function GuidesIndex() {
  const { data: articles } = useSuspenseQuery(query);
  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return (
    <>
      <SiteHeader />
      <main className="container-page py-16">
        <span className="eyebrow">Guides library</span>
        <h1 className="mt-2 font-display text-4xl font-bold text-primary md:text-5xl">
          Every LeasonAI guide
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Practical, teacher-tested guides for using AI in the classroom.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Link
              key={a.slug}
              to="/guides/$slug"
              params={{ slug: a.slug }}
              className="card-surface card-surface-hover flex flex-col p-6"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                {a.category}
              </span>
              <h2 className="mt-2 font-display text-lg font-semibold text-foreground">
                {a.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{a.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                {a.reading_time_minutes ?? 8} min read →
              </span>
            </Link>
          ))}
          {articles.length === 0 && (
            <p className="text-muted-foreground">No guides published yet.</p>
          )}
        </div>
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
