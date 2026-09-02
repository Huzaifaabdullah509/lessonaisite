import { supabaseForUser } from "./supabase";

type AnyTool = {
  name: string;
  handler: (input: any, ctx: any) => any;
  [k: string]: unknown;
};

function redact(input: unknown): unknown {
  if (!input || typeof input !== "object") return {};
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (/token|secret|password|key/i.test(k)) out[k] = "[redacted]";
    else if (typeof v === "string") out[k] = v.length > 500 ? v.slice(0, 500) + "…" : v;
    else out[k] = v;
  }
  return out;
}

async function writeLog(
  ctx: any,
  row: {
    tool_name: string;
    status: "success" | "error";
    duration_ms: number;
    error_message?: string | null;
    input: unknown;
  },
) {
  try {
    if (!ctx?.isAuthenticated?.()) return;
    const supabase = supabaseForUser(ctx);
    await supabase.from("mcp_request_logs").insert({
      user_id: ctx.getUserId?.() ?? null,
      user_email: ctx.getUserEmail?.() ?? null,
      client_id: ctx.getClientId?.() ?? null,
      source: ctx.getClientId?.() === "in-app-playground" ? "playground" : "mcp",
      ...row,
      input: row.input as never,
    } as never);
  } catch {
    // Audit logging must never break a tool call.
  }
}

/** Wraps a tool so every call is recorded in public.mcp_request_logs. */
export function withAudit<T extends AnyTool>(tool: T): T {
  const original = tool.handler;
  return {
    ...tool,
    handler: async (input: any, ctx: any) => {
      const started = Date.now();
      try {
        const result = await original(input, ctx);
        const isError = Boolean(result?.isError);
        await writeLog(ctx, {
          tool_name: tool.name,
          status: isError ? "error" : "success",
          duration_ms: Date.now() - started,
          error_message: isError
            ? String(result?.content?.[0]?.text ?? "").slice(0, 500)
            : null,
          input: redact(input),
        });
        return result;
      } catch (err) {
        await writeLog(ctx, {
          tool_name: tool.name,
          status: "error",
          duration_ms: Date.now() - started,
          error_message: err instanceof Error ? err.message : String(err),
          input: redact(input),
        });
        throw err;
      }
    },
  } as T;
}
