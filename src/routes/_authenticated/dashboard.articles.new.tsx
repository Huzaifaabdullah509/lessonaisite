import { createFileRoute } from "@tanstack/react-router";
import { ArticleEditor, emptyDraft } from "@/components/article-editor";

export const Route = createFileRoute("/_authenticated/dashboard/articles/new")({
  component: () => <ArticleEditor initial={emptyDraft} />,
});
