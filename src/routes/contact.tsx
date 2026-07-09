import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { NewsletterForm } from "@/components/newsletter-form";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact LeasonAI" },
      { name: "description", content: "Get in touch with the LeasonAI editorial team." },
      { property: "og:title", content: "Contact LeasonAI" },
      { property: "og:description", content: "Get in touch with the LeasonAI editorial team." },
    ],
  }),
  component: () => (
    <>
      <SiteHeader />
      <main className="container-page max-w-2xl py-16">
        <span className="eyebrow">Contact</span>
        <h1 className="mt-2 font-display text-4xl font-bold text-primary md:text-5xl">
          We'd love to hear from you.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Editorial, corrections, partnerships, and reader questions all welcome.
        </p>
        <div className="card-surface mt-10 p-6">
          <h2 className="font-display text-lg font-semibold">Email</h2>
          <a href="mailto:contact@leasonai.site" className="text-accent hover:underline">
            contact@leasonai.site
          </a>
        </div>
        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold text-primary">Join the Brief</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Weekly AI updates for teachers.
          </p>
          <div className="mt-4">
            <NewsletterForm variant="light" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  ),
});
