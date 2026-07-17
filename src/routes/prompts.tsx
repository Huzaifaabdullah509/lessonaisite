import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { getPublicPrompts } from "@/lib/content.functions";
import {
  Copy,
  Search,
  Sparkles,
  BookOpen,
  MessageSquare,
  ClipboardCheck,
  Users,
  Layers,
  ShieldCheck,
  Timer,
  MessagesSquare,
  PenLine,
  Play,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

const query = queryOptions({
  queryKey: ["all-prompts"],
  queryFn: () => getPublicPrompts(),
});

export const Route = createFileRoute("/prompts")({
  head: () => ({
    meta: [
      { title: "The Teacher Prompt Library — 30+ AI Prompts | LeasonAI" },
      {
        name: "description",
        content:
          "A visual, copy-and-adapt library of AI prompts for lesson planning, feedback, assessment, communication, and classroom management. Free for teachers.",
      },
      { property: "og:title", content: "The Teacher Prompt Library — LeasonAI" },
      {
        property: "og:description",
        content: "30+ tested ChatGPT & Gemini prompts for real classroom work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(query),
  component: PromptsPage,
});

const CATEGORY_META: Record<
  string,
  { icon: React.ReactNode; blurb: string; tint: string }
> = {
  "Lesson Planning": {
    icon: <BookOpen className="h-5 w-5" />,
    blurb: "Skeleton units, bell-ringers, and sub plans.",
    tint: "bg-primary text-primary-foreground",
  },
  Feedback: {
    icon: <PenLine className="h-5 w-5" />,
    blurb: "Rubric-anchored feedback that respects student voice.",
    tint: "bg-warm text-warm-foreground",
  },
  Assessment: {
    icon: <ClipboardCheck className="h-5 w-5" />,
    blurb: "Balanced quizzes, rubrics, and CFUs.",
    tint: "bg-accent text-accent-foreground",
  },
  Communication: {
    icon: <MessageSquare className="h-5 w-5" />,
    blurb: "Parent emails, IEP notes, translations.",
    tint: "bg-secondary text-secondary-foreground",
  },
  Differentiation: {
    icon: <Layers className="h-5 w-5" />,
    blurb: "Tiered texts, EL scaffolds, choice boards.",
    tint: "bg-primary text-primary-foreground",
  },
  "Classroom Management": {
    icon: <ShieldCheck className="h-5 w-5" />,
    blurb: "Procedures, seating, restorative talks.",
    tint: "bg-warm text-warm-foreground",
  },
  Productivity: {
    icon: <Timer className="h-5 w-5" />,
    blurb: "Meetings, newsletters, PD proposals.",
    tint: "bg-accent text-accent-foreground",
  },
  Discussion: {
    icon: <MessagesSquare className="h-5 w-5" />,
    blurb: "Socratic questions and discussion protocols.",
    tint: "bg-secondary text-secondary-foreground",
  },
  Literacy: {
    icon: <BookOpen className="h-5 w-5" />,
    blurb: "Vocabulary and close-reading question sets.",
    tint: "bg-primary text-primary-foreground",
  },
};

const RESOURCES = [
  {
    kind: "Video",
    title: "Prompt engineering for teachers — a walkthrough",
    href: "https://www.youtube.com/results?search_query=prompt+engineering+for+teachers",
    icon: <Play className="h-4 w-4" />,
  },
  {
    kind: "Video",
    title: "AI for Education — free workshop series",
    href: "https://www.youtube.com/@AIforEducation",
    icon: <Play className="h-4 w-4" />,
  },
  {
    kind: "Site",
    title: "AI for Education prompt library",
    href: "https://www.aiforeducation.io/prompt-library",
    icon: <ExternalLink className="h-4 w-4" />,
  },
  {
    kind: "Site",
    title: "Google for Education — Gemini teacher use-cases",
    href: "https://edu.google.com/intl/ALL_us/for-educators/product-guides/gemini/",
    icon: <ExternalLink className="h-4 w-4" />,
  },
];

function PromptsPage() {
  const { data: prompts } = useSuspenseQuery(query);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of prompts) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [prompts]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return prompts.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (!needle) return true;
      return (
        p.title.toLowerCase().includes(needle) ||
        (p.use_case ?? "").toLowerCase().includes(needle) ||
        p.prompt_text.toLowerCase().includes(needle) ||
        (p.tags ?? []).some((t: string) => t.toLowerCase().includes(needle))
      );
    });
  }, [prompts, q, cat]);

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="border-b border-border bg-gradient-to-br from-secondary/60 via-background to-warm/20">
          <div className="container-page py-16 md:py-20">
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <span className="eyebrow">Prompt library</span>
                <h1 className="mt-2 font-display text-4xl font-bold text-primary md:text-5xl">
                  {prompts.length}+ prompts built for real classrooms
                </h1>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  Every prompt follows the <em>role → context → task → format</em>{" "}
                  pattern so ChatGPT, Gemini, and Claude give you usable output the
                  first time. Copy, paste your details in the [BRACKETS], and go.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search 'rubric', 'parent email', 'EL'…"
                      className="h-12 w-full rounded-md border border-border bg-surface pl-10 pr-3 text-sm shadow-sm"
                    />
                  </div>
                  <a
                    href="#categories"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <Sparkles className="h-4 w-4" /> Browse categories
                  </a>
                </div>

                <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Stat label="prompts" value={prompts.length} />
                  <Stat label="categories" value={categories.length} />
                  <Stat label="free forever" value="✓" />
                </div>
              </div>

              <div className="card-surface hidden overflow-hidden lg:block">
                <div className="border-b border-border bg-muted/40 px-4 py-2 text-xs font-mono text-muted-foreground">
                  prompt.md
                </div>
                <pre className="whitespace-pre-wrap p-5 text-xs leading-relaxed text-foreground">
{`You are an experienced 8th-grade
English teacher.

Plan a 5-day unit on symbolism
for 28 students including 3 ELs
and 2 IEPs.

For each day return: objective,
5-min hook, mini-lesson, guided
practice, exit ticket.

Format as a Markdown table.`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Category filter chips */}
        <section id="categories" className="container-page pt-12">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCat(null)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                cat === null ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-foreground hover:bg-muted"
              }`}
            >
              All ({prompts.length})
            </button>
            {categories.map(([c, n]) => (
              <button
                key={c}
                onClick={() => setCat(c === cat ? null : c)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  cat === c ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-foreground hover:bg-muted"
                }`}
              >
                {c} ({n})
              </button>
            ))}
          </div>
        </section>

        {/* Category tiles when no filter/query */}
        {!q && !cat && (
          <section className="container-page mt-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map(([c, n]) => {
                const meta = CATEGORY_META[c] ?? {
                  icon: <Sparkles className="h-5 w-5" />,
                  blurb: "Curated prompts.",
                  tint: "bg-primary text-primary-foreground",
                };
                return (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className="card-surface group p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className={`inline-grid h-10 w-10 place-items-center rounded-lg ${meta.tint}`}>{meta.icon}</span>
                    <h3 className="mt-3 font-display text-lg font-semibold text-primary">
                      {c}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{meta.blurb}</p>
                    <p className="mt-4 text-xs font-semibold text-accent">
                      {n} prompts →
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Prompt cards */}
        <section className="container-page mt-12 pb-16">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-bold text-primary">
              {cat ?? (q ? "Search results" : "All prompts")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {filtered.length} of {prompts.length}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="card-surface p-10 text-center text-muted-foreground">
              No prompts match — try a different keyword or clear the filter.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((p) => (
                <PromptCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </section>

        {/* Learn resources */}
        <section className="border-t border-border bg-secondary/40">
          <div className="container-page py-14">
            <span className="eyebrow">Go deeper</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-primary">
              Learn to write your own prompts
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Hand-picked videos and libraries from educators who use AI daily.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {RESOURCES.map((r) => (
                <a
                  key={r.href}
                  href={r.href}
                  target="_blank"
                  rel="noreferrer"
                  className="card-surface flex items-center gap-3 p-4 hover:bg-muted/40"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                    {r.icon}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                      {r.kind}
                    </p>
                    <p className="text-sm font-medium text-foreground">{r.title}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container-page py-14">
          <div className="card-surface flex flex-col items-start gap-4 bg-gradient-to-br from-primary/5 via-background to-warm/10 p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-primary">
                Want an AI that already knows your grade?
              </h2>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                Try the AI tools — lesson plans, worksheets, rubrics, and summaries
                pre-tuned for classroom use.
              </p>
            </div>
            <a
              href="/tools"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Users className="h-4 w-4" /> Browse tool reviews
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <span className="rounded-full border border-border bg-surface px-3 py-1">
      <strong className="text-foreground">{value}</strong> {label}
    </span>
  );
}

function PromptCard({ p }: { p: any }) {
  const meta = CATEGORY_META[p.category];
  return (
    <div className="card-surface flex flex-col p-5">
      <div className="flex items-center gap-2">
        <span
          className={`inline-grid h-8 w-8 place-items-center rounded-md ${
            meta?.tint ?? "bg-primary text-primary-foreground"
          }`}
        >
          {meta?.icon ?? <Sparkles className="h-4 w-4" />}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {p.category}
        </span>
      </div>
      <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
        {p.title}
      </h3>
      {p.use_case && (
        <p className="mt-1 text-sm text-muted-foreground">{p.use_case}</p>
      )}
      <pre className="mt-3 max-h-52 overflow-y-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs leading-relaxed text-foreground">
        {p.prompt_text}
      </pre>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-wrap gap-1 text-[10px]">
          {(p.tags ?? []).slice(0, 4).map((t: string) => (
            <span key={t} className="rounded-full border border-border bg-background px-2 py-0.5 text-muted-foreground">
              #{t}
            </span>
          ))}
        </div>
        <button
          onClick={() => {
            void navigator.clipboard.writeText(p.prompt_text);
            toast.success("Copied to clipboard");
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
        >
          <Copy className="h-3 w-3" /> Copy
        </button>
      </div>
    </div>
  );
}
