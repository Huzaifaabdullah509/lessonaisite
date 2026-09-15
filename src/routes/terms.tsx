import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-shell";

const TITLE = "Terms of Service — LeasonAI";
const DESCRIPTION =
  "The terms that govern your use of LeasonAI: acceptable use, accounts, content reuse, AI-assisted content, advertising and liability.";
const URL = "https://lessonaisite.lovable.app/terms";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: () => (
    <>
      <SiteHeader />
      <main className="container-page max-w-3xl py-16">
        <span className="eyebrow">Legal</span>
        <h1 className="mt-2 font-display text-4xl font-bold text-primary">Terms of service</h1>
        <div className="prose-article mt-6">
          <p>
            <strong>Last updated:</strong> 10 September 2026
          </p>
          <p>
            By using lessonaisite.lovable.app ("LeasonAI") you agree to these terms. If you do not
            agree, please stop using the site.
          </p>

          <h2>1. What LeasonAI is</h2>
          <p>
            LeasonAI is an independent education publication. We publish guides, prompt templates and
            reviews to help teachers use AI responsibly. Content is provided for informational and
            professional-development purposes only. Nothing here is legal, medical, safeguarding or
            employment advice, and nothing replaces your school's own policies.
          </p>

          <h2>2. Accounts</h2>
          <ul>
            <li>You must give accurate information and keep your password confidential.</li>
            <li>You are responsible for activity under your account.</li>
            <li>
              We may suspend or close accounts that breach these terms, spam other users, or attempt
              to bypass access controls.
            </li>
          </ul>

          <h2>3. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Scrape, resell or bulk-republish our content without written permission.</li>
            <li>Attempt to break, overload or gain unauthorised access to the site or its API.</li>
            <li>Upload unlawful, defamatory, or harmful material through any form or tool.</li>
            <li>Misuse our connected assistant (MCP) tools to generate spam or bulk drafts.</li>
          </ul>

          <h2>4. Intellectual property and reuse</h2>
          <p>
            All articles, prompts and page designs are © LeasonAI unless stated otherwise. You may
            quote up to 200 words with clear attribution and a link back to the original page.
            Teachers may print or adapt our prompt templates for use with their own classes at no
            cost. For syndication, training data, or commercial reuse, email{" "}
            <a href="mailto:contact@leasonai.site">contact@leasonai.site</a>.
          </p>

          <h2>5. AI-assisted content</h2>
          <p>
            Some drafts are prepared with AI assistance. Every published article is reviewed, fact
            checked and edited by a human educator before it goes live, and we label content where AI
            involvement is material. If you find an error, tell us and we will correct it and note the
            correction.
          </p>

          <h2>6. Third-party links and tools</h2>
          <p>
            We review third-party AI tools and link to them for your convenience. We do not control
            those services, their pricing or their data handling, and inclusion is not an endorsement
            of their privacy practices. Always check your school's data-protection requirements before
            using a tool with pupil data.
          </p>

          <h2>7. Advertising</h2>
          <p>
            The site is funded by advertising, including Google AdSense. Advertisers do not influence
            editorial judgement, and sponsored content, when it appears, is clearly labelled. See our{" "}
            <a href="/privacy">privacy policy</a> for how advertising cookies work.
          </p>

          <h2>8. Availability</h2>
          <p>
            We aim to keep LeasonAI online and fast, but we provide the site "as is" without
            warranties of uninterrupted availability. We may change, pause or remove features.
          </p>

          <h2>9. Limitation of liability</h2>
          <p>
            To the extent permitted by law, LeasonAI is not liable for indirect or consequential loss
            arising from your use of the site or from decisions you make based on our content. Nothing
            in these terms limits liability that cannot lawfully be limited.
          </p>

          <h2>10. Changes and governing law</h2>
          <p>
            We may update these terms; the "last updated" date shows when. Continued use after a
            change means you accept the new terms. Any dispute will be handled under the laws
            applicable at our place of establishment.
          </p>

          <h2>11. Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a href="mailto:contact@leasonai.site">contact@leasonai.site</a> or use our{" "}
            <a href="/contact">contact form</a>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  ),
});
