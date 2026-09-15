import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X, Search, Sparkles } from "lucide-react";

const navLinks = [
  { to: "/guides", label: "Guides" },
  { to: "/prompts", label: "Prompts" },
  { to: "/tools", label: "AI Tools" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-primary">
          <img src="/favicon.png" alt="LeasonAI logo" className="h-9 w-9 rounded-lg" />
          LeasonAI
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/guides"
            className="grid h-9 w-9 place-items-center rounded-md border border-border text-foreground/70 hover:bg-muted"
            aria-label="Search guides"
          >
            <Search className="h-4 w-4" />
          </Link>
          {signedIn ? (
            <Link
              to="/dashboard"
              className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/auth"
              className="inline-flex h-9 items-center rounded-md bg-warm px-4 text-sm font-semibold text-warm-foreground hover:opacity-90"
            >
              Sign in
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-md border border-border md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border md:hidden">
          <nav className="container-page flex flex-col py-3">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-foreground/80"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to={signedIn ? "/dashboard" : "/auth"}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-warm px-4 text-sm font-semibold text-warm-foreground"
            >
              {signedIn ? "Dashboard" : "Sign in"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold text-primary">
            <img src="/favicon.png" alt="LeasonAI logo" className="h-9 w-9 rounded-lg" />
            LeasonAI
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Teacher-first AI guides, prompt workflows, tool reviews, and ethics resources.
          </p>
        </div>
        <FooterCol
          title="Content"
          links={[
            { to: "/guides", label: "Guides" },
            { to: "/prompts", label: "Prompts" },
            { to: "/tools", label: "AI Tools" },
          ]}
        />
        <FooterCol
          title="LeasonAI"
          links={[
            { to: "/about", label: "About us" },
            { to: "/contact", label: "Contact us" },
            { to: "/editorial-standards", label: "Editorial standards" },
            { to: "/agent-tools", label: "Agent tools (MCP)" },
          ]}
        />
        <FooterCol
          title="Legal"
          links={[
            { to: "/privacy", label: "Privacy Policy" },
            { to: "/terms", label: "Terms of Service" },
          ]}
        />
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-5 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} LeasonAI. Practical AI for educators.</p>
          <p>Made with care for teachers.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold text-foreground">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="hover:text-primary">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
