import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-shell";

const TITLE = "Privacy Policy — LeasonAI";
const DESCRIPTION =
  "How LeasonAI collects, uses and protects reader data, including cookies, Google AdSense advertising, newsletter data and your rights.";
const URL = "https://lessonaisite.lovable.app/privacy";

export const Route = createFileRoute("/privacy")({
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
        <h1 className="mt-2 font-display text-4xl font-bold text-primary">Privacy policy</h1>
        <div className="prose-article mt-6">
          <p>
            <strong>Last updated:</strong> 10 September 2026
          </p>
          <p>
            LeasonAI ("we", "us") publishes AI teaching guides, prompts and tool reviews for
            educators. This policy explains what data we collect when you visit
            lessonaisite.lovable.app, why we collect it, how long we keep it, and how you can
            control it. We do not sell personal data, and we do not knowingly collect data from
            children under 13.
          </p>

          <h2>1. Information we collect</h2>
          <h3>Information you give us</h3>
          <ul>
            <li>
              <strong>Newsletter sign-up:</strong> your email address, and the date you subscribed.
            </li>
            <li>
              <strong>Contact form:</strong> your name, email address, subject and message.
            </li>
            <li>
              <strong>Account data (optional):</strong> if you create an account, your email address
              and, for Google sign-in, your name and profile photo as supplied by Google.
            </li>
          </ul>
          <h3>Information collected automatically</h3>
          <ul>
            <li>Standard server log data: IP address, browser type, referring page and timestamps.</li>
            <li>Aggregate analytics about which guides are read and for how long.</li>
            <li>
              Cookies and similar technologies set by us and by our advertising partner (see section
              3).
            </li>
          </ul>

          <h2>2. How we use your information</h2>
          <ul>
            <li>To deliver the newsletter you asked for, and to let you unsubscribe.</li>
            <li>To answer messages you send us.</li>
            <li>To operate your account, including sign-in and saved dashboard settings.</li>
            <li>To understand which content is useful so we can publish more of it.</li>
            <li>To keep the site secure and to prevent abuse and spam.</li>
            <li>To show advertising that keeps the site free to read.</li>
          </ul>

          <h2>3. Cookies and Google AdSense</h2>
          <p>
            Third-party vendors, including Google, use cookies to serve ads based on your prior
            visits to this website or other websites. Google's use of advertising cookies enables it
            and its partners to serve ads to you based on your visit to this site and/or other sites
            on the internet.
          </p>
          <p>
            You may opt out of personalised advertising by visiting{" "}
            <a href="https://www.google.com/settings/ads" rel="nofollow noopener" target="_blank">
              Google Ads Settings
            </a>
            . You can also opt out of a third-party vendor's use of cookies for personalised
            advertising by visiting{" "}
            <a href="https://www.aboutads.info/choices/" rel="nofollow noopener" target="_blank">
              aboutads.info
            </a>{" "}
            or{" "}
            <a href="https://www.youronlinechoices.com/" rel="nofollow noopener" target="_blank">
              youronlinechoices.com
            </a>
            .
          </p>
          <p>
            Cookies we and our partners may use fall into three groups: strictly necessary cookies
            (sign-in and security), analytics cookies (aggregate reading statistics), and advertising
            cookies (ad selection, frequency capping and measurement). You can block or delete
            cookies in your browser settings at any time; strictly necessary cookies are required for
            sign-in to work.
          </p>
          <p>
            Readers in the European Economic Area, the United Kingdom and Switzerland are shown a
            consent notice before non-essential cookies are set, in line with Google's EU user
            consent policy, and personalised advertising is used only where consent is given.
          </p>

          <h2>4. Legal bases for processing</h2>
          <p>
            Where the GDPR applies, we rely on: your <strong>consent</strong> for the newsletter and
            for non-essential cookies; <strong>legitimate interests</strong> for site security,
            aggregate analytics and answering your messages; and{" "}
            <strong>contract performance</strong> for operating an account you created.
          </p>

          <h2>5. Sharing and processors</h2>
          <p>
            We share data only with service providers who help us run the site: our hosting and
            database provider, our email delivery provider, our analytics provider, and Google for
            advertising. They may process data only on our instructions. We may also disclose data
            where the law requires it.
          </p>

          <h2>6. Data retention</h2>
          <ul>
            <li>Newsletter emails: until you unsubscribe, then deleted within 30 days.</li>
            <li>Contact messages: up to 24 months, so we can follow up on corrections.</li>
            <li>Account data: while your account is open, then deleted on request.</li>
            <li>Server logs: up to 90 days.</li>
          </ul>

          <h2>7. Your rights</h2>
          <p>
            You can ask us to access, correct, export or delete your personal data, withdraw consent,
            or object to processing. Email{" "}
            <a href="mailto:contact@leasonai.site">contact@leasonai.site</a> and we will respond
            within 30 days. If you are unhappy with our response, you may complain to your local data
            protection authority.
          </p>

          <h2>8. Children's privacy</h2>
          <p>
            LeasonAI is written for teachers and school leaders, not for pupils. We do not knowingly
            collect personal data from children. If you believe a child has submitted data, contact us
            and we will delete it.
          </p>

          <h2>9. Security</h2>
          <p>
            Data is stored on encrypted, access-controlled infrastructure. Access to reader data is
            limited to editorial staff who need it. No system is perfectly secure, so we encourage you
            to use a strong, unique password if you create an account.
          </p>

          <h2>10. Changes to this policy</h2>
          <p>
            We will update the "last updated" date whenever this policy changes, and we will announce
            material changes in the newsletter.
          </p>

          <h2>11. Contact</h2>
          <p>
            Questions about privacy? Email{" "}
            <a href="mailto:contact@leasonai.site">contact@leasonai.site</a> or use our{" "}
            <a href="/contact">contact form</a>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  ),
});
