import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Play, Clock, CheckCircle2, XCircle } from "lucide-react";
import { runMcpTool } from "@/lib/mcp-admin.functions";
import { toolCatalog } from "@/lib/mcp/registry";

export const Route = createFileRoute("/_authenticated/dashboard/mcp-playground")({
  head: () => ({
    meta: [{ title: "Agent playground — LeasonAI" }, { name: "robots", content: "noindex" }],
  }),
  component: PlaygroundPage,
});

type RunResult = {
  ok: boolean;
  text: string;
  structured: unknown;
  duration_ms: number;
};

function PlaygroundPage() {
  const run = useServerFn(runMcpTool);
  const [tool, setTool] = useState<string>(toolCatalog[0].name);
  const [input, setInput] = useState(JSON.stringify(toolCatalog[0].example, null, 2));
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const entry = toolCatalog.find((t) => t.name === tool)!;

  function pickTool(name: string) {
    setTool(name);
    const next = toolCatalog.find((t) => t.name === name)!;
    setInput(JSON.stringify(next.example, null, 2));
    setResult(null);
    setError(null);
  }

  async function execute() {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const parsed = input.trim() ? JSON.parse(input) : {};
      const res = await run({ data: { tool, input: parsed } });
      setResult(res as RunResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not run this tool");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-primary">Agent playground</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Run any exposed tool as yourself and see exactly what an assistant would get back. Every run is
        recorded in the audit log.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card-surface p-5">
          <label className="text-xs font-medium uppercase text-muted-foreground">Tool</label>
          <select
            value={tool}
            onChange={(e) => pickTool(e.target.value)}
            className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
          >
            {toolCatalog.map((t) => (
              <option key={t.name} value={t.name}>
                {t.title} — {t.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-muted-foreground">{entry.description}</p>

          <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
            {entry.args.map((a) => (
              <li key={a.name}>
                <code className="text-foreground">{a.name}</code>{" "}
                <span className="text-accent">{a.type}</span> — {a.note}
              </li>
            ))}
          </ul>

          <label className="mt-5 block text-xs font-medium uppercase text-muted-foreground">
            Input (JSON)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            spellCheck={false}
            className="mt-2 w-full rounded-md border border-border bg-surface p-3 font-mono text-xs"
          />

          <button
            onClick={execute}
            disabled={busy}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            <Play className="h-4 w-4" /> {busy ? "Running…" : "Run tool"}
          </button>
          {!entry.readOnly && (
            <p className="mt-2 text-xs text-warm-foreground/80">
              This tool writes data. It will create a real draft on your account.
            </p>
          )}
        </div>

        <div className="card-surface p-5">
          <h2 className="font-display text-lg font-semibold">Result</h2>
          {!result && !error && (
            <p className="mt-3 text-sm text-muted-foreground">Run a tool to see the response here.</p>
          )}
          {error && (
            <p className="mt-3 flex items-center gap-2 text-sm text-destructive">
              <XCircle className="h-4 w-4" /> {error}
            </p>
          )}
          {result && (
            <>
              <div className="mt-3 flex items-center gap-4 text-sm">
                <span
                  className={`inline-flex items-center gap-1 ${
                    result.ok ? "text-emerald-600" : "text-destructive"
                  }`}
                >
                  {result.ok ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  {result.ok ? "Success" : "Error"}
                </span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" /> {result.duration_ms} ms
                </span>
              </div>
              <pre className="mt-4 max-h-[420px] overflow-auto rounded-md bg-muted p-3 text-xs">
                {result.text || "(empty response)"}
              </pre>
              {result.structured != null && (
                <pre className="mt-3 max-h-[320px] overflow-auto rounded-md bg-muted p-3 text-xs">
                  {JSON.stringify(result.structured, null, 2)}
                </pre>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
