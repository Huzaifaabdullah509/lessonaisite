import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Plug, RefreshCw, Copy, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { listMcpConnections } from "@/lib/mcp-admin.functions";
import { toolCatalog } from "@/lib/mcp/registry";

export const Route = createFileRoute("/_authenticated/dashboard/mcp-connections")({
  head: () => ({
    meta: [{ title: "Agent connections — LeasonAI" }, { name: "robots", content: "noindex" }],
  }),
  component: McpConnectionsPage,
});

function McpConnectionsPage() {
  const fetchConnections = useServerFn(listMcpConnections);
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["mcp-connections"],
    queryFn: () => fetchConnections({ data: {} }),
  });

  const serverUrl =
    typeof window !== "undefined" ? `${window.location.origin}/mcp` : "https://lessonaisite.lovable.app/mcp";
  const connections = data?.connections ?? [];

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Agent connections</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect an AI assistant to LeasonAI and see which clients have used your account.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm hover:bg-muted"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      <div className="card-surface mt-6 p-5">
        <h2 className="font-display text-lg font-semibold">Server details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste this URL into any MCP-compatible assistant. It will open a LeasonAI sign-in screen and
          then ask you to approve access.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <code className="rounded-md bg-muted px-3 py-2 text-sm">{serverUrl}</code>
          <button
            onClick={() => copy(serverUrl)}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm hover:bg-muted"
          >
            <Copy className="h-4 w-4" /> Copy
          </button>
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-md bg-primary/5 p-3 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>
            Assistants act as {data?.email ?? "you"} — they can only read and write what your account is
            allowed to. Every call is recorded in the audit log. Revoke access any time by signing out of
            the assistant or removing the connection there.
          </p>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {toolCatalog.length} tools are exposed. Read the{" "}
          <a href="/agent-tools" className="text-accent hover:underline">
            tools documentation
          </a>{" "}
          for examples.
        </p>
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold text-primary">Recent clients</h2>
      <div className="card-surface mt-3 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Client</th>
              <th className="p-3">Source</th>
              <th className="p-3">Calls</th>
              <th className="p-3">Errors</th>
              <th className="p-3">Last used</th>
              <th className="p-3">Tools used</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && !connections.length && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  <Plug className="mx-auto mb-2 h-6 w-6" />
                  No assistant has connected yet. Copy the server URL above to get started.
                </td>
              </tr>
            )}
            {connections.map((c) => (
              <tr key={c.client_id} className="border-b border-border/60 last:border-0">
                <td className="p-3 font-medium">{c.client_id}</td>
                <td className="p-3 text-muted-foreground">
                  {c.source === "playground" ? "In-app playground" : "External MCP client"}
                </td>
                <td className="p-3">{c.calls}</td>
                <td className="p-3">
                  <span className={c.errors ? "text-destructive" : "text-muted-foreground"}>
                    {c.errors}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">
                  {new Date(c.last_used).toLocaleString()}
                </td>
                <td className="p-3 text-muted-foreground">{c.tools.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
