import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About LeasonAI" },
      {
        name: "description",
        content:
          "LeasonAI publishes teacher-first AI guides, prompt workflows, and ethics resources for the modern classroom.",
      },
      { property: "og:title", content: "About LeasonAI" },
      { property: "og:description", content: "Teacher-first AI resources." },
    ],
  }),
  component: () => (
    <>
      <SiteHeader />
      <main className="container-page max-w-3xl py-16">
        <span className="eyebrow">About</span>
        <h1 className="mt-2 font-display text-4xl font-bold text-primary md:text-5xl">
          AI resources built for teachers.
        </h1>
        <div className="prose-article mt-8">
          <p>
            LeasonAI is a content-rich AI publication for educators. Every guide, prompt, and tool
            review here is written to help teachers use AI without outsourcing professional
            judgment.
          </p>
          <h2>What we publish</h2>
          <ul>
            <li>Long-form guides on planning, feedback, differentiation, and assessment.</li>
            <li>A working prompt library organized by classroom task.</li>
            <li>Teacher-tested AI tool reviews scored on value, privacy, and rollout.</li>
            <li>An ethics framework and school-ready policy templates.</li>
          </ul>
          <h2>Our editorial standards</h2>
          <p>
            Every article is verified against classroom experience, cross-checked for accuracy, and
            reviewed for AI-tool privacy claims. See our <a href="/editorial-standards">editorial
            standards</a>.
          </p>
          <h2>Contact</h2>
          <p>
            Have a story, correction, or partnership idea? Email{" "}
            <a href="mailto:contact@leasonai.site">contact@leasonai.site</a>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  ),
});
