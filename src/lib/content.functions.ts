import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function serverPublic() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

const ArticlesInput = z
  .object({
    limit: z.number().int().positive().max(50).default(20),
    category: z.string().optional(),
  })
  .default({ limit: 20 });

export const getPublicArticles = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => ArticlesInput.parse(data ?? {}))
  .handler(async ({ data }) => {
    const supabase = serverPublic();
    let q = supabase
      .from("articles")
      .select(
        "id, slug, title, excerpt, category, tags, cover_url, reading_time_minutes, published_at",
      )
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(data.limit);
    if (data.category) q = q.eq("category", data.category);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getArticleBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const supabase = serverPublic();
    const { data: row, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

const ToolsInput = z
  .object({ featured: z.boolean().optional(), category: z.string().optional() })
  .default({});

export const getPublicTools = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => ToolsInput.parse(data ?? {}))
  .handler(async ({ data }) => {
    const supabase = serverPublic();
    let q = supabase.from("tools").select("*").order("featured", { ascending: false }).order("name");
    if (data.featured) q = q.eq("featured", true);
    if (data.category) q = q.eq("category", data.category);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getPublicPrompts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverPublic();
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .order("category")
    .order("title");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ email: z.string().email().max(319) }).parse(data),
  )
  .handler(async ({ data }) => {
    const supabase = serverPublic();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: data.email.toLowerCase().trim() });
    if (error && !error.message.includes("duplicate")) throw new Error(error.message);
    return { ok: true };
  });
