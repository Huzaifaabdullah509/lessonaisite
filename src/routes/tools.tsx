import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { getPublicTools } from "@/lib/content.functions";
import { ExternalLink } from "lucide-react";

const query = queryOptions({
  queryKey: ["all-tools"],
  queryFn: () => getPublicTools({ data: {} }),
});

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "AI Tools Directory for Teachers — LeasonAI" },
      {
        name: "description",
        content:
          "Categorized AI tools for teachers: writing, image, productivity, education, research — with pricing and ratings.",
      },
      { property: "og:title", content: "AI Tools Directory — LeasonAI" },
      { property: "og:description", content: "Categorized AI tools for teachers." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(query),
  component: ToolsPage,
});

function ToolsPage() {
  const { data: tools } = useSuspenseQuery(query);
  const categories = ["All", ...Array.from(new Set(tools.map((t) => t.category)))];
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? tools : tools.filter((t) => t.category === active);

  return (
    <>
      <SiteHeader />
      <main className="container-page py-16">
        <span className="eyebrow">AI tools directory</span>
        <h1 className="mt-2 font-display text-4xl font-bold text-primary md:text-5xl">
          AI tools teachers actually use
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Reviewed for instructional value, privacy, and rollout effort.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                active === c
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-surface text-foreground hover:bg-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <a
              key={t.id}
              href={t.url}
              target="_blank"
              rel="noreferrer"
              className="card-surface card-surface-hover flex flex-col p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-primary">{t.name}</h2>
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {t.category}
                  </span>
                </div>
                {t.featured && (
                  <span className="rounded bg-warm/15 px-2 py-0.5 text-xs font-semibold text-warm">
                    Featured
                  </span>
                )}
              </div>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{t.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{t.pricing}</span>
                <span className="flex items-center gap-1 text-warm">★ {t.rating?.toFixed(1)}</span>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent">
                Visit tool <ExternalLink className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
