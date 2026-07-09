## What I'll build

A rebuilt LeasonAI as a modern React (TanStack Start) app, matching the existing brand (navy `#1E3A5F`, Inter + Poppins, "AI for teachers" tone), with a real database, auth, an admin CMS, and Gemini-powered drafting.

## Design system (matches existing site)

- Colors: navy `#1E3A5F` (primary), off-white bg, warm accent for CTAs — defined as oklch tokens in `src/styles.css`.
- Typography: Poppins (headings) + Inter (body) via `@fontsource`.
- Components: rebuilt hero, resource-card grid, newsletter band, footer — same visual DNA as the uploaded `theme/style.css`.

## Pages / routes

Public:
- `/` — hero, cornerstone guides, tool categories, newsletter CTA
- `/guides` — blog index (all published articles, filter by category)
- `/guides/$slug` — article page (SSR head/OG from DB)
- `/tools` — AI tools directory (categorized: writing, image, productivity, education)
- `/prompts` — prompt library
- `/about`, `/contact`, `/editorial-standards`, `/privacy`, `/terms`
- `/auth` — email + Google sign-in
- `/newsletter` — subscribe form

Auth-gated (`/_authenticated/…`):
- `/dashboard` — admin overview
- `/dashboard/articles` — list, publish/unpublish, delete
- `/dashboard/articles/new` and `/dashboard/articles/$id/edit` — full editor with markdown, cover image, category, SEO fields
- `/dashboard/tools` — CRUD AI-tool directory entries
- `/dashboard/prompts` — CRUD prompt library
- `/dashboard/ai-draft` — **Gemini-powered draft generator**: pick a topic/angle → get a full article draft you can edit and save

## Backend (Lovable Cloud / Supabase)

Tables (all with RLS + explicit GRANTs):
- `profiles` (id → auth.users, display_name, avatar_url)
- `user_roles` (user_id, role: admin/editor) + `has_role()` security-definer fn
- `articles` (id, slug, title, excerpt, body_md, cover_url, category, tags[], author_id, status, published_at, seo_title, seo_description)
- `tools` (id, name, slug, category, description, url, logo_url, pricing, rating)
- `prompts` (id, title, category, prompt_text, use_case, tags[])
- `newsletter_subscribers` (id, email, created_at)

Policies:
- Public `SELECT` on published rows only (anon).
- Admins (via `has_role`) full CRUD on all content.
- Any authenticated user can insert into `newsletter_subscribers`.

Seed migration: imports the existing articles from `articles_data.json` in the uploaded repo, plus the tool directory rows and prompt categories.

## AI (Gemini via Lovable AI Gateway)

Server function `generateArticleDraft` using `google/gemini-3-flash-preview` through Lovable AI Gateway (`LOVABLE_API_KEY`, auto-provisioned — no user key required). It takes `{ topic, angle, targetKeywords }` and returns `{ title, excerpt, bodyMarkdown, seoTitle, seoDescription }`. Only callable by admins (`requireSupabaseAuth` + `has_role` check).

Also: `improveArticle` (rewrite selection), `generateSeo` (title/description from body).

## Auth

- Email/password + Google (via Lovable Supabase broker).
- First signed-up user auto-promoted to `admin` role (migration trigger) so you can log in and use the CMS immediately; later users default to no role.
- `/auth` public page; dashboard sits under managed `_authenticated/` layout.

## Rollout order (single build turn)

1. Enable Lovable Cloud.
2. Migration: tables, RLS, GRANTs, roles, first-admin trigger, seed content.
3. Configure Google auth.
4. Design system (fonts, tokens) + shared header/footer.
5. Public pages: home, guides list, article page, tools, prompts, about, contact.
6. Auth page.
7. Admin dashboard: articles CRUD + rich editor, tools/prompts CRUD.
8. Gemini AI draft generator.
9. `sitemap.xml`, `robots.txt`, per-route SEO metadata.

## Notes / trade-offs

- The NestJS backend and static HTML site from the zip are not ported literally — they're replaced by this React + Supabase stack (Node/Docker won't run in Lovable).
- AdSense, Google Sheets integration, and Apps Script bits from the old repo are skipped unless you ask for them.
- The article editor uses markdown (with live preview), not a WYSIWYG — simpler and reliable. Say the word if you want rich-text.

Reply "go" to build it, or tell me what to adjust.