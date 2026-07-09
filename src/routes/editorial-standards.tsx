import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-shell";

export const Route = createFileRoute("/editorial-standards")({
  head: () => ({
    meta: [
      { title: "Editorial Standards — LeasonAI" },
      {
        name: "description",
        content:
          "How LeasonAI writes, fact-checks, reviews AI tools, and handles corrections.",
      },
    ],
  }),
  component: () => (
    <>
      <SiteHeader />
      <main className="container-page max-w-3xl py-16">
        <h1 className="font-display text-4xl font-bold text-primary">Editorial standards</h1>
        <div className="prose-article mt-6">
          <p>
            Every LeasonAI article is written by an educator, verified against classroom practice,
            and reviewed for AI-tool privacy claims before publication.
          </p>
          <h2>Accuracy</h2>
          <p>
            We cross-check every factual claim. When AI tools generate examples, we test them with
            real curricula before including them.
          </p>
          <h2>Independence</h2>
          <p>
            We do not accept payment for reviews. Sponsorships (when they exist) are disclosed in
            the article and never influence ranking.
          </p>
          <h2>Corrections</h2>
          <p>
            Spot a mistake? Email{" "}
            <a href="mailto:contact@leasonai.site">contact@leasonai.site</a>. Verified corrections
            are published within 48 hours.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  ),
});
