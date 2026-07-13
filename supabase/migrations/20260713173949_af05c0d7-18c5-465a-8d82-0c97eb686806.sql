
INSERT INTO public.articles (slug, title, excerpt, body_md, category, tags, cover_url, reading_time_minutes, seo_title, seo_description, status, published_at)
VALUES
(
  'ai-lesson-plans-from-standards-to-slides',
  'From Standards to Slides: Building AI Lesson Plans That Actually Work',
  'A repeatable 6-step workflow to turn a single standard into a full lesson with objectives, warm-up, direct instruction, practice, formative check, and exit ticket.',
  $md$Most teachers do not need another AI demo. You need a workflow that fits inside a 40-minute prep, produces something your students can actually use tomorrow, and does not require you to babysit the AI.

This is the exact 6-step lesson-planning workflow we use with teacher coaches across three districts. It works in ChatGPT, Gemini, Claude, or Copilot with no plugins.

## Step 1 — Anchor on one standard, not a topic

Start the prompt with the exact standard code and the standard text.

> "You are helping a 7th grade math teacher plan one 45-minute lesson for CCSS.MATH.7.RP.A.2 (Recognize and represent proportional relationships). Do not deviate from this standard."

Anchoring on a standard, not a topic like "proportions", forces the model to align every activity to the assessed skill. This is the single biggest lift in lesson quality we see.

## Step 2 — Give the AI your constraints in one block

Paste your real-world constraints once, up front:

- Class size and mix (e.g. 28 students, 6 IEPs, 4 ELLs at WIDA 2-3)
- Available minutes
- Available materials (Chromebooks yes/no, whiteboards, manipulatives)
- What students did yesterday and what comes tomorrow
- Your rule (e.g. "no worksheets, must include one collaborative task")

AI plans get generic because we give generic prompts. Constraints are what make the plan yours.

## Step 3 — Ask for the plan in the exact structure you use

Do not accept whatever structure the AI defaults to. Give it your template:

> Return the lesson in this exact order: Objective (I can...), Success Criteria (3 bullets), Warm-up (5 min), Direct Instruction (10 min, include the 2 examples you would work), Guided Practice (10 min, include the exact questions), Independent Practice (10 min), Formative Check (5 min, include exit ticket with answer key), Differentiation (one scaffold, one extension).

The answer key is the tell. If you cannot use the plan without rewriting the questions, the AI did the easy 40% and left the hard 60% for you.

## Step 4 — Force it to write the materials, not describe them

Weak prompt: "Include a warm-up."
Strong prompt: "Write the 3 warm-up problems in full, with numbers, and provide the worked solution for each."

Describing an activity is not the same as producing one. Ask for the artifact.

## Step 5 — Run a red-team pass

Before you accept the plan, paste it back with:

> Act as a skeptical instructional coach. Find the 3 weakest moments in this lesson where a student is most likely to disengage or get confused. Rewrite only those 3 moments.

This single move upgrades most AI lessons from "usable" to "good".

## Step 6 — Save the prompt, not the lesson

The lesson is worth an hour. The prompt is worth a year. Keep a running doc of the constraint block and structure template from Steps 2-3. Reuse it. Every lesson gets faster.

## Watch-outs

- Never paste student names, IEP numbers, or grades into a public AI tool.
- Always work an example problem yourself before class. AI still slips numbers.
- Do not let the AI write objectives from scratch — start from your curriculum map.

## A takeaway you can use tomorrow

Pick your next lesson. Write the constraint block once. Ask for the plan in your structure. Red-team it. Teach it. Then save that prompt. You just built a personal planning engine that gets better every week.$md$,
  'guides',
  ARRAY['lesson planning','workflows','prompts','standards'],
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80',
  9,
  'AI Lesson Plans: A 6-Step Workflow for Teachers | LeasonAI',
  'A repeatable 6-step AI lesson-planning workflow that turns one standard into a full, teach-ready lesson in under 15 minutes.',
  'published',
  now() - interval '1 hour'
),
(
  'formative-assessment-with-ai-five-workflows',
  'Formative Assessment with AI: 5 Workflows That Save Real Time',
  'Five classroom-tested ways to use AI for formative assessment with the exact prompts.',
  $md$Formative assessment is the highest-leverage thing a teacher does. It is also the first thing that dies when the week gets busy. AI cannot replace your judgment, but it can absorb the mechanical work — clustering, tagging, drafting — so you have time to actually respond.

Here are five workflows that hold up in real classrooms, with the exact prompts.

## 1. Exit-ticket clustering

Type or paste 25-30 student exit-ticket answers into an AI tool. Prompt:

> Group these answers into 3-5 clusters by underlying reasoning. For each cluster: (1) name the pattern, (2) give the count, (3) quote one representative answer, (4) name the one misconception or partial understanding driving it.

Instead of 30 minutes of sorting, you get a diagnosis in 90 seconds. You still read every answer — but you read them with a map.

## 2. Misconception mining from a single problem

Before you teach a tricky topic, prompt:

> List the 6 most common misconceptions 8th graders hold about solving two-step equations with variables on both sides. For each: the mental model, why it is intuitive, the exact error it produces, and one probing question I can ask a student to surface it.

Walk into class with the probing questions on a sticky note. Cold-call with them. You will find real thinking, not just wrong answers.

## 3. Quick-check generation aligned to your example

After direct instruction, prompt:

> Write 4 quick-check questions at the exact difficulty of this worked example: [paste]. Two should target the concept, one should require transfer, one should be a common-misconception trap. Include the answer key and the misconception that each trap catches.

The misconception column is what makes the check formative instead of just short.

## 4. Feedback banks by error type

Once a quarter, prompt:

> Based on this rubric [paste] and these 10 sample student paragraphs [paste], write a bank of 12 short feedback comments (max 2 sentences each) — 3 for each rubric dimension. Voice: warm, specific, actionable, second-person.

Save the bank in a Google Doc. Copy-paste when grading. Personalize by name. Your feedback stays consistent and you cut grading time by half.

## 5. Reteach planner from a formative check

After a low-scoring quiz, paste the item analysis and prompt:

> Design a 15-minute reteach for the 2 items with lowest performance. Include: the misconception driving the miss, one visual/analog explanation, 3 practice items at increasing difficulty with answer key, and an exit ticket to confirm mastery.

This is the workflow that turns "everyone bombed question 7" into a decision.

## Guardrails

- Never upload student names, IDs, or IEP data. Strip identifiers first.
- AI is not a grader. It clusters, drafts, and suggests. You decide.
- Sample the AI output — spot-check 3-5 items every time. Models slip.

## The bottom line

AI does not make you a better teacher. Faster feedback loops do. AI just makes faster feedback loops affordable inside a normal week.$md$,
  'guides',
  ARRAY['assessment','feedback','workflows','prompts'],
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80',
  8,
  'Formative Assessment with AI: 5 Real Workflows | LeasonAI',
  'Five teacher-tested AI workflows for formative assessment: exit-ticket clustering, misconception mining, quick checks, feedback banks, reteach planning.',
  'published',
  now() - interval '2 hours'
),
(
  'parent-communication-with-ai-templates-and-guardrails',
  'Parent Communication with AI: Templates, Tone, and Guardrails',
  'How to use AI to draft parent messages that sound like you — plus the privacy rules, tone controls, and 8 ready-to-adapt templates.',
  $md$Parent communication is emotional labor. It is also where trust is built or lost. AI is genuinely useful here — not to replace your voice, but to help you draft when you are tired, translate when you need to, and stay consistent across 100+ families.

Here is how to do it without sounding like a robot or breaching a family privacy expectation.

## The one rule that matters most

Never put a family or student identifier into a public AI tool. That means:

- No first names, last names, or nicknames
- No student ID, class period, or IEP designation
- No specific incident details that could identify a child

Use placeholders: [STUDENT], [GRADE], [SUBJECT], [DATE]. Paste your actual names in after, inside your email client, offline from the AI.

## Get the tone right in one line

Add this to every prompt:

> Voice: warm, professional, second-person, plain English at a Grade 7 reading level. Do not use jargon. Do not use "I hope this email finds you well." Keep under 120 words.

That one paragraph is the difference between AI-slop and something you would send.

## 8 templates you can adapt today

### 1. Positive progress note
> Draft a 100-word email to a caregiver noting that [STUDENT] has made specific progress on [SKILL] this week. Reference one concrete example: [EXAMPLE]. End with one suggestion for supporting the skill at home.

### 2. Missing-work check-in
> Draft a 90-word email noting that [STUDENT] has [N] missing assignments in [SUBJECT]. Non-accusatory tone. Offer a specific make-up path and one office hour. Invite the caregiver to share anything I should know.

### 3. Behavior concern (non-crisis)
> Draft a 120-word email opening a conversation about a pattern I have noticed in [STUDENT]: [BEHAVIOR]. Frame as curiosity, not accusation. Ask one specific question. Propose a 15-minute call.

### 4. Conference preview
> Draft a 5-bullet pre-conference note for a caregiver: 2 strengths, 2 growth areas, 1 question for the family. Neutral tone, no letter grade language.

### 5. Field-trip logistics
> Draft a scannable logistics message: what, when, where, cost, permission form, contact. Bullet list, no fluff.

### 6. Translation request
> Translate the following message into [LANGUAGE] at a Grade 7 reading level, preserving warmth and formality expected in that language. Provide the translation and a back-translation to English so I can verify meaning.

### 7. Grade-change explanation
> Draft a 100-word note explaining that a grade was updated because of [REASON]. Take clear ownership of any error on my end. State the new grade and the assignment. Offer a 5-minute call to answer questions.

### 8. End-of-unit summary
> Draft a 120-word class-wide update summarizing what we studied in [UNIT], what we are proud of, and what is coming next. Include one at-home conversation starter.

## The finishing pass — always human

Before you hit send:

- Read aloud. If it sounds like a robot, cut one line and add one specific detail.
- Add the family last name and the student first name.
- Double-check names, pronouns, dates, and any factual claim.
- Remove anything the AI added that you cannot personally back up.

## Guardrails for translated messages

- Always ask for the back-translation. That is your check on meaning.
- For high-stakes topics (safety, discipline, medical), use your district-approved translator, not AI.
- Note in your records which languages you used AI for.

## Why this actually helps

Good parent communication is not about being fancy — it is about being timely, specific, and consistent. AI removes the friction that keeps busy teachers from sending the positive note on Tuesday and the check-in on Thursday. Those small consistent messages are what build trust across a year.$md$,
  'guides',
  ARRAY['parent communication','ethics','templates','prompts'],
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1600&q=80',
  10,
  'Parent Communication with AI: Templates & Guardrails | LeasonAI',
  'Use AI to draft parent messages that still sound like you — 8 templates, tone controls, translation rules, and privacy guardrails.',
  'published',
  now() - interval '3 hours'
),
(
  'ai-for-iep-and-504-support-what-is-appropriate',
  'AI for IEP and 504 Support: What Is Appropriate, What Is Not',
  'A clear line between AI use that supports special education teachers and use that risks privacy, ethics, or FAPE.',
  $md$Nowhere in the AI-in-classroom conversation is the line between "helpful" and "harmful" thinner than in special education. Case managers are drowning in documentation. AI can absorb some of that. But some of the most tempting uses of AI in this space are also the most dangerous — legally, ethically, and for the student.

Here is a clear line between what is appropriate today and what is not.

## What is appropriate

Every workflow below assumes you have stripped identifiers before pasting into any AI tool: no names, no student IDs, no birthdates, no addresses, no diagnosis codes tied to a specific child.

### 1. Rewriting accommodations for parent-friendly language
Paste a de-identified accommodation and ask AI to rewrite it at a Grade 7 reading level for a caregiver-facing document. You still author it. AI just makes it accessible.

### 2. Drafting scaffold libraries by need type
> "List 8 reading scaffolds for a middle-school student who processes text slowly but has strong oral comprehension. For each: what it looks like in class, when to fade it, and how to know it is working."

This kind of general knowledge query is fully appropriate and immensely useful.

### 3. Generating tiered task versions
Paste a general-education assignment. Ask AI to produce three tiered versions targeting the same standard at different scaffolding levels. Review, adjust, deploy.

### 4. Meeting-prep summaries of publicly available frameworks
Ask AI to summarize what UDL, MTSS, or a specific IDEA provision generally covers so you walk into a meeting with shared vocabulary. This is background knowledge, not student data.

### 5. Drafting progress-monitoring rubrics
Describe a goal in general terms and ask AI to draft a 4-point weekly rubric. You edit for your student.

### 6. Reformatting between formats
Paste a lesson plan and ask AI to reformat it into a visual schedule, a first-then-next-last strip, or a checklist. Structure, not content, is being transformed.

## What is not appropriate

### 1. Writing IEPs or 504s in a public AI tool
The IEP is a legally binding document. Its present levels, goals, and services are individualized to a specific child based on evaluation data. Do not paste evaluation reports, present levels, or goal drafts into a public AI. Use only district-approved, contract-covered tools.

### 2. Making eligibility decisions
AI does not qualify a child for services. Eligibility is a team decision based on evaluation data, observation, and educational impact.

### 3. Manifestation determination or discipline analysis
These are legally sensitive team decisions. AI has no role in weighing whether a behavior is a manifestation of a disability.

### 4. Generating a diagnosis or specific service recommendation for a real child
Even with names stripped, describing a specific child in enough detail that a reasonable person could identify them — and then asking AI to recommend services or a diagnosis — crosses a line. AI is not a clinician and does not know your student.

## Practical guardrails to hand your team

- Use only tools your district has a data-processing agreement with for anything student-specific.
- Any AI output that touches an IEP is a draft. The team is the author.
- When in doubt, ask: "Would I be comfortable if a caregiver saw the exact prompt I typed?"
- Log the prompt with the final artifact in your records. That is your paper trail.

## Why the line matters

Special education law exists because these decisions are high-stakes and easy to get wrong. AI can save you real time on the mechanical parts of the job. It cannot be delegated to for the decision parts. Keep the tool where it belongs — on drafting, formatting, and background research — and the trust you have built with families stays intact.$md$,
  'ethics',
  ARRAY['special education','ethics','iep','privacy'],
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80',
  9,
  'AI for IEP & 504: What Is Appropriate, What Is Not | LeasonAI',
  'Clear line between AI uses that support special education teachers and uses that risk privacy, ethics, and FAPE.',
  'published',
  now() - interval '4 hours'
),
(
  'teaching-digital-citizenship-in-the-age-of-generative-ai',
  'Teaching Digital Citizenship in the Age of Generative AI',
  'A 5-lesson mini-unit for grades 6-12 on using generative AI ethically: attribution, verification, bias, privacy, and voice.',
  $md$Do not use AI is not a digital citizenship curriculum. Our students are going to graduate into a world where generative AI is as common as spellcheck. The question is not whether they will use it. The question is whether they will use it thoughtfully.

This mini-unit is designed for grades 6-12, five 40-minute lessons, no special tools required. It has been piloted in ELA, social studies, and CS classrooms.

## Lesson 1 — Attribution: Who gets credit?

### Goal
Students can name three attribution rules for AI-assisted work and defend one contested case.

### Activity
Present 4 scenarios: (a) AI wrote the whole essay, (b) AI outlined and student drafted, (c) student drafted and AI polished grammar, (d) AI generated brainstorm ideas the student rejected. In small groups, students place each on a 0-100% "how much is the student work" scale and justify.

### Discussion prompt
> Is using AI to fix your grammar different from using AI to fix your ideas? Where is the line?

### Exit ticket
Write one sentence you could ethically place at the top of a paper that used AI at some stage.

## Lesson 2 — Verification: Does it check out?

### Goal
Students can identify one AI-generated claim, verify it against two independent sources, and rate the AI accuracy.

### Activity
Give students an AI-generated paragraph about a topic they can verify (a historical event, a scientific claim, a local geography fact). Their job: highlight every factual claim, then verify each against a library database and a primary source. Score the paragraph out of 10.

### Discussion prompt
> The paragraph sounded very confident. Did that confidence match its accuracy?

### Exit ticket
One rule you will follow the next time you use an AI-generated fact.

## Lesson 3 — Bias: Whose voice is missing?

### Goal
Students can identify one form of bias in an AI response and propose a re-prompt that surfaces missing perspectives.

### Activity
Ask the AI: "Name the 10 most important scientists of the 20th century." Analyze the list together. Whose names appear? Whose do not? What patterns show up in gender, geography, discipline? Re-prompt: "Name 10 important scientists of the 20th century from at least 5 continents and with at least 5 women." Compare.

### Discussion prompt
> The AI is trained on the internet. What does that tell you about whose voices it has learned from most?

### Exit ticket
One question you could ask before trusting an AI list.

## Lesson 4 — Privacy: What are you giving away?

### Goal
Students can identify three types of information they should not share with a public AI tool.

### Activity
Role-play. In pairs, one student is the user who wants help with a real problem. The other is the AI whose job is to gently point out what personal information the user is about to share. Rotate.

### Discussion prompt
> What is the difference between sharing something with a friend, a teacher, and an AI tool owned by a company?

### Exit ticket
One piece of information you will not share with a public AI, and why.

## Lesson 5 — Voice: What is yours?

### Goal
Students can distinguish their own writing voice from AI-generated writing and defend the value of the difference.

### Activity
Students write a 100-word paragraph on a topic they care about. Then they paste that paragraph into an AI and ask it to make this sound more professional. Compare side by side in pairs. What did the AI add? What did it take out? Which version sounds more like you?

### Discussion prompt
> If a college admissions officer reads a thousand essays, which one is memorable — yours or the polished AI version?

### Exit ticket
One sentence describing your writing voice in your own words.

## Final project

Students produce a short piece of writing using AI at any stage they choose. They submit three artifacts:

1. The final piece
2. An AI use statement — 100 words on how they used AI and why
3. A short reflection on which of the 5 lessons most changed their approach

### Rubric (4 points each)
- Voice: The final piece sounds like a person, not a template.
- Verification: Every factual claim is checkable and correct.
- Attribution: The AI-use statement is honest, specific, and reasoned.
- Perspective: The piece considers a viewpoint the AI did not surface on its own.
- Reflection: The reflection shows genuine thinking, not compliance.

## Why this matters

We do not teach students to avoid tools. We teach them to use tools well. Digital citizenship in the age of AI is not a warning — it is a skill set. Build it deliberately.$md$,
  'ethics',
  ARRAY['digital citizenship','ethics','curriculum','secondary'],
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1600&q=80',
  11,
  'Digital Citizenship in the Age of Generative AI | LeasonAI',
  'A ready-to-teach 5-lesson mini-unit for grades 6-12 on ethical AI use: attribution, verification, bias, privacy, and voice.',
  'published',
  now() - interval '5 hours'
);
