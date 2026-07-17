import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { aiSummarize, aiLessonPlan, aiWorksheet, aiRubric } from "@/lib/ai.functions";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText, BookOpen, ClipboardList, Ruler, Loader2, Copy, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/ai-tools")({
  component: AiToolsHub,
});

type ToolKey = "summary" | "lesson" | "worksheet" | "rubric";

const TOOLS: {
  key: ToolKey;
  title: string;
  desc: string;
  icon: React.ReactNode;
  accent: string;
}[] = [
  { key: "summary", title: "Summarizer", desc: "Turn any text into student-ready takeaways + questions.", icon: <FileText className="h-5 w-5" />, accent: "bg-primary text-primary-foreground" },
  { key: "lesson", title: "Lesson plan", desc: "Objective, flow, differentiation, exit ticket — in seconds.", icon: <BookOpen className="h-5 w-5" />, accent: "bg-warm text-warm-foreground" },
  { key: "worksheet", title: "Worksheet", desc: "Printable, mixed-format items with an answer key.", icon: <ClipboardList className="h-5 w-5" />, accent: "bg-accent text-accent-foreground" },
  { key: "rubric", title: "Rubric drafter", desc: "Analytic rubric with observable, student-friendly language.", icon: <Ruler className="h-5 w-5" />, accent: "bg-secondary text-secondary-foreground" },
];

function AiToolsHub() {
  const [active, setActive] = useState<ToolKey>("summary");
  return (
    <div>
      <div>
        <h1 className="font-display text-3xl font-bold text-primary">AI tools</h1>
        <p className="mt-1 text-muted-foreground">Teacher-first generators powered by Lovable AI.</p>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`card-surface p-4 text-left transition ${active === t.key ? "ring-2 ring-primary" : "hover:bg-muted/40"}`}
          >
            <span className={`inline-grid h-9 w-9 place-items-center rounded-md ${t.accent}`}>{t.icon}</span>
            <h3 className="mt-3 font-display text-base font-semibold text-primary">{t.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
          </button>
        ))}
      </div>

      <div className="mt-8">
        {active === "summary" && <SummaryTool />}
        {active === "lesson" && <LessonTool />}
        {active === "worksheet" && <WorksheetTool />}
        {active === "rubric" && <RubricTool />}
      </div>
    </div>
  );
}

function ToolShell({
  loading,
  onRun,
  onReset,
  result,
  children,
  runLabel = "Generate",
}: {
  loading: boolean;
  onRun: () => void;
  onReset: () => void;
  result: string | null;
  children: React.ReactNode;
  runLabel?: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <div className="card-surface p-5 space-y-3">
        {children}
        <div className="flex gap-2 pt-2">
          <button
            onClick={onRun}
            disabled={loading}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Working…</> : runLabel}
          </button>
          {result && (
            <button
              onClick={onReset}
              className="inline-flex h-10 items-center gap-1 rounded-md border border-border px-3 text-sm text-muted-foreground hover:bg-muted"
              title="Retry / clear"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="card-surface min-h-[300px] p-6">
        {result ? (
          <>
            <div className="mb-3 flex justify-end">
              <button
                onClick={() => {
                  void navigator.clipboard.writeText(result);
                  toast.success("Copied Markdown");
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
              >
                <Copy className="h-3 w-3" /> Copy
              </button>
            </div>
            <div className="prose-article">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Result will appear here.</p>
        )}
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</label>;
}
const inputCls = "h-10 w-full rounded-md border border-border bg-surface px-3 text-sm";
const taCls = "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm";

function useRun<T>(fn: (v: T) => Promise<{ markdown: string }>) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  async function run(v: T) {
    setLoading(true);
    try {
      const r = await fn(v);
      setResult(r.markdown);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }
  return { loading, result, run, reset: () => setResult(null) };
}

function SummaryTool() {
  const fn = useServerFn(aiSummarize);
  const [text, setText] = useState("");
  const [audience, setAudience] = useState("middle school students");
  const [length, setLength] = useState<"short" | "medium" | "long">("short");
  const s = useRun((v: { text: string; audience: string; length: "short" | "medium" | "long" }) => fn({ data: v }));
  return (
    <ToolShell loading={s.loading} onRun={() => s.run({ text, audience, length })} onReset={s.reset} result={s.result}>
      <Label>Text to summarize</Label>
      <textarea rows={10} className={taCls} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste an article, chapter, or transcript…" />
      <Label>Audience</Label>
      <input className={inputCls} value={audience} onChange={(e) => setAudience(e.target.value)} />
      <Label>Length</Label>
      <select className={inputCls} value={length} onChange={(e) => setLength(e.target.value as any)}>
        <option value="short">Short</option>
        <option value="medium">Medium</option>
        <option value="long">Long</option>
      </select>
    </ToolShell>
  );
}

function LessonTool() {
  const fn = useServerFn(aiLessonPlan);
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState("Grade 8");
  const [subject, setSubject] = useState("English");
  const [minutes, setMinutes] = useState(45);
  const [standards, setStandards] = useState("");
  const [notes, setNotes] = useState("");
  const s = useRun((v: any) => fn({ data: v }));
  return (
    <ToolShell loading={s.loading} onRun={() => s.run({ topic, grade, subject, minutes, standards, notes })} onReset={s.reset} result={s.result}>
      <Label>Topic</Label>
      <input className={inputCls} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Theme in short stories" />
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Grade</Label><input className={inputCls} value={grade} onChange={(e) => setGrade(e.target.value)} /></div>
        <div><Label>Subject</Label><input className={inputCls} value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
      </div>
      <Label>Minutes</Label>
      <input type="number" className={inputCls} value={minutes} onChange={(e) => setMinutes(parseInt(e.target.value || "45"))} />
      <Label>Standards (optional)</Label>
      <input className={inputCls} value={standards} onChange={(e) => setStandards(e.target.value)} placeholder="CCSS.ELA-LITERACY.RL.8.2" />
      <Label>Teacher notes (optional)</Label>
      <textarea rows={2} className={taCls} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Class size, quirks, IEP notes…" />
    </ToolShell>
  );
}

function WorksheetTool() {
  const fn = useServerFn(aiWorksheet);
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState("Grade 6");
  const [itemCount, setItemCount] = useState(10);
  const [includeAnswerKey, setKey] = useState(true);
  const s = useRun((v: any) => fn({ data: v }));
  return (
    <ToolShell loading={s.loading} onRun={() => s.run({ topic, grade, itemCount, includeAnswerKey })} onReset={s.reset} result={s.result}>
      <Label>Topic</Label>
      <input className={inputCls} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Two-digit multiplication" />
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Grade</Label><input className={inputCls} value={grade} onChange={(e) => setGrade(e.target.value)} /></div>
        <div><Label># of items</Label><input type="number" className={inputCls} value={itemCount} onChange={(e) => setItemCount(parseInt(e.target.value || "10"))} /></div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={includeAnswerKey} onChange={(e) => setKey(e.target.checked)} />
        Include answer key
      </label>
    </ToolShell>
  );
}

function RubricTool() {
  const fn = useServerFn(aiRubric);
  const [task, setTask] = useState("");
  const [grade, setGrade] = useState("Grade 9");
  const [criteria, setCriteria] = useState("Content, Reasoning, Craft, Conventions");
  const [levels, setLevels] = useState(4);
  const s = useRun((v: any) => fn({ data: v }));
  return (
    <ToolShell loading={s.loading} onRun={() => s.run({ task, grade, criteria, levels })} onReset={s.reset} result={s.result}>
      <Label>Task</Label>
      <input className={inputCls} value={task} onChange={(e) => setTask(e.target.value)} placeholder="e.g. Persuasive essay on renewable energy" />
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Grade</Label><input className={inputCls} value={grade} onChange={(e) => setGrade(e.target.value)} /></div>
        <div><Label>Levels</Label><input type="number" min={3} max={5} className={inputCls} value={levels} onChange={(e) => setLevels(parseInt(e.target.value || "4"))} /></div>
      </div>
      <Label>Criteria (comma-separated)</Label>
      <input className={inputCls} value={criteria} onChange={(e) => setCriteria(e.target.value)} />
    </ToolShell>
  );
}
