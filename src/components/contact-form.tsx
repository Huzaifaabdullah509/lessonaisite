import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Send, CheckCircle2 } from "lucide-react";
import { submitContactMessage } from "@/lib/contact.functions";

export function ContactForm() {
  const submit = useServerFn(submitContactMessage);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await submit({
        data: {
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          subject: String(form.get("subject") ?? "") || undefined,
          message: String(form.get("message") ?? ""),
        },
      });
      setSent(true);
      toast.success("Message sent — we reply within two working days.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send your message");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="card-surface flex items-start gap-3 p-6">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <div>
          <h3 className="font-display text-lg font-semibold text-primary">Message received</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Thanks for writing to LeasonAI. Our editorial team replies within two working days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-surface space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Your name
          </label>
          <input
            id="name"
            name="name"
            required
            minLength={2}
            autoComplete="name"
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="text-sm font-medium">
          Subject <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          id="subject"
          name="subject"
          className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
          placeholder="Correction, partnership, reader question…"
        />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          rows={6}
          className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
          placeholder="Tell us how we can help. At least 20 characters."
        />
      </div>
      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        <Send className="h-4 w-4" /> {busy ? "Sending…" : "Send message"}
      </button>
      <p className="text-xs text-muted-foreground">
        We use your details only to reply to this message. See our{" "}
        <a href="/privacy" className="text-accent hover:underline">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}
