import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { toolCatalog } from "@/lib/mcp/registry";

const TITLE = "Agent tools (MCP) — LeasonAI";
const DESCRIPTION =
  "Connect any AI assistant to LeasonAI over MCP. Documentation and example requests and responses for every exposed tool.";
const URL = "https://lessonaisite.lovable.app/agent-tools";

export const Route = createFileRoute("/agent-tools")({
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
  }),
  component: AgentToolsPage,
});

function AgentToolsPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-page max-w-4xl py-16">
        <span className="eyebrow">For developers &amp; assistants</span>
        <h1 className="mt-2 font-display text-4xl font-bold text-primary md:text-5xl">
          Agent tools documentation
        </h1>
        <p className="mt-4 text-muted-foreground">
          LeasonAI exposes a Model Context Protocol (MCP) server, so assistants like Claude, ChatGPT
          desktop clients, and Cursor can search our guides, pull prompts, browse reviewed AI tools, and
          start draft articles — all as a real signed-in LeasonAI user.
        </p>

        <section className="card-surface mt-10 p-6">
          <h2 className="font-display text-xl font-semibold text-primary">Connecting</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              Add this server URL in your assistant:{" "}
              <code className="rounded bg-muted px-2 py-0.5 text-foreground">
                https://lessonaisite.lovable.app/mcp
              </code>
            </li>
            <li>Sign in with your LeasonAI email or Google account when prompted.</li>
            <li>Approve the access request on the consent screen.</li>
            <li>The assistant now sees the tools below, limited to your account's permissions.</li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            Authorization uses OAuth 2.1 with PKCE. Tool discovery is available at{" "}
            <code className="rounded bg-muted px-2 py-0.5 text-foreground">/.mcp/list-tools</code>, and
            resource metadata at{" "}
            <code className="rounded bg-muted px-2 py-0.5 text-foreground">
              /.well-known/oauth-protected-resource
            </code>
            .
          </p>
        </section>

        <h2 className="mt-12 font-display text-2xl font-semibold text-primary">
          Tools ({toolCatalog.length})
        </h2>

        <div className="mt-6 space-y-8">
          {toolCatalog.map((t) => (
            <article key={t.name} id={t.name} className="card-surface p-6">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-lg font-semibold text-primary">{t.title}</h3>
                <code className="rounded bg-muted px-2 py-0.5 text-xs">{t.name}</code>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    t.readOnly
                      ? "bg-primary/10 text-primary"
                      : "bg-warm/20 text-warm-foreground"
                  }`}
                >
                  {t.readOnly ? "Read-only" : "Writes data"}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>

              <h4 className="mt-5 text-xs font-semibold uppercase text-muted-foreground">
                Arguments
              </h4>
              <ul className="mt-2 space-y-1 text-sm">
                {t.args.map((a) => (
                  <li key={a.name} className="text-muted-foreground">
                    <code className="text-foreground">{a.name}</code>{" "}
                    <span className="text-accent">{a.type}</span> — {a.note}
                  </li>
                ))}
              </ul>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">
                    Example request
                  </h4>
                  <pre className="mt-2 overflow-auto rounded-md bg-muted p-3 text-xs">
                    {JSON.stringify({ name: t.name, arguments: t.example }, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">
                    Example response
                  </h4>
                  <pre className="mt-2 overflow-auto rounded-md bg-muted p-3 text-xs">
                    {t.exampleResponse}
                  </pre>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-12 card-surface p-6">
          <h2 className="font-display text-xl font-semibold text-primary">Privacy &amp; auditing</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Every tool call is recorded with the caller, client, tool name, outcome, duration, and
            redacted inputs. You can review your own calls in the dashboard under Agents, and admins can
            export the full log to CSV. Assistants never receive your password, and they cannot publish
            articles — only drafts.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
