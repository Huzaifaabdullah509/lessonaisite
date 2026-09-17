import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const supabase = createClient<Database>(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_PUBLISHABLE_KEY!,
          { auth: { persistSession: false, autoRefreshToken: false, storage: undefined } },
        );
        const { data: articles } = await supabase
          .from("articles")
          .select("slug, updated_at")
          .eq("status", "published");

        const staticPaths = [
          "/",
          "/guides",
          "/tools",
          "/prompts",
          "/about",
          "/contact",
          "/editorial-standards",
          "/agent-tools",
          "/privacy",
          "/terms",
        ];
        const urls = [
          ...staticPaths.map(
            (p) => `<url><loc>${origin}${p}</loc><changefreq>weekly</changefreq></url>`,
          ),
          ...(articles ?? []).map(
            (a) =>
              `<url><loc>${origin}/guides/${a.slug}</loc><lastmod>${a.updated_at}</lastmod></url>`,
          ),
        ].join("");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
