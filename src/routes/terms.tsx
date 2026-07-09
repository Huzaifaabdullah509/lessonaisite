import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-shell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — LeasonAI" },
      { name: "description", content: "Terms of use for LeasonAI." },
    ],
  }),
  component: () => (
    <>
      <SiteHeader />
      <main className="container-page max-w-3xl py-16">
        <h1 className="font-display text-4xl font-bold text-primary">Terms of use</h1>
        <div className="prose-article mt-6">
          <p>
            LeasonAI content is provided for informational and educational purposes. Nothing here
            constitutes legal, medical, or specific professional advice.
          </p>
          <h2>Reuse</h2>
          <p>
            You may quote up to 200 words with attribution and a link back. For longer reuse,
            contact <a href="mailto:contact@leasonai.site">contact@leasonai.site</a>.
          </p>
          <h2>AI-generated content</h2>
          <p>
            Some articles use AI assistance in drafting. Every published article is reviewed and
            edited by a human educator.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  ),
});
