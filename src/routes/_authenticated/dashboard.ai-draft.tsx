import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateArticleDraft } from "@/lib/ai.functions";
import { upsertArticle } from "@/lib/admin.functions";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const Route = createFileRoute("/_authenticated/dashboard/ai-draft")({
  component: AiDraftPage,
});

function AiDraftPage() {
  const navigate = useNavigate();
  const generate = useServerFn(generateArticleDraft);
  const upsert = useServerFn(upsertArticle);
  const [topic, setTopic] = useState("");
  const [angle, setAngle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Awaited<ReturnType<typeof generate>> | null>(null);

  async function run() {
    if (topic.length < 3) return;
    setLoading(true);
    setDraft(null);
    try {
      const out = await generate({ data: { topic, angle, targetKeywords: keywords } });
      setDraft(out);
      toast.success("Draft ready — review before saving");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI failed");
    } finally {
      setLoading(false);
    }
  }

  async function saveDraft() {
    if (!draft) return;
    setSaving(true);
    try {
      const res = await upsert({
        data: {
          slug: draft.slug,
          title: draft.title,
          excerpt: draft.excerpt,
          body_md: draft.body_md,
          category: draft.category,
          tags: draft.tags,
          reading_time_minutes: draft.reading_time_minutes,
          seo_title: draft.seo_title,
          seo_description: draft.seo_description,
          status: "draft",
        },
      });
      toast.success("Saved as draft");
      navigate({ to: "/dashboard/articles/$id/edit", params: { id: res.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-warm text-warm-foreground">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">
            AI article generator
          </h1>
          <p className="text-sm text-muted-foreground">
            Powered by Google Gemini via Lovable AI. Drafts land in your editor for review.
          </p>
        </div>
      </div>

      <div className="card-surface mt-6 grid gap-3 p-5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Topic
        </label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Using AI to give feedback on middle school essays"
          className="h-11 rounded-md border border-border bg-surface px-3 text-sm"
        />
        <label className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Angle (optional)
        </label>
        <input
          value={angle}
          onChange={(e) => setAngle(e.target.value)}
          placeholder="Focus on privacy, workflow, or beginner teachers"
          className="h-11 rounded-md border border-border bg-surface px-3 text-sm"
        />
        <label className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Target keywords (optional, comma-separated)
        </label>
        <input
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="ai feedback for teachers, essay grading"
          className="h-11 rounded-md border border-border bg-surface px-3 text-sm"
        />
        <button
          onClick={run}
          disabled={loading || topic.length < 3}
          className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Writing draft…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Generate draft with Gemini
            </>
          )}
        </button>
      </div>

      {draft && (
        <div className="card-surface mt-8 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                {draft.category}
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold text-primary">
                {draft.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">/{draft.slug}</p>
            </div>
            <button
              onClick={saveDraft}
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-warm px-4 text-sm font-semibold text-warm-foreground disabled:opacity-50"
            >
              {saving ? "Saving…" : "Open in editor"}
            </button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{draft.excerpt}</p>
          <div className="mt-3 flex flex-wrap gap-1 text-xs">
            {draft.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-muted px-2 py-0.5"
              >
                #{t}
              </span>
            ))}
          </div>
          <div className="prose-article mt-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft.body_md}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
