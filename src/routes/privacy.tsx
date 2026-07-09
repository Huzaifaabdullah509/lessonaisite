import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — LeasonAI" },
      { name: "description", content: "How LeasonAI collects and protects reader data." },
    ],
  }),
  component: () => (
    <>
      <SiteHeader />
      <main className="container-page max-w-3xl py-16">
        <h1 className="font-display text-4xl font-bold text-primary">Privacy policy</h1>
        <div className="prose-article mt-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>
            LeasonAI collects only the data required to deliver the newsletter and analytics on
            article performance. We do not sell reader data.
          </p>
          <h2>Newsletter</h2>
          <p>
            Your email is stored securely and used solely to send The Brief. Unsubscribe at any
            time from a link in every email.
          </p>
          <h2>Cookies</h2>
          <p>
            We use privacy-respecting analytics to understand which guides are most useful. No
            cross-site tracking.
          </p>
          <h2>Contact</h2>
          <p>
            Questions? <a href="mailto:contact@leasonai.site">contact@leasonai.site</a>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  ),
});
