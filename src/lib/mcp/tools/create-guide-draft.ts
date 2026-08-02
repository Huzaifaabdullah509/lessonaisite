import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "create_guide_draft",
  title: "Create guide draft",
  description:
    "Create a new draft article in LeasonAI. Requires an admin account. The draft is never published automatically.",
  inputSchema: {
    title: z.string().trim().min(3).describe("Article title."),
    slug: z.string().trim().min(3).describe("Lowercase-with-dashes URL slug."),
    body_md: z.string().describe("Article body in Markdown.").optional(),
    excerpt: z.string().trim().describe("Short summary shown in listings.").optional(),
    category: z.string().trim().describe("Category, e.g. guides, prompts, ethics (default guides).").optional(),
    tags: z.array(z.string()).describe("Short lowercase tags.").optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ title, slug, body_md, excerpt, category, tags }, ctx) => {
    if (!ctx.isAuthenticated())
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("articles")
      .insert({
        title,
        slug,
        body_md: body_md ?? "",
        excerpt: excerpt ?? null,
        category: category ?? "guides",
        tags: tags ?? [],
        status: "draft",
        author_id: ctx.getUserId(),
      })
      .select("id, slug, title, status")
      .single();
    if (error)
      return {
        content: [
          {
            type: "text",
            text: `Could not create the draft: ${error.message} (creating articles requires an admin account).`,
          },
        ],
        isError: true,
      };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { article: data },
    };
  },
});
