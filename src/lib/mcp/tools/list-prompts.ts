import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_prompts",
  title: "List teacher prompts",
  description: "Browse the LeasonAI prompt library, optionally filtered by category or keyword.",
  inputSchema: {
    query: z.string().trim().describe("Keyword to match in title, use case or prompt text.").optional(),
    category: z.string().trim().describe("Prompt category, e.g. planning, feedback, assessment.").optional(),
    limit: z.number().int().describe("Max results (1-50, default 15).").optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, category, limit }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const take = Math.min(Math.max(limit ?? 15, 1), 50);
    const supabase = supabaseForUser(ctx);
    let q = supabase
      .from("prompts")
      .select("id, title, category, use_case, prompt_text, tags")
      .order("created_at", { ascending: false })
      .limit(take);
    if (category) q = q.eq("category", category);
    if (query)
      q = q.or(`title.ilike.%${query}%,use_case.ilike.%${query}%,prompt_text.ilike.%${query}%`);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { prompts: data ?? [] },
    };
  },
});
