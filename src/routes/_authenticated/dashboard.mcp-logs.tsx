import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { listMcpLogs, type McpLogRow } from "@/lib/mcp-admin.functions";
import { toolCatalog } from "@/lib/mcp/registry";

export const Route = createFileRoute("/_authenticated/dashboard/mcp-logs")({
  head: () => ({
    meta: [{ title: "MCP audit logs — LeasonAI" }, { name: "robots", content: "noindex" }],
  }),
  component: McpLogsPage,
});

function toCsv(rows: McpLogRow[]): string {
  const headers = [
    "created_at",
    "user_email",
    "client_id",
    "source",
    "tool_name",
    "status",
    "duration_ms",
    "error_message",
    "input",
  ];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [
      r.created_at,
      r.user_email,
      r.client_id,
      r.source,
      r.tool_name,
      r.status,
      r.duration_ms,
      r.error_message,
      JSON.stringify(r.input ?? {}),
    ]
      .map(esc)
      .join(","),
  );
  return [headers.join(","), ...lines].join("\n");
}

function McpLogsPage() {
  const fetchLogs = useServerFn(listMcpLogs);
  const [tool, setTool] = useState("");
  const [status, setStatus] = useState<"any" | "success" | "error">("any");
  const [source, setSource] = useState<"any" | "mcp" | "playground">("any");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filters = { tool: tool || undefined, status, source, search: search || undefined,
    from: from ? new Date(from).toISOString() : undefined,
    to: to ? new Date(to + "T23:59:59").toISOString() : undefined, limit: 500 };

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["mcp-logs", filters],
    queryFn: () => fetchLogs({ data: filters }),
  });

  const rows = data?.rows ?? [];
  const stats = useMemo(
    () => ({
      total: rows.length,
      errors: rows.filter((r) => r.status === "error").length,
      avg: rows.length
        ? Math.round(rows.reduce((a, r) => a + (r.duration_ms ?? 0), 0) / rows.length)
        : 0,
    }),
    [rows],
  );

  function exportCsv() {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mcp-audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">MCP audit logs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Who called which agent tool, when, and how it ended.
            {data?.isAdmin ? " You see every account." : " You see your own calls."}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm hover:bg-muted"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button
            onClick={exportCsv}
            disabled={!rows.length}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Calls" value={String(stats.total)} />
        <Stat label="Errors" value={String(stats.errors)} />
        <Stat label="Avg duration" value={`${stats.avg} ms`} />
      </div>

      <div className="card-surface mt-6 grid gap-3 p-4 md:grid-cols-3 lg:grid-cols-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search email, client, error"
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm lg:col-span-2"
        />
        <select
          value={tool}
          onChange={(e) => setTool(e.target.value)}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
        >
          <option value="">All tools</option>
          {toolCatalog.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
        >
          <option value="any">Any outcome</option>
          <option value="success">Success</option>
          <option value="error">Error</option>
        </select>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value as typeof source)}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
        >
          <option value="any">Any source</option>
          <option value="mcp">External MCP client</option>
          <option value="playground">In-app playground</option>
        </select>
        <div className="flex gap-2">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-2 py-2 text-sm"
          />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-md border border-border bg-surface px-2 py-2 text-sm"
          />
        </div>
      </div>

      <div className="card-surface mt-6 overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">When</th>
              <th className="p-3">Caller</th>
              <th className="p-3">Client</th>
              <th className="p-3">Tool</th>
              <th className="p-3">Outcome</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && !rows.length && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted-foreground">
                  No tool calls match these filters yet.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/60 align-top">
                <td className="p-3 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                <td className="p-3">{r.user_email ?? r.user_id.slice(0, 8)}</td>
                <td className="p-3">
                  <span className="rounded bg-muted px-2 py-0.5 text-xs">{r.client_id ?? "—"}</span>
                </td>
                <td className="p-3 font-medium">{r.tool_name}</td>
                <td className="p-3">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      r.status === "error"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-3 whitespace-nowrap">{r.duration_ms ?? "—"} ms</td>
                <td className="max-w-[280px] p-3 text-xs text-muted-foreground">
                  {r.error_message ? (
                    <span className="text-destructive">{r.error_message}</span>
                  ) : (
                    <code className="break-all">{JSON.stringify(r.input ?? {})}</code>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-surface p-4">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}
