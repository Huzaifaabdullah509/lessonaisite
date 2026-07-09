import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeNewsletter } from "@/lib/content.functions";
import { toast } from "sonner";

export function NewsletterForm({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const subscribe = useServerFn(subscribeNewsletter);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const dark = variant === "dark";
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        try {
          await subscribe({ data: { email } });
          toast.success("You're on the list. Check your inbox soon.");
          setEmail("");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Something went wrong");
        } finally {
          setLoading(false);
        }
      }}
      className={
        dark
          ? "flex flex-col gap-3 rounded-xl bg-primary-foreground/10 p-4 sm:flex-row"
          : "flex flex-col gap-3 sm:flex-row"
      }
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="teacher@school.edu"
        className={
          dark
            ? "flex-1 rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-warm"
            : "flex-1 rounded-md border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        }
      />
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 items-center justify-center rounded-md bg-warm px-6 text-sm font-semibold text-warm-foreground hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Joining…" : "Join the Brief"}
      </button>
    </form>
  );
}
