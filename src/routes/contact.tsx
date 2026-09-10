import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { NewsletterForm } from "@/components/newsletter-form";
import { ContactForm } from "@/components/contact-form";
import { Mail, Clock, MapPin, LifeBuoy } from "lucide-react";

const TITLE = "Contact LeasonAI — editorial, corrections & partnerships";
const DESCRIPTION =
  "Contact the LeasonAI editorial team about guides, corrections, privacy questions, or partnerships. We reply within two working days.";
const URL = "https://lessonaisite.lovable.app/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact LeasonAI",
          url: URL,
          description: DESCRIPTION,
          mainEntity: {
            "@type": "Organization",
            name: "LeasonAI",
            email: "contact@leasonai.site",
            url: "https://lessonaisite.lovable.app/",
          },
        }),
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-page max-w-5xl py-16">
        <span className="eyebrow">Contact</span>
        <h1 className="mt-2 font-display text-4xl font-bold text-primary md:text-5xl">
          We'd love to hear from you.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          LeasonAI is written and edited by practising educators. Send us a correction, a classroom
          question, a guide request, or a partnership idea — a person reads every message.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-display text-xl font-semibold text-primary">Send a message</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill this in and we'll reply by email.
            </p>
            <div className="mt-4">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-4">
            <InfoCard
              icon={<Mail className="h-4 w-4" />}
              title="Email us directly"
              body={
                <a href="mailto:contact@leasonai.site" className="text-accent hover:underline">
                  contact@leasonai.site
                </a>
              }
            />
            <InfoCard
              icon={<Clock className="h-4 w-4" />}
              title="Response time"
              body="Monday to Friday, within two working days."
            />
            <InfoCard
              icon={<LifeBuoy className="h-4 w-4" />}
              title="Corrections & privacy"
              body="Mark your subject line 'Correction' or 'Privacy' and it is routed to the editor on duty."
            />
            <InfoCard
              icon={<MapPin className="h-4 w-4" />}
              title="Publisher"
              body="LeasonAI — an independent online education publication for teachers worldwide."
            />
          </aside>
        </div>

        <section className="mt-14">
          <h2 className="font-display text-xl font-semibold text-primary">Join the Brief</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            One short email each week: new guides, prompts that worked, and tool changes worth knowing.
          </p>
          <div className="mt-4 max-w-xl">
            <NewsletterForm variant="light" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function InfoCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="card-surface p-5">
      <div className="flex items-center gap-2 text-primary">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-primary/10">{icon}</span>
        <h3 className="font-display text-sm font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
