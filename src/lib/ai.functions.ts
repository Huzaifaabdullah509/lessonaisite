import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (!data) throw new Error("Forbidden: admin role required");
}

const MODELS = [
  "google/gemini-2.5-flash",
  "google/gemini-2.5-flash-lite",
  "google/gemini-2.5-pro",
];

async function callAI(prompt: string, opts?: { json?: boolean; system?: string }): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");
  const json = opts?.json ?? true;
  const system =
    opts?.system ??
    (json
      ? "You are a JSON-only responder. Return valid JSON only, no prose."
      : "You are a helpful expert. Return polished Markdown only.");
  let lastErr = "";
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": key,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt },
          ],
          ...(json ? { response_format: { type: "json_object" } } : {}),
        }),
      });
      if (res.ok) {
        const j = await res.json();
        const text = j?.choices?.[0]?.message?.content;
        if (text) return text;
        lastErr = "empty response";
        continue;
      }
      lastErr = `[${res.status}] ${await res.text()}`;
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
        continue;
      }
      break;
    }
  }
  throw new Error(`AI request failed: ${lastErr}`);
}

function parseJson<T>(raw: string, schema: z.ZodType<T>): T {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/```$/, "")
    .trim();
  return schema.parse(JSON.parse(cleaned));
}

const DraftInput = z.object({
  topic: z.string().min(3).max(200),
  angle: z.string().max(300).optional().default(""),
  targetKeywords: z.string().max(300).optional().default(""),
});
const DraftShape = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  seo_title: z.string(),
  seo_description: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  reading_time_minutes: z.number(),
  body_md: z.string(),
});

export const generateArticleDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => DraftInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const prompt = `You are the editor of LeasonAI, a teacher-first AI publication.
Write a NEW long-form guide (1000-1500 words) in Markdown for classroom teachers.

Topic: ${data.topic}
Angle: ${data.angle || "Practical, teacher-first, non-generic"}
Target keywords: ${data.targetKeywords || "AI for teachers"}

Rules:
- Warm, professional, direct. No fluff.
- Intro, 3-5 H2 sections, at least one Markdown table OR bulleted list, closing takeaway.
- One "Watch-outs" or "Guardrails" section.
- Slug lowercase-with-dashes derived from the title.
- Pick category from: guides, prompts, tool-reviews, ethics, productivity.
- 3-6 short lowercase tags.

Return ONLY valid JSON:
{ "title": string, "slug": string, "excerpt": string, "seo_title": string, "seo_description": string, "category": string, "tags": string[], "reading_time_minutes": number, "body_md": string }`;
    const raw = await callAI(prompt);
    try {
      return parseJson(raw, DraftShape);
    } catch {
      throw new Error("AI could not produce a valid draft. Try a more specific topic.");
    }
  });

const SeoInput = z.object({ title: z.string().min(3), body_md: z.string().min(20) });
const SeoShape = z.object({
  seo_title: z.string(),
  seo_description: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
});

export const generateSeo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SeoInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const prompt = `Generate SEO metadata for a LeasonAI article.
Title: ${data.title}
Body:
${data.body_md.slice(0, 4000)}

Rules:
- seo_title: <= 60 chars, ends with "| LeasonAI".
- seo_description: 140-160 chars.
- excerpt: 1-2 sentences (~180 chars).
- 3-6 short lowercase tags.

Return ONLY valid JSON:
{ "seo_title": string, "seo_description": string, "excerpt": string, "tags": string[] }`;
    const raw = await callAI(prompt);
    return parseJson(raw, SeoShape);
  });

// ==================== AI Tools Hub ====================

const SummaryInput = z.object({
  text: z.string().min(30).max(20000),
  audience: z.string().max(120).default("middle school students"),
  length: z.enum(["short", "medium", "long"]).default("short"),
});

export const aiSummarize = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SummaryInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const words = { short: "80-120", medium: "180-250", long: "350-500" }[data.length];
    const md = await callAI(
      `Summarize the text below for ${data.audience}. Length ${words} words.
Return Markdown with: 3-5 key takeaways as a bulleted list, then a 1-paragraph plain-language summary, then 3 comprehension questions.

TEXT:
"""
${data.text}
"""`,
      { json: false },
    );
    return { markdown: md };
  });

const LessonPlanInput = z.object({
  topic: z.string().min(3).max(200),
  grade: z.string().min(1).max(40),
  subject: z.string().min(1).max(60),
  minutes: z.number().int().min(15).max(240).default(45),
  standards: z.string().max(400).default(""),
  notes: z.string().max(600).default(""),
});

export const aiLessonPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => LessonPlanInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const md = await callAI(
      `Design a ${data.minutes}-minute ${data.subject} lesson for ${data.grade} on "${data.topic}".
${data.standards ? `Aligned to: ${data.standards}.` : ""}
${data.notes ? `Teacher notes: ${data.notes}.` : ""}

Return Markdown with these H2 sections:
## Objective
One measurable I-can statement with Bloom verb.
## Materials
Bulleted list.
## Lesson flow
Table: Time | Segment | Teacher | Students.
## Differentiation
Three bullets: EL support, IEP/504 support, extension.
## Formative check
2-3 quick checks + a 1-question exit ticket.
## Homework (optional)
1 short task or "None".`,
      { json: false },
    );
    return { markdown: md };
  });

const WorksheetInput = z.object({
  topic: z.string().min(3).max(200),
  grade: z.string().min(1).max(40),
  itemCount: z.number().int().min(3).max(30).default(10),
  includeAnswerKey: z.boolean().default(true),
});

export const aiWorksheet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => WorksheetInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const md = await callAI(
      `Create a printable worksheet on "${data.topic}" for ${data.grade}.
Include ${data.itemCount} items mixing recall, application, and analysis. Vary formats (short answer, MCQ, matching, open response).

Return Markdown with:
# Title
Student directions (2 sentences).
Numbered items with space cues (e.g. blank lines).
${data.includeAnswerKey ? "Then an H2 ## Answer key with brief rationales." : ""}`,
      { json: false },
    );
    return { markdown: md };
  });

const RubricInput = z.object({
  task: z.string().min(3).max(200),
  grade: z.string().min(1).max(40),
  criteria: z.string().max(300).default("Content, Reasoning, Craft, Conventions"),
  levels: z.number().int().min(3).max(5).default(4),
});

export const aiRubric = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => RubricInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const md = await callAI(
      `Build a ${data.levels}-level analytic rubric for "${data.task}" (${data.grade}).
Criteria: ${data.criteria}.
Use observable, student-friendly descriptors — describe the behaviour, not "excellent/good/fair".

Return Markdown with a table: Criterion | Level ${data.levels} | ... | Level 1. Below the table add a "How to use this rubric" 2-sentence note.`,
      { json: false },
    );
    return { markdown: md };
  });
