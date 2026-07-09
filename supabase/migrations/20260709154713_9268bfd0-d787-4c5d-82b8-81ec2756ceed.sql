
-- =========== ROLES ===========
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- =========== PROFILES ===========
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are readable by anyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- =========== TRIGGER: auto profile + first-user admin ===========
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  SELECT count(*) INTO user_count FROM public.user_roles;
  IF user_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========== UPDATED_AT HELPER ===========
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- =========== ARTICLES / GUIDES ===========
CREATE TYPE public.article_status AS ENUM ('draft', 'published');

CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  body_md TEXT NOT NULL DEFAULT '',
  cover_url TEXT,
  category TEXT NOT NULL DEFAULT 'guides',
  tags TEXT[] NOT NULL DEFAULT '{}',
  reading_time_minutes INT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status public.article_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published articles"
  ON public.articles FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert articles"
  ON public.articles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update articles"
  ON public.articles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete articles"
  ON public.articles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER articles_set_updated_at BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_articles_status_published ON public.articles(status, published_at DESC);
CREATE INDEX idx_articles_category ON public.articles(category);

-- =========== TOOLS DIRECTORY ===========
CREATE TABLE public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  logo_url TEXT,
  pricing TEXT,
  rating NUMERIC(2,1),
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tools TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tools TO authenticated;
GRANT ALL ON public.tools TO service_role;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tools" ON public.tools FOR SELECT USING (true);
CREATE POLICY "Admins can insert tools" ON public.tools FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update tools" ON public.tools FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete tools" ON public.tools FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER tools_set_updated_at BEFORE UPDATE ON public.tools
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========== PROMPTS LIBRARY ===========
CREATE TABLE public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  use_case TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.prompts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prompts TO authenticated;
GRANT ALL ON public.prompts TO service_role;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read prompts" ON public.prompts FOR SELECT USING (true);
CREATE POLICY "Admins can insert prompts" ON public.prompts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update prompts" ON public.prompts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete prompts" ON public.prompts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER prompts_set_updated_at BEFORE UPDATE ON public.prompts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========== NEWSLETTER SUBSCRIBERS ===========
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT INSERT, SELECT ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view subscribers"
  ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =========== SEED ARTICLES ===========
INSERT INTO public.articles (slug, title, excerpt, body_md, category, tags, reading_time_minutes, status, published_at, seo_title, seo_description) VALUES
('complete-guide-ai-for-teachers',
 'The Complete Guide to AI for Teachers in 2026',
 'A practical, policy-aware guide to using AI for planning, feedback, differentiation, communication, and assessment — without weakening teacher judgment.',
 E'# The Complete Guide to AI for Teachers in 2026\n\nArtificial intelligence has moved from novelty to daily tool in the modern classroom. This guide gives working teachers a **practical, policy-aware** framework for using AI without outsourcing your professional judgment.\n\n## Why teachers should care about AI\n\nAI can compress hours of planning into minutes — *if you use it well*. Used badly, it produces generic, error-prone content that undermines instruction. The goal is not to replace teaching, but to reclaim time for the parts of the job only a human can do.\n\n## Six high-value classroom uses\n\n1. **Lesson planning** — outline standards-aligned lessons in seconds.\n2. **Differentiation** — rewrite the same text at three reading levels.\n3. **Feedback** — draft substantive comments on student writing.\n4. **Parent communication** — polish sensitive emails.\n5. **Assessment** — generate diverse question banks and rubrics.\n6. **Administrative work** — summarize meeting notes, draft newsletters.\n\n## The three-question filter\n\nBefore trusting any AI output, ask:\n\n- **Is it accurate?** Cross-check facts.\n- **Is it aligned?** Does it match your standards and your students?\n- **Is it appropriate?** Would you be comfortable if a parent read it?\n\n## Privacy and student data\n\nNever paste identifiable student data into consumer AI tools. Use district-approved platforms, redact names, and follow your school''s AI policy.\n\n## What to try this week\n\nPick one workflow — differentiated exit tickets are a great start — and run it through AI for a full week. Measure the time saved, and the quality delta, honestly.\n\n> AI is a co-planner, not a co-teacher. Keep the pedagogy human.',
 'guides', ARRAY['ai','teachers','lesson-planning'], 12, 'published', now() - interval '10 days',
 'Complete Guide to AI for Teachers 2026 | LeasonAI',
 'A practical, teacher-first guide to using AI in the classroom for planning, feedback, and assessment — with a privacy and policy framework you can adopt today.'),

('ai-lesson-planning-master-guide',
 'AI Lesson Planning: A Master Guide for Educators',
 'A complete classroom planning system for using AI to draft, review, differentiate, and improve lessons while keeping curriculum alignment and student safety first.',
 E'# AI Lesson Planning: A Master Guide for Educators\n\nGood lesson planning takes clarity, alignment, and iteration. AI accelerates each stage — but only if you drive it with structure. Here is the workflow we recommend.\n\n## The 5-stage AI planning loop\n\n1. **Frame** — write a one-sentence objective in student language.\n2. **Draft** — ask the AI to propose 3 lesson skeletons.\n3. **Align** — check standards, misconceptions, and prerequisites.\n4. **Differentiate** — generate scaffolds for ELL, IEP, and enrichment.\n5. **Assess** — build formative checks and an exit ticket.\n\n## Prompt template: standards-aligned lesson\n\n```\nYou are a curriculum designer. Design a {duration}-minute lesson for {grade} on {topic}.\nStandards: {standards}.\nObjectives: {objectives}.\nOutput: warm-up (5 min), mini-lesson (10 min), guided practice (15 min),\nindependent practice (15 min), exit ticket (5 min). Include one common misconception.\n```\n\n## Differentiation without guesswork\n\nAsk the AI to rewrite any passage at Lexile 600, 800, and 1000. Then compare — you''ll spot where meaning drifts, which is where *you* need to reteach.\n\n## Watch-outs\n\n- AI invents citations. Always verify sources.\n- AI is confident about wrong math. Check every problem.\n- AI defaults to bland examples. Push it to be specific to your students.\n\nPair this workflow with the [Complete Guide to AI for Teachers](/guides/complete-guide-ai-for-teachers) and you have a repeatable planning system.',
 'guides', ARRAY['lesson-planning','prompts'], 10, 'published', now() - interval '9 days',
 'AI Lesson Planning Master Guide | LeasonAI',
 'A 5-stage AI lesson planning workflow with prompt templates, differentiation tips, and quality checks for busy teachers.'),

('best-chatgpt-prompts-for-educators',
 '100 Best ChatGPT Prompts for Educators',
 'Reusable prompt patterns for lesson planning, feedback, quizzes, parent communication, and classroom routines.',
 E'# 100 Best ChatGPT Prompts for Educators\n\nCopy, adapt, and reuse. These prompts follow the *role-context-task-format* pattern that produces reliably usable output.\n\n## Lesson planning\n\n1. *Act as a K–2 literacy coach. Design a 20-minute phonics mini-lesson on short-i words with a warm-up, teaching, and closure.*\n2. *Rewrite the following passage at three reading levels: grade 3, grade 6, grade 9. Preserve key vocabulary.*\n\n## Feedback\n\n3. *You are a supportive middle-school English teacher. Give three specific, kind, actionable comments on this student paragraph, plus one glow.*\n\n## Parent communication\n\n4. *Draft a warm, professional email to a parent about missed homework. Assume the family has had a difficult week. 120 words.*\n\n## Quizzes and assessment\n\n5. *Create 10 multiple-choice questions on photosynthesis for 7th grade, with 4 options each and an answer key. Include 2 higher-order questions.*\n\n## Classroom management\n\n6. *Give me a 90-second transition routine for a lively 4th-grade class returning from lunch. Include a clear signal and a brain break.*\n\n(Full 100-prompt library coming soon — subscribe to The Brief to get it first.)',
 'prompts', ARRAY['chatgpt','prompts','templates'], 8, 'published', now() - interval '8 days',
 '100 Best ChatGPT Prompts for Teachers | LeasonAI',
 'A working library of ChatGPT prompts for lesson planning, feedback, quizzes, parent communication, and classroom management.'),

('ethical-ai-usage-in-schools',
 'Ethical AI Usage in Schools: A Practical Framework',
 'A school-ready framework for privacy, transparency, academic integrity, bias review, and age-appropriate AI use.',
 E'# Ethical AI Usage in Schools\n\nEthics is not an afterthought. It is the difference between AI that supports learning and AI that erodes trust. This framework is designed to be adopted by a school leadership team in one meeting.\n\n## The five pillars\n\n1. **Privacy** — no identifiable student data in consumer tools.\n2. **Transparency** — students and parents know when AI is used.\n3. **Academic integrity** — clear rules about AI-assisted vs AI-generated work.\n4. **Bias review** — sample AI outputs across demographics quarterly.\n5. **Developmentally appropriate use** — different rules for K–2, 3–5, 6–8, 9–12.\n\n## A one-page classroom policy template\n\n- *You may use AI to brainstorm and check your work.*\n- *You may not submit AI-generated text as your own.*\n- *If you use AI, tell me how you used it.*\n- *We will use AI together, with the class, more than alone.*\n\n## Talking to parents\n\nSend the policy home. Host a 30-minute Q&A. Publish an FAQ. Trust grows with transparency.\n\n## Reviewing AI tools\n\nBefore adopting any tool, answer: *Who owns the data? Where is it stored? Is it FERPA/COPPA aligned? Can we delete it?*',
 'ethics', ARRAY['ethics','policy','safety'], 9, 'published', now() - interval '7 days',
 'Ethical AI Usage in Schools | LeasonAI',
 'A five-pillar ethics framework and a one-page classroom AI policy your school can adopt this term.'),

('best-ai-tools-for-teachers-2026',
 'The Best AI Tools for Teachers in 2026',
 'A careful comparison of classroom AI tools by usefulness, privacy posture, review effort, and adoption fit.',
 E'# The Best AI Tools for Teachers in 2026\n\nEvery review below is written by a teacher, tested in a real classroom, and scored on **instructional value**, **privacy**, and **time saved**.\n\n## Top picks\n\n### For lesson planning: MagicSchool AI\nBuilt for educators. Solid lesson templates. FERPA-friendly. Free tier is generous.\n\n### For feedback: Curipod\nInteractive lessons with AI-assisted feedback loops. Best for grades 4–10.\n\n### For writing support: Grammarly for Education\nMature product, sensible privacy controls, easy district rollout.\n\n### For images: Adobe Firefly (Education)\nCommercially safe, no training on your prompts, great for slide decks.\n\n### For general purpose: ChatGPT / Gemini (with district guardrails)\nMost flexible, but requires clear school policy. See our [ethics framework](/guides/ethical-ai-usage-in-schools).\n\n## How to evaluate a new tool in 20 minutes\n\n1. Read the privacy policy — search for "training", "share", "sell".\n2. Run three real lessons through it.\n3. Ask three colleagues to try it.\n4. Score usefulness, privacy, and rollout effort out of 5 each.\n\nWe update these reviews quarterly.',
 'tool-reviews', ARRAY['tools','reviews','2026'], 11, 'published', now() - interval '6 days',
 'Best AI Tools for Teachers 2026 | LeasonAI',
 'Teacher-tested reviews of the best AI tools for the classroom in 2026, scored on usefulness, privacy, and rollout effort.'),

('save-10-hours-weekly-using-ai',
 'How Teachers Can Save 10 Hours a Week Using AI',
 'A realistic weekly workflow for reducing planning, grading, communication, and resource creation time — without outsourcing professional judgment.',
 E'# How Teachers Can Save 10 Hours a Week Using AI\n\nTen hours is not marketing hyperbole. It is what a well-designed AI workflow returns to a full-time teacher, based on classroom data from our review network.\n\n## Where the hours come from\n\n| Task | Old time | With AI | Weekly saving |\n|------|----------|---------|---------------|\n| Lesson planning | 6 hrs | 2 hrs | 4 hrs |\n| Feedback drafts | 4 hrs | 1.5 hrs | 2.5 hrs |\n| Parent emails | 2 hrs | 30 min | 1.5 hrs |\n| Resource creation | 3 hrs | 1 hr | 2 hrs |\n| **Total** | **15 hrs** | **5 hrs** | **10 hrs** |\n\n## The Monday–Friday rhythm\n\n- **Monday** — plan the week with AI in one focused hour.\n- **Tuesday** — differentiate one lesson.\n- **Wednesday** — draft parent emails and newsletter.\n- **Thursday** — build formative checks.\n- **Friday** — reflect: what did AI help, what did it hinder?\n\n## Guardrails\n\n- **Cap AI time.** If you spend 45 minutes prompting instead of 20 planning, stop.\n- **Save prompts that work.** Build a personal prompt library.\n- **Never skip the read-through.** AI hallucinates. Your judgment is the last line.\n\nStart with lesson planning — that alone tends to save 4 hours in week one.',
 'guides', ARRAY['productivity','workflow'], 8, 'published', now() - interval '5 days',
 'Save 10 Hours a Week with AI | LeasonAI',
 'A realistic weekly workflow that returns 10 hours to teachers through AI-assisted planning, feedback, and communication.');

-- =========== SEED TOOLS ===========
INSERT INTO public.tools (slug, name, category, description, url, pricing, rating, featured) VALUES
('chatgpt', 'ChatGPT', 'General AI', 'The most versatile chat assistant for planning, writing, and brainstorming.', 'https://chat.openai.com', 'Free / $20', 4.8, true),
('gemini', 'Google Gemini', 'General AI', 'Google''s multimodal AI, strong at long-context tasks and Workspace integration.', 'https://gemini.google.com', 'Free / $20', 4.7, true),
('magicschool', 'MagicSchool AI', 'Education', 'Purpose-built AI platform for teachers with 60+ classroom tools.', 'https://magicschool.ai', 'Free / $9.99', 4.9, true),
('curipod', 'Curipod', 'Education', 'Interactive AI-generated lessons and student engagement activities.', 'https://curipod.com', 'Free / $9', 4.6, false),
('grammarly-edu', 'Grammarly for Education', 'Writing', 'Writing assistant with plagiarism and AI-writing checks for schools.', 'https://grammarly.com/edu', 'Free / District', 4.5, false),
('firefly', 'Adobe Firefly', 'Image', 'Commercially safe AI image generation for slide decks and classroom visuals.', 'https://firefly.adobe.com', 'Free / $5', 4.4, false),
('notion-ai', 'Notion AI', 'Productivity', 'Note-taking with built-in AI for summaries, planning, and drafting.', 'https://notion.so', '$8 add-on', 4.3, false),
('perplexity', 'Perplexity', 'Research', 'AI answer engine that cites sources — great for research and fact-checking.', 'https://perplexity.ai', 'Free / $20', 4.6, true);

-- =========== SEED PROMPTS ===========
INSERT INTO public.prompts (title, category, prompt_text, use_case, tags) VALUES
('Standards-aligned lesson skeleton', 'Lesson Planning',
'You are a curriculum designer. Design a {duration}-minute lesson for {grade} on {topic}. Standards: {standards}. Output: warm-up (5), mini-lesson (10), guided practice (15), independent practice (15), exit ticket (5). Include one common misconception.',
'Rapidly outline a standards-aligned lesson.', ARRAY['lesson','planning']),

('Differentiated reading passage', 'Differentiation',
'Rewrite the following passage at three reading levels: grade 3, grade 6, and grade 9. Preserve key vocabulary and add a glossary for each level.\n\nPassage: {text}',
'Create tiered reading materials in one prompt.', ARRAY['differentiation','reading']),

('Kind, specific student feedback', 'Feedback',
'You are a supportive {grade} teacher. Read this student paragraph and give three specific, kind, actionable comments, plus one glow. Match tone to a {grade} student.\n\nParagraph: {text}',
'Draft substantive, tone-appropriate feedback.', ARRAY['feedback','writing']),

('Warm parent email', 'Communication',
'Draft a warm, professional email to a parent about {topic}. Assume the family has had a difficult week. Keep it under 120 words. Sign as {teacher_name}.',
'Sensitive parent communication in seconds.', ARRAY['communication','parents']),

('Multiple-choice question bank', 'Assessment',
'Create 10 multiple-choice questions on {topic} for {grade}, with 4 options each and an answer key. Include 2 higher-order questions (analysis or evaluation).',
'Generate diverse quiz banks quickly.', ARRAY['assessment','quiz']),

('90-second transition routine', 'Classroom Management',
'Give me a 90-second transition routine for a lively {grade} class returning from {activity}. Include a clear signal, a brain break, and a re-entry cue.',
'Reset the room with a repeatable routine.', ARRAY['management','routines']);
