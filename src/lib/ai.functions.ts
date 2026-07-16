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

async function callAI(prompt: string): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");
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
            { role: "system", content: "You are a JSON-only responder. Return valid JSON only, no prose." },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (res.ok) {
        const json = await res.json();
        const text = json?.choices?.[0]?.message?.content;
        if (text) return text;
        lastErr = "empty response";
        continue;
      }
      lastErr = `[${res.status}] ${await res.text()}`;
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
        continue;
      }
      break; // non-retryable, try next model
    }
  }
  throw new Error(`AI request failed after retries: ${lastErr}`);
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
