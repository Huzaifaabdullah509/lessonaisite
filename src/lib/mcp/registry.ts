import { withAudit } from "./audit";
import searchGuides from "./tools/search-guides";
import getGuide from "./tools/get-guide";
import listPrompts from "./tools/list-prompts";
import listToolsDirectory from "./tools/list-tools-directory";
import createGuideDraft from "./tools/create-guide-draft";

/** Every exposed tool, wrapped with audit logging. */
export const auditedTools = [
  searchGuides,
  getGuide,
  listPrompts,
  listToolsDirectory,
  createGuideDraft,
].map((t) => withAudit(t as never)) as never[];

/** Lightweight metadata used by the docs page and playground UI. */
export const toolCatalog = [
  {
    name: "search_guides",
    title: "Search guides",
    description:
      "Search LeasonAI guides by keyword, with optional category and status filters. Returns slugs, titles and excerpts.",
    readOnly: true,
    args: [
      { name: "query", type: "string?", note: "Keyword matched in title, excerpt and body." },
      { name: "category", type: "string?", note: "Category slug, e.g. guides or ethics." },
      { name: "status", type: '"published" | "draft" | "any"?', note: "Drafts need an admin account." },
      { name: "limit", type: "number?", note: "1–50, default 10." },
    ],
    example: { query: "gemini", category: "guides", limit: 3 },
    exampleResponse: `{
  "articles": [
    {
      "slug": "google-gemini-in-the-classroom",
      "title": "Google Gemini in the Classroom",
      "excerpt": "A practical, teacher-tested walkthrough…",
      "category": "guides",
      "status": "published",
      "published_at": "2026-09-02T09:00:00.000Z"
    }
  ]
}`,
  },
  {
    name: "get_guide",
    title: "Get guide",
    description: "Fetch one guide by slug, including the full Markdown body and SEO metadata.",
    readOnly: true,
    args: [{ name: "slug", type: "string", note: "Slug from search_guides." }],
    example: { slug: "google-gemini-in-the-classroom" },
    exampleResponse: `{
  "article": {
    "slug": "google-gemini-in-the-classroom",
    "title": "Google Gemini in the Classroom",
    "body_md": "## Why Gemini matters for teachers\\n…",
    "reading_time_minutes": 9
  }
}`,
  },
  {
    name: "list_prompts",
    title: "List prompts",
    description: "Search the teacher prompt library by keyword or category.",
    readOnly: true,
    args: [
      { name: "query", type: "string?", note: "Keyword matched in title and prompt body." },
      { name: "category", type: "string?", note: "e.g. Lesson Planning, Feedback, Assessment." },
      { name: "limit", type: "number?", note: "1–50, default 20." },
    ],
    example: { category: "Feedback", limit: 2 },
    exampleResponse: `{
  "prompts": [
    { "title": "Rubric-aligned feedback", "category": "Feedback", "body": "You are an experienced…" }
  ]
}`,
  },
  {
    name: "list_tools_directory",
    title: "List AI tools",
    description: "Browse the reviewed directory of classroom AI tools with scores and pricing notes.",
    readOnly: true,
    args: [
      { name: "query", type: "string?", note: "Keyword matched in name and summary." },
      { name: "limit", type: "number?", note: "1–50, default 20." },
    ],
    example: { query: "notebook", limit: 2 },
    exampleResponse: `{
  "tools": [
    { "name": "NotebookLM", "category": "Research", "score": 9, "pricing": "Free" }
  ]
}`,
  },
  {
    name: "create_guide_draft",
    title: "Create guide draft",
    description:
      "Create a new draft article. Requires an admin account; drafts are never published automatically.",
    readOnly: false,
    args: [
      { name: "title", type: "string", note: "Article title." },
      { name: "slug", type: "string", note: "lowercase-with-dashes." },
      { name: "body_md", type: "string?", note: "Markdown body." },
      { name: "excerpt", type: "string?", note: "Listing summary." },
      { name: "category", type: "string?", note: "Default: guides." },
      { name: "tags", type: "string[]?", note: "Short lowercase tags." },
    ],
    example: {
      title: "Teaching source evaluation with AI",
      slug: "teaching-source-evaluation-with-ai",
      category: "guides",
    },
    exampleResponse: `{
  "article": { "id": "8f0…", "slug": "teaching-source-evaluation-with-ai", "status": "draft" }
}`,
  },
] as const;

export type ToolCatalogEntry = (typeof toolCatalog)[number];
