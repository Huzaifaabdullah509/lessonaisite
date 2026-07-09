import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        return new Response(
          `User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /auth\n\nSitemap: ${origin}/sitemap.xml\n`,
          { headers: { "Content-Type": "text/plain; charset=utf-8" } },
        );
      },
    },
  },
});
