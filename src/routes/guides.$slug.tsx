import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { getArticleBySlug } from "@/lib/content.functions";

const articleQuery = (slug: string) =>
  queryOptions({
    queryKey: ["article", slug],
    queryFn: () => getArticleBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/guides/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(articleQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Guide not found — LeasonAI" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = loaderData.seo_title ?? `${loaderData.title} — LeasonAI`;
    const description = loaderData.seo_description ?? loaderData.excerpt ?? "";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        ...(loaderData.cover_url
          ? [{ property: "og:image", content: loaderData.cover_url }]
          : []),
      ],
    };
  },
  component: ArticlePage,
  notFoundComponent: () => (
    <>
      <SiteHeader />
      <main className="container-page py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-primary">Guide not found</h1>
        <p className="mt-3 text-muted-foreground">This guide may have been moved or removed.</p>
      </main>
      <SiteFooter />
    </>
  ),
  errorComponent: ({ error }) => (
    <>
      <SiteHeader />
      <main className="container-page py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-primary">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">{error.message}</p>
      </main>
      <SiteFooter />
    </>
  ),
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(articleQuery(slug));
  if (!data) return null;

  return (
    <>
      <SiteHeader />
      <article className="container-page max-w-3xl py-16">
        <span className="eyebrow">{data.category}</span>
        <h1 className="mt-2 font-display text-4xl font-bold leading-tight text-primary md:text-5xl">
          {data.title}
        </h1>
        {data.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground">{data.excerpt}</p>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {data.published_at && (
            <span>{new Date(data.published_at).toLocaleDateString()}</span>
          )}
          {data.reading_time_minutes && <span>· {data.reading_time_minutes} min read</span>}
          {data.tags?.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-surface px-2 py-0.5"
            >
              #{t}
            </span>
          ))}
        </div>
        {data.cover_url && (
          <img
            src={data.cover_url}
            alt=""
            className="mt-8 aspect-[16/8] w-full rounded-xl object-cover"
          />
        )}
        <div className="prose-article mt-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.body_md}</ReactMarkdown>
        </div>
      </article>
      <SiteFooter />
    </>
  );
}
