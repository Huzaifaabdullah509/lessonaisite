import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { upsertArticle } from "@/lib/admin.functions";
import { generateSeo } from "@/lib/ai.functions";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Save, Sparkles, Eye, PenLine, CheckCircle2, Loader2 } from "lucide-react";

export type ArticleDraft = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  body_md: string;
  cover_url: string;
  category: string;
  tags: string;
  reading_time_minutes: number;
  seo_title: string;
  seo_description: string;
  status: "draft" | "published";
};

export const emptyDraft: ArticleDraft = {
  slug: "",
  title: "",
  excerpt: "",
  body_md: "",
  cover_url: "",
  category: "guides",
  tags: "",
  reading_time_minutes: 8,
  seo_title: "",
  seo_description: "",
  status: "draft",
};

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function ArticleEditor({ initial }: { initial: ArticleDraft }) {
  const [draft, setDraft] = useState<ArticleDraft>(initial);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [saving, setSaving] = useState(false);
  const [seoLoading, setSeoLoading] = useState(false);
  const [autoState, setAutoState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const navigate = useNavigate();
  const upsert = useServerFn(upsertArticle);
  const seoFn = useServerFn(generateSeo);

  useEffect(() => setDraft(initial), [initial]);

  const update = <K extends keyof ArticleDraft>(k: K, v: ArticleDraft[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  // Autosave: only for existing (edit) drafts; debounce 2s
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSerializedRef = useRef<string>(JSON.stringify(initial));
  useEffect(() => {
    if (!draft.id) return;
    const serialized = JSON.stringify(draft);
    if (serialized === lastSerializedRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setAutoState("saving");
      try {
        await upsert({
          data: {
            id: draft.id,
            slug: draft.slug || slugify(draft.title),
            title: draft.title,
            excerpt: draft.excerpt || null,
            body_md: draft.body_md,
            cover_url: draft.cover_url || null,
            category: draft.category,
            tags: draft.tags.split(",").map((t) => t.trim()).filter(Boolean),
            reading_time_minutes: draft.reading_time_minutes || null,
            seo_title: draft.seo_title || null,
            seo_description: draft.seo_description || null,
            status: draft.status,
          },
        });
        lastSerializedRef.current = serialized;
        setAutoState("saved");
        setLastSavedAt(new Date());
      } catch {
        setAutoState("error");
      }
    }, 2000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [draft, upsert]);


  async function save(publish?: boolean) {
    setSaving(true);
    try {
      const payload = {
        ...(draft.id ? { id: draft.id } : {}),
        slug: draft.slug || slugify(draft.title),
        title: draft.title,
        excerpt: draft.excerpt || null,
        body_md: draft.body_md,
        cover_url: draft.cover_url || null,
        category: draft.category,
        tags: draft.tags.split(",").map((t) => t.trim()).filter(Boolean),
        reading_time_minutes: draft.reading_time_minutes || null,
        seo_title: draft.seo_title || null,
        seo_description: draft.seo_description || null,
        status: publish ? ("published" as const) : draft.status,
      };
      const res = await upsert({ data: payload });
      toast.success(publish ? "Published" : "Saved");
      if (!draft.id) {
        navigate({ to: "/dashboard/articles/$id/edit", params: { id: res.id } });
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function fillSeo() {
    if (!draft.title || !draft.body_md) {
      toast.error("Add a title and body first");
      return;
    }
    setSeoLoading(true);
    try {
      const out = await seoFn({ data: { title: draft.title, body_md: draft.body_md } });
      setDraft((d) => ({
        ...d,
        seo_title: out.seo_title,
        seo_description: out.seo_description,
        excerpt: d.excerpt || out.excerpt,
        tags: d.tags || out.tags.join(", "),
      }));
      toast.success("SEO filled");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setSeoLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">
            {draft.id ? "Edit article" : "New article"}
          </h1>
          <p className="text-sm text-muted-foreground">Markdown editor with live preview</p>
        </div>
        <div className="flex items-center gap-2">
          {draft.id && <AutosaveBadge state={autoState} lastSavedAt={lastSavedAt} />}
          <button
            onClick={fillSeo}
            disabled={seoLoading}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" /> {seoLoading ? "Thinking…" : "AI: Fill SEO"}
          </button>
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> Save draft
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-warm px-4 text-sm font-semibold text-warm-foreground hover:opacity-90 disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card-surface p-5">
          <div className="grid gap-3">
            <input
              value={draft.title}
              onChange={(e) => {
                update("title", e.target.value);
                if (!draft.id && !draft.slug) update("slug", slugify(e.target.value));
              }}
              placeholder="Article title"
              className="h-12 w-full rounded-md border border-border bg-surface px-3 text-lg font-semibold"
            />
            <input
              value={draft.slug}
              onChange={(e) => update("slug", slugify(e.target.value))}
              placeholder="url-slug"
              className="h-10 w-full rounded-md border border-border bg-surface px-3 font-mono text-sm"
            />
            <textarea
              value={draft.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              placeholder="1-2 sentence excerpt"
              rows={2}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-4 flex items-center gap-1 border-b border-border">
            <TabBtn active={tab === "write"} onClick={() => setTab("write")}>
              <PenLine className="h-4 w-4" /> Write
            </TabBtn>
            <TabBtn active={tab === "preview"} onClick={() => setTab("preview")}>
              <Eye className="h-4 w-4" /> Preview
            </TabBtn>
          </div>

          {tab === "write" ? (
            <textarea
              value={draft.body_md}
              onChange={(e) => update("body_md", e.target.value)}
              placeholder="# Start writing your article in Markdown…"
              rows={26}
              className="mt-3 w-full rounded-md border border-border bg-surface px-3 py-3 font-mono text-sm leading-relaxed"
            />
          ) : (
            <div className="prose-article mt-3 max-h-[70vh] overflow-y-auto rounded-md border border-border bg-background p-6">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {draft.body_md || "*Nothing to preview yet.*"}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <Field label="Category">
            <select
              value={draft.category}
              onChange={(e) => update("category", e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm"
            >
              {["guides", "prompts", "tool-reviews", "ethics", "productivity"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Tags (comma-separated)">
            <input
              value={draft.tags}
              onChange={(e) => update("tags", e.target.value)}
              placeholder="ai, teachers"
              className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm"
            />
          </Field>
          <Field label="Cover image URL">
            <input
              value={draft.cover_url}
              onChange={(e) => update("cover_url", e.target.value)}
              placeholder="https://…"
              className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm"
            />
          </Field>
          <Field label="Reading time (min)">
            <input
              type="number"
              value={draft.reading_time_minutes}
              onChange={(e) =>
                update("reading_time_minutes", parseInt(e.target.value || "0") || 0)
              }
              className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm"
            />
          </Field>
          <Field label="SEO title">
            <input
              value={draft.seo_title}
              onChange={(e) => update("seo_title", e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm"
            />
          </Field>
          <Field label="SEO description">
            <textarea
              value={draft.seo_description}
              onChange={(e) => update("seo_description", e.target.value)}
              rows={3}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Status">
            <select
              value={draft.status}
              onChange={(e) => update("status", e.target.value as "draft" | "published")}
              className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function TabBtn({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px flex items-center gap-1 border-b-2 px-3 py-2 text-sm font-medium ${
        active
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function AutosaveBadge({
  state,
  lastSavedAt,
}: {
  state: "idle" | "saving" | "saved" | "error";
  lastSavedAt: Date | null;
}) {
  if (state === "idle" && !lastSavedAt) return null;
  const [text, icon, cls] =
    state === "saving"
      ? ["Saving…", <Loader2 key="l" className="h-3.5 w-3.5 animate-spin" />, "text-muted-foreground"]
      : state === "error"
        ? ["Autosave failed", null, "text-destructive"]
        : [
            lastSavedAt ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Saved",
            <CheckCircle2 key="c" className="h-3.5 w-3.5" />,
            "text-accent",
          ];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${cls}`}>
      {icon}
      {text}
    </span>
  );
}
