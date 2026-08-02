import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "search_guides",
  title: "Search guides",
  description:
    "Search LeasonAI guides and articles by keyword, with optional category and status filters. Returns slugs, titles and excerpts.",
  inputSchema: {
    query: z.string().trim().describe("Keyword to match in title, excerpt or tags. Empty for latest.").optional(),
    category: z.string().trim().describe("Category slug, e.g. guides, prompts, ethics.").optional(),
    status: z.enum(["published", "draft", "any"]).describe("Publication status filter.").optional(),
    limit: z.number().int().describe("Max results (1-50, default 10).").optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, category, status, limit }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const take = Math.min(Math.max(limit ?? 10, 1), 50);
    const supabase = supabaseForUser(ctx);
    let q = supabase
      .from("articles")
      .select("id, slug, title, excerpt, category, tags, status, published_at, updated_at")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(take);
    if (status && status !== "any") q = q.eq("status", status);
    if (category) q = q.eq("category", category);
    if (query) q = q.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,body_md.ilike.%${query}%`);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { articles: data ?? [] },
    };
  },
});
