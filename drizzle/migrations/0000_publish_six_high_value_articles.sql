INSERT INTO public.articles (author_id, title, slug, category, status, published_at, reading_time_minutes, excerpt, seo_title, seo_description, tags, body_md) VALUES
(
'5dabbd21-29ed-4331-af33-0f869ac84b79',
'Teaching Prompt Engineering to Students: A 5-Lesson Unit That Works',
'teaching-prompt-engineering-to-students',
'guides',
'published',
now() - interval '2 hours',
11,
'A classroom-ready five-lesson unit that teaches pupils how to write, test and improve AI prompts - with worked examples, marking criteria and a homework task.',
'Teaching Prompt Engineering to Students: A 5-Lesson Unit (2026)',
'A free five-lesson prompt engineering unit for teachers: objectives, worked examples, pupil tasks, marking criteria and an assessment rubric you can use this week.',
ARRAY['prompt engineering','ai literacy','lesson plans','student skills'],
$md$Most pupils already type things into an AI chatbot. Very few of them know why one request produces a useful answer and the next produces something bland, wrong or oddly confident. That gap is teachable, and it is one of the most transferable skills you can hand a teenager right now: the ability to describe a task precisely enough that someone - or something - can complete it well.

This unit has been run with mixed-ability classes in Years 8 to 11 and adapts easily upwards or downwards. Each lesson is designed for a single 50-minute period. You need one device per pair, not per pupil; pairs argue about wording, and the arguing is where the learning happens.

## What pupils should be able to do by the end

- Break a vague request into a task, an audience, a format and a constraint.
- Predict how changing one element of a prompt changes the output.
- Spot a confidently wrong answer and describe how they checked it.
- Explain, in their own words, when using AI is appropriate for a piece of schoolwork and when it is not.

Notice that only the first two are about AI. The rest are comprehension, verification and academic honesty - skills your curriculum already asks for.

## Lesson 1: The four ingredients

Open with a deliberately bad prompt on the board: *write about the Romans*. Ask the class what an AI cannot possibly know from that sentence. They will list things fast: how long, for whom, which Romans, what for.

Introduce the four ingredients:

1. **Task** - the verb. Explain, compare, summarise, generate, critique.
2. **Audience** - who reads it and what they already know.
3. **Format** - length, structure, bullet points, table, paragraph.
4. **Constraint** - what must or must not appear.

Then rewrite the Roman prompt together:

```
Explain why the Roman army was hard to defeat.
Audience: a Year 8 class who have studied Roman roads but not military tactics.
Format: five short paragraphs, each with a bold topic sentence.
Constraint: use no Latin terms without explaining them in the same sentence.
```

Run both prompts side by side on your own screen. The difference is obvious and it lands without you having to argue for it. Pupils then rewrite three vague prompts of their own using a simple four-box template.

## Lesson 2: Change one thing

This is a controlled experiment, and I introduce it with that language deliberately because it borrows credibility from science lessons.

Pairs take one working prompt from Lesson 1 and produce three variants, each changing exactly one ingredient. They record what changed in the output. A typical results table looks like this:

| Change made | Effect on output |
| --- | --- |
| Audience changed to primary pupils | Shorter sentences, lost the technical detail we wanted |
| Format changed to a table | Easier to revise from, but the reasoning disappeared |
| Constraint removed | More jargon, more confident, less checkable |

The plenary question is the point of the whole lesson: *which version would you actually hand to your revision partner, and why?* Pupils start judging output against a purpose rather than against how impressive it sounds.

## Lesson 3: Catching the confident mistake

Give every pair an AI answer you have prepared in advance that contains two factual errors and one invented source. Do not tell them how many. Their task is to mark it like a teacher, with a red pen, and to write one sentence next to each correction explaining how they verified it.

This is the lesson that changes behaviour. Pupils who have personally caught an AI inventing a book title stop treating output as fact. Keep a running wall display of errors the class has caught during the term - it becomes the most effective anti-plagiarism poster in the room, because they wrote it.

A useful checking routine to teach here:

- Can I find this claim in two places that are not AI-generated?
- Does the source actually exist, and does it say what the answer claims?
- Is a number given without a date or a population? Treat it as unverified.

## Lesson 4: Prompts that help you learn, not prompts that do the work

Pupils sort a deck of twenty prompt cards into two piles: *helps me learn* and *does the work for me*. Expect a genuinely heated discussion, because the boundary is not obvious.

Examples that belong in the first pile:

- *Ask me five questions about photosynthesis, one at a time, and tell me what my answers are missing.*
- *Here is my paragraph. Do not rewrite it. Point out the two weakest sentences and explain why.*
- *Explain this concept at three difficulty levels so I can find the one I understand.*

Examples that belong in the second pile are the ones they are already using, and they know it. Finish by having the class draft its own AI usage rule for your subject, in three bullet points, and display it. Rules pupils write are rules pupils police.

## Lesson 5: Assessed task

Pupils receive a real problem from your subject and submit three things: their final prompt, the output, and a 150-word commentary on what they changed and why, plus one thing they verified independently.

Mark the process, not the polish:

| Criterion | Descriptor |
| --- | --- |
| Prompt precision | All four ingredients present and appropriate to the task |
| Iteration | At least two improvements, each justified |
| Verification | One claim checked against a named non-AI source |
| Judgement | Explains where the output was still not good enough |

A pupil who submits a mediocre output with an excellent commentary should outscore one who submits a slick output with nothing to say about it. That signal matters more than the marks.

## Three things that went wrong the first time I taught this

**Devices one-to-one.** Pupils stopped talking and started racing. Pairs fixed it immediately.

**No prepared bad answer.** Asking a current model to produce errors on demand is unreliable. Save a flawed answer to a document in advance and reuse it for years.

**Letting the unit run without a subject anchor.** Prompt engineering taught in the abstract becomes a technology lesson pupils forget. Anchor every task in content you are already teaching that half-term.

## FAQ

**Do I need paid AI accounts for this?**
No. Every lesson works with a free tier, and Lessons 1, 3 and 4 work with no pupil accounts at all if you drive a single screen at the front.

**What if my school blocks AI tools for pupils?**
Run it as a teacher-demonstration unit. Pupils still write and critique prompts on paper; you execute them. Roughly 80 per cent of the learning survives.

**Is this not just teaching them to cheat more efficiently?**
The opposite, in practice. Pupils who understand how these systems produce text become much harder to impress with it - and Lessons 3 and 4 give you shared vocabulary for honesty conversations you would otherwise have one-to-one after the fact.

**How do I fit five lessons into a crowded scheme of work?**
Compress to three: merge Lessons 1 and 2, keep Lesson 3 intact because it carries the most weight, and run Lesson 5 as homework. Do not cut Lesson 3.
$md$
),
(
'5dabbd21-29ed-4331-af33-0f869ac84b79',
'Marking 120 Essays in a Weekend: The Honest AI Workflow',
'marking-120-essays-with-ai-workflow',
'productivity',
'published',
now() - interval '3 hours',
10,
'A step-by-step marking workflow that cuts a 120-essay pile from eleven hours to about four - including the parts of marking you must never hand over.',
'Marking 120 Essays With AI: An Honest Teacher Workflow',
'A realistic, tested AI marking workflow for teachers: batching, rubric anchoring, comment banks and the five checks that keep feedback accurate and fair.',
ARRAY['marking','feedback','workload','assessment'],
$md$A pile of 120 essays takes most secondary teachers between nine and twelve hours to mark properly. I have got mine down to roughly four, and the feedback pupils receive is measurably more specific than it was before. What follows is the exact sequence, including the parts where I stopped using AI because it made the work worse.

Be clear about the claim: this is not automated marking. Every grade in my workflow is awarded by me. What changes is where my hours go - away from retyping the same six comments and towards the decisions only a teacher can make.

## Before you touch a device

Two preparation steps do most of the work.

**Write your rubric as if a stranger had to apply it.** Vague criteria such as *good analysis* produce vague feedback whether a human or a machine drafts it. Replace them with observable evidence: *makes a claim, supports it with a named example, explains how the example supports the claim*. This single rewrite improved my feedback quality more than any tool did.

**Mark ten scripts by hand first.** Choose a spread: two strong, two weak, six middling. You are calibrating yourself and simultaneously producing the anchor examples the rest of the workflow depends on. Skip this and everything downstream drifts.

## Step 1: Build a comment bank from your own marking

Take the ten hand-marked scripts and paste the comments you actually wrote into a document. Then ask an assistant to do something narrow:

```
Here are 38 feedback comments I wrote while marking Year 10 history essays.
Group them into themes. For each theme, give me:
- the shortest version of the comment that keeps the specificity
- one "next step" sentence phrased as an action the pupil can take tomorrow
Do not invent comments I did not write.
```

That last line matters. Unconstrained, you get generic edu-speak. Constrained to your own words, you get a reusable bank in your voice. Mine collapsed to nine themes and lives in a document I have reused for three years.

## Step 2: Batch by rubric criterion, not by pupil

This is the change that saved the most time, and it has nothing to do with AI. Instead of reading each essay once and judging six criteria simultaneously, read the whole pile for one criterion at a time.

- Pass one: thesis and structure only.
- Pass two: use of evidence.
- Pass three: analysis and conclusion.

Three fast focused passes beat one slow anxious pass. Your standards stay far more consistent across the pile, which is the thing moderation meetings always catch.

## Step 3: Use AI for the description, never the judgement

For each essay I paste the text with a tightly bounded request:

```
Rubric criterion: "Uses at least two specific pieces of evidence and explains
how each supports the argument."
Essay below. Do three things only:
1. Quote every piece of evidence the pupil used.
2. For each, say whether an explanation follows it in the same paragraph.
3. Do not award a grade, level or score. Do not praise the essay.
Essay: [...]
```

What comes back is an evidence inventory. I read it in about fifteen seconds, glance at the essay to confirm, and award the level myself. The inventory catches things tired eyes miss at essay ninety - particularly evidence that is present but unexplained, which is the most common reason a script sits one band lower than the pupil expected.

## Step 4: Draft the comment, then rewrite the first sentence

I select the two most relevant comment-bank themes and ask for a short paragraph addressed to the pupil. Then I always rewrite the opening sentence by hand, naming something specific from their script.

*Your paragraph on rationing was the strongest - the ration-book detail did real work.* No system can produce that sentence, because it requires having read this pupil's essay and remembered what the class did in October. It is also the sentence pupils read most carefully.

## Step 5: The five checks before anything goes out

Non-negotiable, and they take about twenty minutes for the whole pile.

1. **Grade check.** Every level was set by me, in my own pass, before I read any drafted comment.
2. **Name check.** No feedback names the wrong pupil or the wrong task. Batch errors happen.
3. **Tone check.** Nothing sarcastic, nothing that could be read as a comment on the pupil rather than the work.
4. **Accuracy check.** Any subject claim in the feedback is one I would defend in a parents evening.
5. **Outlier check.** I reread in full every script where my level and the evidence inventory disagreed. That is usually three or four essays, and it is always time well spent.

## Where I stopped using AI

**Borderline scripts.** Anything on a grade boundary gets full human reading, twice, ideally with a colleague. The cost of being wrong is a pupil's target grade.

**Anything emotionally loaded.** A creative piece about a bereavement, a personal statement, a pupil who has just come back from a long absence. Drafted feedback on these reads as hollow, and pupils notice.

**First drafts in a redrafting cycle.** These need me to know what the pupil did last time. Context I hold in my head is the whole value of the comment.

**Anything I would not show the pupil.** If I would be uncomfortable saying *a tool helped me draft this feedback, and I checked and edited all of it*, the tool should not be in that part of the process. I say exactly that to my classes, once, at the start of the year.

## What the time actually looks like

| Stage | Before | After |
| --- | --- | --- |
| Calibration and comment bank | 0 | 75 min (once per task type) |
| Reading and levelling 120 scripts | 8 hr | 2 hr 30 (three focused passes) |
| Writing feedback | 3 hr | 45 min |
| Checks | 0 | 20 min |

The comment bank is a one-off cost that pays back on every future set. The honest total for a repeat task is a little under four hours.

## FAQ

**Is this allowed under my school's policy?**
Usually yes, because pupil grades remain teacher-awarded, but check two things specifically: whether pupil work may be pasted into an external tool at all, and whether your data protection officer requires names removed first. Strip names by default.

**Does feedback quality drop?**
In our department it rose, for an unglamorous reason: there was enough time left to write a specific opening sentence for every pupil. Previously the last thirty essays got three words.

**What about handwritten scripts?**
Photograph them and use the tool only for the evidence inventory. Transcription errors make anything more ambitious unreliable.

**How do I convince a sceptical head of department?**
Offer to run it on one set alongside their normal marking and compare a sample of ten for consistency and specificity. The batching-by-criterion change alone usually wins the argument, and it involves no technology at all.
$md$
),
(
'5dabbd21-29ed-4331-af33-0f869ac84b79',
'Differentiating a Single Lesson Five Ways in Twenty Minutes',
'differentiating-a-lesson-five-ways',
'guides',
'published',
now() - interval '4 hours',
10,
'A repeatable method for producing five genuine versions of one task - EAL, below-grade readers, on-level, stretch, and a pupil with a reading-support plan.',
'Differentiate One Lesson Five Ways in 20 Minutes (Teacher Guide)',
'A practical differentiation workflow for teachers: how to build five real versions of one task with AI, with prompts, quality checks and a worked example.',
ARRAY['differentiation','inclusion','eal','lesson planning','send'],
$md$Differentiation fails in practice for a boring reason: there is not enough time on a Sunday evening to make five real versions of a task, so most of us make one and improvise. This is a method for getting to five genuine versions in about twenty minutes, and for noticing when a version looks differentiated but is not.

The important idea first. Differentiation is not making a task easier. It is changing what gets in the pupil's way while keeping the thinking intact. A watered-down worksheet removes the thinking, which is why pupils who always receive the easy sheet never catch up.

## Step 1: Name the thinking you refuse to remove

Before anything else, write one sentence: *every version of this task must require pupils to ___.*

For a Year 9 geography lesson on flooding, mine was: *every version must require pupils to explain how one human decision made flood damage worse.* That sentence is the constant. Reading level, sentence length, scaffolding, output format - all of that can move. The causal explanation cannot.

Write it down before you generate anything, or you will drift.

## Step 2: Describe your actual pupils, not labels

Generic requests produce generic output. Instead of *make an EAL version*, describe the pupil:

> Recently arrived, Arabic first language, strong subject knowledge from previous schooling, reads English at roughly two years below chronological age, understands far more than they can currently write.

That produces a version with subject vocabulary preserved and a glossary added, rather than a version with the content stripped out - which is what the label alone tends to give you.

Keep five short profiles in a document. Reuse them all year. They take fifteen minutes to write once.

## Step 3: One generation, five versions

I request all five at once so they stay genuinely parallel:

```
Core task below. The non-negotiable thinking: every pupil must explain how one
human decision made flood damage worse.

Produce five versions of this task for these pupils: [paste your five profiles].

For each version:
- keep the non-negotiable thinking intact
- state what you changed and why in one line
- keep all subject vocabulary; add a glossary where reading load is the barrier
- do not reduce the number of reasoning steps for any version

Do not produce a version that only asks pupils to identify or list.
Core task: [...]
```

That final prohibition is load-bearing. Left to itself, a model turns the lowest version into recall questions, which is exactly the failure mode you are trying to escape.

## Step 4: Check each version against four tests

Fifteen seconds per version, and it catches nearly everything.

1. **Thinking test.** Does this version still require the non-negotiable reasoning? If a pupil could complete it by copying, reject it.
2. **Dignity test.** Would a fourteen-year-old be embarrassed to be seen with this sheet? Cartoon fonts and baby images do more damage than a hard text.
3. **Convergence test.** Can all five groups contribute to the same plenary discussion? If the stretch group has been given different content rather than deeper demands, the class splits permanently.
4. **Accuracy test.** Simplified explanations are where factual errors hide. Read every simplified causal claim yourself.

## A worked example

Core task: *Using the source pack, explain why the 2007 floods caused so much damage in this town.*

| Version | What changed | What stayed |
| --- | --- | --- |
| EAL, strong prior knowledge | Sources rewritten at shorter sentence length, bilingual glossary of eight terms, sentence stems for the explanation | Full source pack, same causal question |
| Reads two years below | One source removed, key data presented as an annotated map, paragraph frame given | Same question, same required causal link |
| On level | Unchanged | Everything |
| Stretch | Added a conflicting source and a counter-argument requirement | Same question plus evaluation |
| Reading-support plan | Sources provided as audio with a printed transcript, response may be recorded verbally | Same question, same reasoning, different output mode |

Every row ends at the same plenary: *whose decision mattered most, and what should the council do differently?* That is what makes it one lesson rather than five.

## Step 5: Keep the versions

Save all five with the lesson, named by profile rather than by pupil. Next year the twenty minutes becomes five, and the versions improve each time you use them because you have watched real pupils struggle with specific lines.

## What this does not solve

It does not tell you which pupil needs which version - that is professional judgement built from knowing your class, and it changes week to week. It does not replace the SEND provision in a formal plan; if a plan specifies a modality, that is a requirement and not a suggestion. And it cannot tell you whether the reading level is genuinely appropriate. Readability scores are estimates; a pupil reading aloud for ninety seconds tells you more than any number.

## FAQ

**Will pupils notice they have different sheets?**
Yes, and it matters far less than we fear when the sheets look alike, carry the same title, and end in the same discussion. Pupils object to being visibly ranked, not to variety.

**How do I manage five versions in one room?**
Print the versions but hand them out by table, set the same success criteria on the board for everyone, and run one shared plenary. You are managing one lesson, not five.

**Is the on-level version really unchanged?**
Usually, and that is the point. Your core task was designed for the majority. Differentiation means adjusting around it, not rebuilding it.

**How long before this actually saves time?**
The profiles cost fifteen minutes once, and the first lesson takes closer to thirty minutes than twenty. From the third lesson onwards it is genuinely faster than making one version used to be, because the structure is now automatic.
$md$
),
(
'5dabbd21-29ed-4331-af33-0f869ac84b79',
'Writing Report Card Comments That Do Not Sound Generated',
'report-card-comments-that-sound-human',
'productivity',
'published',
now() - interval '5 hours',
9,
'How to write 150 report comments that parents actually read - a structure, an evidence log, and the phrases to delete on sight.',
'Report Card Comments With AI That Still Sound Like You',
'A practical method for writing report card comments faster without losing your voice: evidence logs, a four-part structure, banned phrases and a final check.',
ARRAY['reports','parent communication','workload','writing'],
$md$Report season produces a particular kind of writing: technically correct, entirely forgettable, and obviously produced in bulk at eleven at night. Parents can tell. Pupils can tell. The comment that sticks on a fridge door always contains one thing no template could have supplied.

Here is how to keep that one thing while writing 150 comments in an evening rather than a week.

## The only preparation that matters

You cannot write specific comments from memory in June. You need an evidence log, and it needs to cost almost nothing to maintain.

Mine is a spreadsheet: one row per pupil, one column per half-term, and a single fragment in each cell. Not prose - fragments.

- *asked why the graph flattened - best question of the unit*
- *reread draft unprompted after peer feedback*
- *still avoids speaking in whole-class discussion, fine in pairs*

Two minutes at the end of a lesson, four or five pupils at a time. By June every pupil has six to eight fragments, and those fragments are the entire difference between a human comment and a generated one.

## The four-part structure

Every comment I write follows the same shape, and parents have told me it is the first report format they have read all the way through.

1. **One specific moment.** Something that happened, dated if possible.
2. **The pattern it points to.** What that moment says about how this pupil learns.
3. **Current standing, plainly.** No euphemisms. *Secure on equations, not yet secure on interpreting graphs.*
4. **One next step they can act on.** A behaviour, not an aspiration.

Compare the two:

> Sofia has made good progress this term and should continue to work hard to reach her potential.

> In March Sofia spotted that our survey only asked people who already owned a car - a flaw nobody else in the class noticed. That instinct for who is missing from the data is genuinely unusual, and it shows in her strong evaluation marks. Her weaker area is showing the calculation steps behind a conclusion; several answers were right with no working. Next step: write the working before the answer, every time, for the rest of term.

Same length. One tells Sofia's family something they did not know.

## Where the tool helps, precisely

Not with part one. Part one is yours - it comes from the log.

The help is in parts two to four, and in consistency of tone across 150 comments written over five hours while your patience degrades.

```
Write a report comment of 90-110 words for a Year 9 maths pupil.
Use this structure: specific moment, the pattern it shows, plain current
standing, one actionable next step.

Specific moment (use this, do not change the facts): [paste from your log]
Assessment data: secure on equations, not secure on interpreting graphs
Next step I want stated: write the working before the answer

Tone: warm, direct, no exaggeration. Address the family, not the pupil.
Banned: potential, journey, growth mindset, continues to, strive, going forward.
Do not add achievements I have not listed.
```

The banned-word list is doing more work than anything else in that prompt. Those six words account for most of what makes reports sound automated - and they were making our reports sound automated long before any of this technology existed.

## The three-pass check

**Pass one: facts.** Every claim traces to your log or your assessment data. Nothing invented, nothing inflated. This is the pass you cannot skip; a warm sentence about an achievement that did not happen destroys your credibility with a family permanently.

**Pass two: substitution.** Could this comment be moved to another pupil by changing the name? If yes, part one has failed. Go back to the log.

**Pass three: read aloud, five at random.** Your ear catches the hollow ones instantly. If five random comments sound like you, the batch is sound.

## Hard cases to write yourself

Some comments should never be drafted by anything but you.

**Serious concerns.** Attendance, safeguarding-adjacent worries, a significant drop. These need your exact wording, your school's agreed phrasing, and often a conversation before the report.

**Pupils in difficulty.** A pupil having a hard year deserves a comment written slowly by the adult who noticed. Families in that position read every word twice.

**The pupil you cannot picture.** If you cannot recall a single moment for a pupil in June, no workflow fixes that. Watch them next week, write two fragments, then write the comment. The blank cell is itself useful information about who is invisible in your classroom.

## Time, honestly

| Task | Before | After |
| --- | --- | --- |
| Evidence log upkeep | 0 | about 25 min per half-term |
| Drafting 150 comments | 9-10 hr | 3 hr |
| Checking and rewriting | included above | 70 min |
| Hard cases written by hand | included above | 45 min |

Roughly five hours against ten, with comments that are more specific rather than less. The log is what makes it work; without it you are just generating filler faster.

## FAQ

**Is it dishonest to draft comments this way?**
Not if every fact is yours and you have read and edited every word before it goes out - the same standard that has always applied to comment banks and department templates. If it helps, tell parents at the start of the year that reports are teacher-written with drafting support. Nobody has ever objected.

**What about pupil data protection?**
Use first names only or initials, never full names alongside assessment data, and check whether your school restricts which tools may process pupil information. Strip identifiers by default.

**Our reports are 40 words, not 100.**
The structure compresses to two sentences: specific moment plus next step. Cut part three if your report already shows grades separately - it usually does.

**How do I start a log in the middle of a year?**
Start today with fragments for five pupils and add five per lesson. Two weeks gets you a full class, which is enough for one reporting round.
$md$
),
(
'5dabbd21-29ed-4331-af33-0f869ac84b79',
'The AI Homework Problem: What Actually Works Instead of Detection',
'ai-homework-problem-what-works-instead',
'ethics',
'published',
now() - interval '6 hours',
11,
'Detectors do not work and accusations damage trust. Here are seven assessment redesigns that make AI misuse pointless rather than punishable.',
'The AI Homework Problem: 7 Fixes That Work Better Than Detection',
'Why AI detectors fail, what to do when you suspect misuse, and seven practical assessment redesigns that make homework worth doing honestly.',
ARRAY['academic integrity','assessment design','ai detection','homework'],
$md$Every staffroom has had this conversation. A pupil hands in work that is suddenly three grades better and oddly free of personality. Someone suggests a detector. Someone else has heard the detectors are unreliable. The conversation ends with everyone slightly more tired and nothing decided.

Here is a position worth adopting: stop trying to detect, and start designing tasks where using AI dishonestly costs more effort than doing the work. That is achievable within your existing curriculum, this term.

## Why detection is the wrong tool

Detectors report a statistical impression of how predictable text is. Three consequences follow, and all three are documented in the research literature and in the vendors' own caveats.

**False positives cluster on the pupils least able to defend themselves.** Writing by pupils using English as an additional language is systematically more likely to be flagged, because learner writing uses more common words and simpler structures - the same features that look machine-like.

**The false negative rate is high and trivially exploitable.** Asking for a rewrite in a specified voice defeats most detectors. Any pupil who wants to evade detection can, in one extra step.

**The score is not evidence.** You cannot show a family a probability and call it proof. A pastoral leader will ask what you actually observed, and if the answer is only a percentage, the case collapses - as it should.

One more point that gets missed: even a perfectly accurate detector would only tell you that a pupil avoided doing the thinking. It would not tell you what they can do. That is the information you actually needed.

## What to do when you suspect misuse

Have a routine, so you are not improvising in front of an upset pupil.

1. **Ask, do not accuse.** *Talk me through how you got to this paragraph.* A pupil who did the work answers easily. A pupil who did not usually tells you within a minute, often with relief.
2. **Ask about the thinking, not the words.** *Why did you choose this example over the one we used in class?* Ownership of a decision cannot be faked by someone who never made it.
3. **Compare with in-class writing.** Your own record of what this pupil produces unaided is the only baseline worth having, and it is stronger evidence than any tool.
4. **Separate the integrity issue from the learning issue.** Whatever the outcome, the pupil still has not practised the skill. Set the learning task regardless.
5. **Follow your policy, in writing, once.** Escalate through the route your school has agreed. Never leave a serious accusation as an undocumented corridor conversation.

## Seven redesigns that make misuse pointless

None of these require new technology and none add marking load once established.

**1. Assess the process, not just the product.** Require a plan, a draft and a reflection. Mark the movement between them. A pupil who submits a polished final piece with no trail has not met the brief.

**2. Anchor the task in something local and recent.** Our fieldwork data. Tuesday's demonstration. The argument the class had about the source. Nothing outside the room knows about these.

**3. Require the pupil's own voice on the record.** Two minutes explaining their argument to you, or a ninety-second audio note submitted with the work. This is the single most effective change I have made; it takes half a lesson for a class of thirty using a carousel.

**4. Write in class, extend at home.** Do the thinking under your eye; use homework for the parts where help is legitimate - reading, gathering, formatting, revising.

**5. Make the task require a judgement, not a summary.** *Which of these three interpretations is weakest and why* is far harder to outsource than *explain the causes of*. It is also better assessment.

**6. Permit AI use explicitly, with disclosure.** Add a required line: *what I used, what I asked it, what I changed.* Undisclosed use becomes the offence, which is enforceable. Disclosed use becomes a teachable artefact, and you learn a great deal about who is using what.

**7. Grade drafts, not only finals.** A final piece unrecognisable from a graded draft is a visible conversation starter with no accusation attached.

## A worked redesign

Original: *Write 800 words on whether social media harms teenagers. Due Monday.* Outsourceable in thirty seconds, and the output would be decent.

Redesigned:

- In class: pupils survey their own year group and produce a small dataset.
- Homework: read two provided sources, annotate one, note where each disagrees with the class data.
- In class: write the argument, 40 minutes, sources and annotations allowed, devices closed.
- Homework: revise for clarity. AI permitted for revision, with the disclosure line required.
- Assessed: the argument, the annotations, and one paragraph on what the class data could not tell them.

Same curriculum content. Same word count. Marking load essentially unchanged. There is now no version of this task that AI can complete for a pupil, because the required material exists only in your classroom.

## What to say to your class

Say it once, plainly, in week one, and then be consistent.

> I am not going to run your work through a detector, because detectors are unreliable and I am not prepared to accuse anyone on a guess. I will ask you to explain your thinking, and that will tell me what I need to know. Where AI is allowed, I will say so and you will tell me what you used. Where it is not, the reason is that you need the practice - and the exam will not care what a tool can do.

Pupils respond to that far better than to surveillance, because it is honest about the reasoning. The classes where I have said this have had fewer integrity problems, not more.

## FAQ

**My school has already bought a detector. Now what?**
Use it, if required, as one signal that prompts a conversation - never as the basis of a sanction on its own. Insist that any escalation records what was observed in discussion, not the percentage.

**Is not banning AI simpler?**
Simpler to state, impossible to enforce, and it pushes use underground where you cannot teach into it. Permitted-with-disclosure gives you visibility.

**Does the oral check scale to 150 pupils?**
For major pieces only, and as a sample: five pupils per class chosen at random, announced in advance. The possibility of being asked changes behaviour across the whole cohort.

**What about coursework with external moderation?**
Follow your awarding body's rules exactly; they are more prescriptive than school policy and they change. Check the current specification each year rather than relying on last year's guidance.
$md$
),
(
'5dabbd21-29ed-4331-af33-0f869ac84b79',
'AI for Primary Teachers: Nine Uses That Fit a Real School Day',
'ai-for-primary-teachers-nine-uses',
'guides',
'published',
now() - interval '7 hours',
9,
'Primary teaching has no free periods and no pupil accounts. Here are nine uses that fit into the gaps that actually exist, with prompts you can reuse.',
'AI for Primary Teachers: 9 Practical Uses (No Pupil Accounts)',
'Nine realistic ways primary teachers can use AI - decodable texts, phonics practice, parent notes, differentiated maths - plus safety rules and time savings.',
ARRAY['primary','ks1','ks2','phonics','planning'],
$md$Most advice about AI in education is written for secondary teachers with a laptop trolley and a free period. Primary is a different job. You teach every subject, you have no free periods, the interruptions are constant, and your pupils mostly should not have accounts on anything.

These nine uses fit that reality. All of them are teacher-facing - no pupil logins required - and each one targets a task that genuinely eats your week.

## 1. Decodable texts that match this week's phonics

Finding a passage using only the graphemes you have taught is maddening work. Describing it is quick:

```
Write a 90-word story for Year 1 using only these graphemes: [list].
Permitted exception words: the, said, was, of.
No other words outside those graphemes.
Include a problem and a resolution.
```

Check every word yourself - this is the use that most often slips one grapheme through. Even with checking it is ten minutes against an hour of searching, and the story can be about whatever your class is obsessed with this term.

## 2. Maths word problems in three difficulty bands

Same operation, same numbers of steps, three reading loads. Ask for the answers and the working in a separate block so you can check the maths before it reaches a table.

## 3. Home learning notes that families actually read

One paragraph, no jargon, explaining what we learned and one thing to do at home in five minutes. Ask for it at a reading age of nine so it works for every adult in your class, and ask for a version stripped to four bullet points for families who prefer that.

## 4. Turning a lesson into a display

Paste your lesson and ask for six headings and eight pupil-friendly captions for a working wall. Ten minutes rather than an hour of hand-lettering on a Friday afternoon.

## 5. Vocabulary sets with child-friendly definitions

Ten topic words, each with a definition a seven-year-old understands, an example sentence set in a school context, and a common misconception. The misconception column is the useful part - it tells you what to pre-empt on Monday.

## 6. Small-group planning for the adult who is not you

Teaching assistants deserve better than a verbal handover between the register and assembly. Ask for a one-page script: objective, three questions to ask, two errors to watch for, and what to do if the group finishes early. Legible, specific, and reusable.

## 7. Differentiated instructions for a practical task

Same science investigation, three sets of instructions: pictorial with four steps, written with support, and written with an added prediction. Keeps every group doing the same investigation - which is what matters - while changing how they access it.

## 8. Story starters tied to your text

Six openings in the style of the class novel, each requiring a different feature you are teaching that week: expanded noun phrase, fronted adverbial, dialogue with correct punctuation. Far better than a generic prompt pack.

## 9. The awkward email

The trip reminder that has to be firm about the deadline without being cold. The response to a complaint you need to answer today. Draft it, rewrite the middle in your own words, send. Saves fifteen minutes and a good deal of low-grade dread.

## Four safety rules for primary

**No pupil names, ever.** Not in a behaviour query, not in a report draft, not in an email you paste in for rewording. Replace with *a pupil in my class*. This is the rule most easily broken in a hurry.

**No pupil-facing tools without a DPIA and leadership sign-off.** Everything above is teacher-facing for exactly this reason. If a pupil-facing tool is proposed, that is a whole-school decision with a data protection assessment behind it, not a classroom one.

**Check every fact and every grapheme.** Primary content looks simple, which makes errors easy to skim past. A wrong fact in a Year 2 science text becomes a misconception you fight for a term.

**Nothing goes to parents unedited.** Your voice is most of why families trust your communication. Rewrite at least one sentence, always.

## Where it is not worth the effort

- **Assessment judgements.** You know your children. Nothing else does.
- **Anything about a specific child's behaviour or needs.** The context lives in your head and in your safeguarding record, not in a prompt.
- **Marking KS1 writing.** The whole point is noticing the individual child's next step, which is a human act.
- **Phonics assessment.** Listen to the child read. There is no shortcut and there should not be one.

## A realistic week

Pick two uses, not nine. In our school the two that saved the most time were the decodable texts and the small-group scripts for teaching assistants - between them roughly ninety minutes a week, and the TA scripts improved the actual teaching in those groups, which is worth more than the time.

Add a third the following half-term if the first two have stuck. A workflow you use twice and abandon costs you more than it saves.

## FAQ

**Is any of this appropriate for Reception?**
Teacher-facing uses, yes - particularly the decodable texts, family notes and adult-led group scripts. Nothing pupil-facing. Early years learning is relational and physical; a screen adds nothing that matters at that age.

**What do I say if a parent asks whether I use AI?**
The straightforward truth: it helps draft some materials and letters, you check and edit everything, and no child's personal information goes into it. That answer has never caused a problem in my experience; evasiveness would.

**Which tool should I use?**
Whichever your school has approved and whichever you will actually open on a Tuesday lunchtime. The free tier of a mainstream assistant covers everything on this list.

**How do I persuade colleagues without becoming the school's tech person?**
Share one finished artefact, not a tool recommendation. A decodable text that matches this week's phonics gets asked about immediately, and then you share the prompt rather than running training.
$md$
);