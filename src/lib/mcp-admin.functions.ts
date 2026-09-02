import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type McpLogRow = {
  id: string;
  created_at: string;
  user_id: string;
  user_email: string | null;
  client_id: string | null;
  source: string;
  tool_name: string;
  status: string;
  duration_ms: number | null;
  error_message: string | null;
  input: Record<string, unknown> | null;
};

const LogFilters = z.object({
  tool: z.string().optional(),
  status: z.enum(["any", "success", "error"]).default("any"),
  source: z.enum(["any", "mcp", "playground"]).default("any"),
  client_id: z.string().optional(),
  search: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  limit: z.number().int().min(1).max(2000).default(200),
});

export const listMcpLogs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => LogFilters.parse(d ?? {}))
  .handler(async ({ data, context }) => {
    const db = context.supabase as any;
    let q = db
      .from("mcp_request_logs")
      .select(
        "id, created_at, user_id, user_email, client_id, source, tool_name, status, duration_ms, error_message, input",
      )
      .order("created_at", { ascending: false })
      .limit(data.limit);

    if (data.tool) q = q.eq("tool_name", data.tool);
    if (data.status !== "any") q = q.eq("status", data.status);
    if (data.source !== "any") q = q.eq("source", data.source);
    if (data.client_id) q = q.eq("client_id", data.client_id);
    if (data.from) q = q.gte("created_at", data.from);
    if (data.to) q = q.lte("created_at", data.to);
    if (data.search)
      q = q.or(
        `user_email.ilike.%${data.search}%,error_message.ilike.%${data.search}%,client_id.ilike.%${data.search}%`,
      );

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);

    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });

    return { rows: (rows ?? []) as McpLogRow[], isAdmin: Boolean(isAdmin) };
  });

export const listMcpConnections = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = context.supabase as any;
    const { data, error } = await db
      .from("mcp_request_logs")
      .select("client_id, source, tool_name, status, created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error(error.message);

    const map = new Map<
      string,
      { client_id: string; source: string; calls: number; errors: number; last_used: string; tools: string[] }
    >();
    for (const row of (data ?? []) as McpLogRow[]) {
      const key = row.client_id ?? "unknown-client";
      const entry =
        map.get(key) ??
        { client_id: key, source: row.source, calls: 0, errors: 0, last_used: row.created_at, tools: [] };
      entry.calls += 1;
      if (row.status === "error") entry.errors += 1;
      if (row.created_at > entry.last_used) entry.last_used = row.created_at;
      if (!entry.tools.includes(row.tool_name)) entry.tools.push(row.tool_name);
      map.set(key, entry);
    }
    return {
      email: (context.claims as any)?.email ?? null,
      connections: [...map.values()].sort((a, b) => b.last_used.localeCompare(a.last_used)),
    };
  });

const RunInput = z.object({
  tool: z.string().min(1),
  input: z.record(z.string(), z.unknown()).default({}),
});

export const runMcpTool = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => RunInput.parse(d))
  .handler(async ({ data, context }) => {
    const token = getRequest()?.headers.get("authorization")?.replace("Bearer ", "") ?? "";
    const { auditedTools } = await import("@/lib/mcp/registry");
    const tool = (auditedTools as any[]).find((t) => t?.name === data.tool);
    if (!tool) throw new Error(`Unknown tool: ${data.tool}`);

    const claims = context.claims as any;
    const ctx = {
      isAuthenticated: () => true,
      getUserId: () => context.userId,
      getUserEmail: () => claims?.email ?? null,
      getClientId: () => "in-app-playground",
      getClaims: () => claims,
      getToken: () => token,
    };

    const started = Date.now();
    try {
      const parsed = tool.inputSchema
        ? z.object(tool.inputSchema as never).partial().parse(data.input)
        : data.input;
      const result = await tool.handler(parsed, ctx);
      const text = (result?.content ?? [])
        .map((c: any) => (typeof c?.text === "string" ? c.text : JSON.stringify(c)))
        .join("\n");
      return {
        ok: !result?.isError,
        text,
        structured: result?.structuredContent ?? null,
        duration_ms: Date.now() - started,
      };
    } catch (err) {
      return {
        ok: false,
        text: err instanceof Error ? err.message : String(err),
        structured: null,
        duration_ms: Date.now() - started,
      };
    }
  });
