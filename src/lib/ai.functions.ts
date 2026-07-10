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

const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not configured");
  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": key,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini request failed [${res.status}]: ${body}`);
  }
  const json = await res.json();
  const text: string | undefined = json?.candidates?.[0]?.content?.parts
    ?.map((p: any) => p?.text ?? "")
    .join("");
  if (!text) throw new Error("Gemini returned no text");
  return text;
}

function parseJson<T>(raw: string, schema: z.ZodType<T>): T {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/```$/, "")
    .trim();
  const parsed = JSON.parse(cleaned);
  return schema.parse(parsed);
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
- Voice: warm, professional, direct. No fluff.
- Include: intro, 3-5 H2 sections, at least one Markdown table OR bulleted list, and a closing takeaway.
- Include one "Watch-outs" or "Guardrails" section.
- Never include disclaimers about being an AI.
- The slug must be lowercase-with-dashes derived from the title.
- Pick category from: guides, prompts, tool-reviews, ethics, productivity.
- Return 3-6 short lowercase tags.
- reading_time_minutes should be an integer estimate (words / 200).

Return ONLY valid JSON matching this shape:
{
  "title": string,
  "slug": string,
  "excerpt": string,
  "seo_title": string,
  "seo_description": string,
  "category": string,
  "tags": string[],
  "reading_time_minutes": number,
  "body_md": string
}`;
    const raw = await callGemini(prompt);
    try {
      return parseJson(raw, DraftShape);
    } catch {
      throw new Error("AI could not produce a valid draft. Try a more specific topic.");
    }
  });

const SeoInput = z.object({
  title: z.string().min(3),
  body_md: z.string().min(20),
});
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
- seo_description: 140-160 chars, includes primary keyword.
- excerpt: 1-2 sentences, ~180 chars, in the author voice.
- tags: 3-6 short lowercase tags.

Return ONLY valid JSON:
{ "seo_title": string, "seo_description": string, "excerpt": string, "tags": string[] }`;
    const raw = await callGemini(prompt);
    return parseJson(raw, SeoShape);
  });
