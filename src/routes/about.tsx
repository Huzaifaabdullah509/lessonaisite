import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-shell";

const TITLE = "About LeasonAI — our educational mission";
const DESCRIPTION =
  "LeasonAI is a teacher-first AI publication: who writes it, how we test every guide and prompt, our editorial standards, and how the site is funded.";
const URL = "https://lessonaisite.lovable.app/about";

export const Route = createFileRoute("/about")({
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
          "@type": "AboutPage",
          url: URL,
          name: TITLE,
          description: DESCRIPTION,
          mainEntity: {
            "@type": "Organization",
            name: "LeasonAI",
            url: "https://lessonaisite.lovable.app/",
            email: "contact@leasonai.site",
            foundingDate: "2026",
            description:
              "An independent education publication helping teachers use AI without outsourcing professional judgment.",
          },
        }),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-page max-w-3xl py-16">
        <span className="eyebrow">About</span>
        <h1 className="mt-2 font-display text-4xl font-bold text-primary md:text-5xl">
          AI resources built for teachers, by teachers.
        </h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat value="30+" label="Long-form guides" />
          <Stat value="120+" label="Tested prompts" />
          <Stat value="0" label="Sponsored reviews" />
        </div>

        <div className="prose-article mt-10">
          <h2>Our mission</h2>
          <p>
            LeasonAI exists to make AI genuinely useful in ordinary classrooms — not in a conference
            demo, but on a Tuesday afternoon with thirty pupils, a photocopier queue and marking still
            to do. Every guide, prompt and tool review is written to help teachers save time while
            keeping professional judgment exactly where it belongs: with the teacher.
          </p>

          <h2>Who writes LeasonAI</h2>
          <p>
            The site is produced by a small editorial team of practising and former teachers —
            secondary English and science, primary generalist, and one former head of digital learning
            — working with a technical editor who checks claims about how AI tools actually handle
            data. We are independent: no school district, vendor or investor directs what we publish.
          </p>

          <h2>What we publish</h2>
          <ul>
            <li>
              <strong>Guides.</strong> Long-form, step-by-step walkthroughs on planning, feedback,
              differentiation and assessment.
            </li>
            <li>
              <strong>Prompt library.</strong> A working set of prompts organised by classroom task,
              each with the context it needs to produce something usable.
            </li>
            <li>
              <strong>Tool reviews.</strong> Teacher-tested reviews scored on classroom value, privacy
              and how hard the tool is to roll out.
            </li>
            <li>
              <strong>Ethics and policy.</strong> An ethics framework plus school-ready policy
              templates you can adapt.
            </li>
          </ul>

          <h2>How we test things</h2>
          <p>
            Nothing goes live because it sounds clever. A prompt is published only after it has been
            run against real teaching material and produced output a teacher would actually hand out
            after light editing. A tool is reviewed only after we have used it for a full task cycle
            and read its data-handling documentation. When something does not work well, we say so.
          </p>

          <h2>Editorial standards and corrections</h2>
          <p>
            AI moves quickly, so we date our articles and revisit them. Some drafts begin with AI
            assistance; every published piece is reviewed and edited by a human educator, and material
            AI involvement is labelled. If you spot an error, email us and we will correct it and note
            the change. Read the full{" "}
            <a href="/editorial-standards">editorial standards</a>.
          </p>

          <h2>How the site is funded</h2>
          <p>
            LeasonAI is free to read and funded by advertising. Advertisers have no say in editorial
            decisions, we do not accept payment for positive reviews, and any sponsored content is
            clearly labelled. See our <a href="/privacy">privacy policy</a> for how advertising
            cookies work.
          </p>

          <h2>Build with us</h2>
          <p>
            We also expose our library to AI assistants over an open protocol, so you can search
            guides and prompts from inside the assistant you already use. See the{" "}
            <a href="/agent-tools">agent tools documentation</a>.
          </p>

          <h2>Contact</h2>
          <p>
            Have a story, correction or partnership idea? Email{" "}
            <a href="mailto:contact@leasonai.site">contact@leasonai.site</a> or use our{" "}
            <a href="/contact">contact form</a>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="card-surface p-5">
      <p className="font-display text-3xl font-bold text-primary">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
