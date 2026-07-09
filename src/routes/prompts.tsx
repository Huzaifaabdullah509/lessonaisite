import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { getPublicPrompts } from "@/lib/content.functions";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const query = queryOptions({
  queryKey: ["all-prompts"],
  queryFn: () => getPublicPrompts(),
});

export const Route = createFileRoute("/prompts")({
  head: () => ({
    meta: [
      { title: "AI Prompt Library for Teachers — LeasonAI" },
      {
        name: "description",
        content:
          "A working library of ChatGPT and Gemini prompts for planning, feedback, quizzes, communication, and classroom management.",
      },
      { property: "og:title", content: "Prompt Library — LeasonAI" },
      { property: "og:description", content: "Copy-and-adapt AI prompts for educators." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(query),
  component: PromptsPage,
});

function PromptsPage() {
  const { data: prompts } = useSuspenseQuery(query);
  const grouped = prompts.reduce<Record<string, typeof prompts>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  return (
    <>
      <SiteHeader />
      <main className="container-page py-16">
        <span className="eyebrow">Prompt library</span>
        <h1 className="mt-2 font-display text-4xl font-bold text-primary md:text-5xl">
          Copy-ready prompts for educators
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Every prompt follows the <em>role-context-task-format</em> pattern for reliable results.
        </p>

        <div className="mt-12 space-y-14">
          {Object.entries(grouped).map(([cat, list]) => (
            <section key={cat}>
              <h2 className="font-display text-2xl font-bold text-primary">{cat}</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {list.map((p) => (
                  <div key={p.id} className="card-surface p-5">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {p.title}
                    </h3>
                    {p.use_case && (
                      <p className="mt-1 text-sm text-muted-foreground">{p.use_case}</p>
                    )}
                    <pre className="mt-3 whitespace-pre-wrap rounded-md bg-muted p-3 text-xs text-foreground">
                      {p.prompt_text}
                    </pre>
                    <button
                      onClick={() => {
                        void navigator.clipboard.writeText(p.prompt_text);
                        toast.success("Copied to clipboard");
                      }}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                    >
                      <Copy className="h-3 w-3" /> Copy prompt
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
