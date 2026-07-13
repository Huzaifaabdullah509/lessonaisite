import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getPublicArticles, getPublicTools } from "@/lib/content.functions";
import { NewsletterForm } from "@/components/newsletter-form";
import { ArrowRight, BookOpen, Sparkles, Wrench, Shield } from "lucide-react";

const homeArticlesQuery = queryOptions({
  queryKey: ["home-articles"],
  queryFn: () => getPublicArticles({ data: { limit: 6 } }),
});
const homeToolsQuery = queryOptions({
  queryKey: ["home-tools"],
  queryFn: () => getPublicTools({ data: { featured: true } }),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LeasonAI — AI teaching guides, prompts, tools & ethics" },
      {
        name: "description",
        content:
          "Long-form AI guides, prompt libraries, tool reviews, and classroom ethics resources built for teachers.",
      },
      { property: "og:url", content: "https://lessonaisite.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How can teachers use AI in the classroom safely?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Start with low-risk workflows like lesson planning, differentiation, and rubric feedback. Never send student PII to public AI tools, keep humans in the loop for grading, and follow your school's data policy.",
              },
            },
            {
              "@type": "Question",
              name: "What is the best AI tool for teachers in 2026?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "There is no single best tool. Google Gemini and NotebookLM are strong for planning and source-grounded study guides, while Diffit and MagicSchool are purpose-built for classroom differentiation.",
              },
            },
            {
              "@type": "Question",
              name: "Are AI detectors reliable for catching cheating?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. Independent studies show high false-positive rates, especially for English-language learners. Use process-based writing checks (drafts, in-class writing, revision history) instead.",
              },
            },
          ],
        }),
      },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(homeArticlesQuery),
      context.queryClient.ensureQueryData(homeToolsQuery),
    ]);
  },
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <CornerstoneGuides />
      <ToolsShowcase />
      <PillarStrip />
      <NewsletterBand />
      <Outlet />
      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-secondary via-background to-background" />
      <div className="container-page grid gap-10 py-20 md:grid-cols-[1.15fr_1fr] md:py-28">
        <div>
          <span className="eyebrow">
            <Sparkles className="h-3.5 w-3.5" /> AI for educators
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] text-primary md:text-6xl">
            Useful, trustworthy AI guidance for the classroom.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            LeasonAI is a content-rich AI platform for teachers — long-form guides, prompt
            workflows, tool reviews, ethics resources, and a weekly educator brief.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/guides"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Read guides <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/prompts"
              className="inline-flex h-11 items-center rounded-md border border-border bg-surface px-5 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Prompt library
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {["50+ original guides", "20 prompt explainers", "10 tool reviews", "Editorial standards"].map(
              (b) => (
                <span
                  key={b}
                  className="rounded-full border border-border bg-surface px-3 py-1 font-medium"
                >
                  {b}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="card-surface p-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>LeasonAI authority map</span>
            <span className="rounded bg-warm/15 px-2 py-0.5 font-semibold text-warm">Live</span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { title: "AI lesson planning cluster", tag: "Pillar" },
              { title: "Prompt engineering for teachers", tag: "Guide" },
              { title: "AI ethics policy resources", tag: "Trust" },
              { title: "Best AI tools 2026", tag: "Review" },
            ].map((r) => (
              <div
                key={r.title}
                className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
              >
                <span className="text-sm font-medium">{r.title}</span>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {r.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CornerstoneGuides() {
  const { data: articles } = useSuspenseQuery(homeArticlesQuery);
  return (
    <section className="py-20">
      <div className="container-page">
        <div className="mb-10 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">
              <BookOpen className="h-3.5 w-3.5" /> Cornerstone guides
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-primary md:text-4xl">
              Start with the LeasonAI pillars
            </h2>
          </div>
          <Link to="/guides" className="text-sm font-semibold text-accent hover:underline">
            Browse all guides →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 6).map((a) => (
            <Link
              key={a.slug}
              to="/guides/$slug"
              params={{ slug: a.slug }}
              className="card-surface card-surface-hover flex flex-col p-6"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                {a.category}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold text-foreground group-hover:text-primary">
                {a.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{a.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                {a.reading_time_minutes ?? 8} min read →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolsShowcase() {
  const { data: tools } = useSuspenseQuery(homeToolsQuery);
  return (
    <section className="border-y border-border bg-secondary/40 py-20">
      <div className="container-page">
        <div className="mb-10 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <span className="eyebrow">
              <Wrench className="h-3.5 w-3.5" /> Featured AI tools
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-primary md:text-4xl">
              Tools teachers actually use
            </h2>
          </div>
          <Link to="/tools" className="text-sm font-semibold text-accent hover:underline">
            All AI tools →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {tools.slice(0, 4).map((t) => (
            <a
              key={t.slug}
              href={t.url}
              target="_blank"
              rel="noreferrer"
              className="card-surface card-surface-hover flex flex-col p-5"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold text-primary">{t.name}</span>
                <span className="rounded bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                  {t.category}
                </span>
              </div>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{t.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{t.pricing}</span>
                <span className="text-warm">★ {t.rating?.toFixed(1)}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarStrip() {
  const pillars = [
    { icon: BookOpen, title: "Long-form guides", body: "In-depth articles that build classroom AI expertise." },
    { icon: Sparkles, title: "Prompt library", body: "Reusable prompt patterns for planning, feedback, and more." },
    { icon: Wrench, title: "Tool reviews", body: "Teacher-tested reviews scored on value, privacy, and rollout." },
    { icon: Shield, title: "Ethics first", body: "A five-pillar ethics framework and school-ready policy templates." },
  ];
  return (
    <section className="py-20">
      <div className="container-page">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.title} className="card-surface p-6">
              <p.icon className="h-6 w-6 text-accent" />
              <h3 className="mt-4 font-display text-lg font-semibold text-primary">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterBand() {
  return (
    <section className="border-y border-border bg-primary text-primary-foreground">
      <div className="container-page grid gap-6 py-16 md:grid-cols-2 md:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-warm">
            Join the Brief
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
            Weekly teacher AI updates
          </h2>
          <p className="mt-3 max-w-md text-primary-foreground/80">
            One practical prompt, one tool insight, one ethics note, and one classroom workflow each
            week.
          </p>
        </div>
        <NewsletterForm />
      </div>
    </section>
  );
}

