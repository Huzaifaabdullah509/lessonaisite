import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_tools_directory",
  title: "List AI tools directory",
  description: "Browse the LeasonAI directory of AI tools for teachers, with pricing and ratings.",
  inputSchema: {
    category: z.string().trim().describe("Tool category filter.").optional(),
    featuredOnly: z.boolean().describe("Only return featured tools.").optional(),
    limit: z.number().int().describe("Max results (1-50, default 20).").optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, featuredOnly, limit }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const take = Math.min(Math.max(limit ?? 20, 1), 50);
    const supabase = supabaseForUser(ctx);
    let q = supabase
      .from("tools")
      .select("id, slug, name, category, description, url, pricing, rating, featured")
      .order("featured", { ascending: false })
      .limit(take);
    if (category) q = q.eq("category", category);
    if (featuredOnly) q = q.eq("featured", true);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { tools: data ?? [] },
    };
  },
});
