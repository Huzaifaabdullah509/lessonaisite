INSERT INTO public.articles (slug, title, excerpt, category, tags, cover_url, reading_time_minutes, status, published_at, seo_title, seo_description, body_md)
VALUES (
  'google-gemini-in-the-classroom',
  'Google Gemini in the Classroom: A Complete Teacher''s Lesson',
  'A full, classroom-tested lesson on using Google Gemini for planning, differentiation, feedback and pupil AI literacy — with a step-by-step tutorial, three real case studies and an FAQ.',
  'guides',
  ARRAY['gemini','google','lesson planning','differentiation','ai literacy'],
  'https://lessonaisite.lovable.app/covers/google-gemini-in-the-classroom.jpg',
  9,
  'published',
  now() - interval '1 hour',
  'Google Gemini in the Classroom: Complete Teacher''s Guide (2026)',
  'A practical 1,500-word lesson on using Google Gemini as a teacher: setup, prompt structure, differentiation, marking support, pupil AI literacy, case studies and FAQs.',
  $md$Most teachers meet Google Gemini the same way: someone at a staff meeting says it will save hours, you open it that evening, type "make me a lesson plan on photosynthesis", and get back something bland enough to be useless. The tool is not the problem. The instructions are. Gemini is very good at doing a specific job for a specific class when you tell it what that job is — and mediocre at guessing.

This lesson walks through how to use Gemini as a working assistant across the four tasks that eat a teacher's week: planning, differentiation, feedback, and teaching pupils to use AI honestly. Everything below has been run against real teaching material, and where an approach has limits, they are named.

## Background: what Gemini actually is, in classroom terms

Gemini is Google's family of AI models, available at gemini.google.com and inside Google Workspace apps such as Docs, Slides, Sheets and Gmail. For teaching, three properties matter more than any benchmark score.

### It reads long documents

You can paste or upload a scheme of work, a specification extract, a marking policy or a set of pupil responses, and ask questions about that material. This is the difference between generic output and output that matches your curriculum. A prompt with your unit outline attached will beat a clever prompt without it every time.

### It works inside the tools you already use

In Google Docs and Slides, Gemini can restructure a document, generate a slide outline, or rewrite text at a different reading level without you copying anything between tabs. That reduces friction, which is what determines whether you still use a tool in week six.

### It has no idea what your class is like

Gemini does not know that your Year 9 group has four pupils on the SEND register, that half of them read two years below chronological age, or that your school insists on a knowledge-retrieval starter. If you do not supply that, it will invent a generic class. Most disappointing output traces back to this single omission.

## The core tutorial: build a prompt that produces usable material

Treat a prompt as a briefing you would give a very capable, very literal trainee teacher who has never met your class. Five components, in this order.

1. **Role and level.** "You are an experienced Year 8 geography teacher in an English secondary school."
2. **Exact task and output format.** "Write a 50-minute lesson plan with timings, a retrieval starter, a main task and an exit ticket. Present it as a table."
3. **Class context.** Size, prior knowledge, reading age, EAL and SEND needs, behaviour considerations, available equipment.
4. **Curriculum anchor.** Paste the specification point, learning objective or success criteria. Do not summarise it — paste it.
5. **Constraints and standards.** "No worksheets requiring colour printing. Vocabulary suitable for reading age 11. Include one question at GCSE grade 7 difficulty."

Then iterate rather than restart. The fastest gains come from short follow-up instructions: "the main task is too long — cut it to 15 minutes", "make the exit ticket three questions, one recall, one application, one explanation", "rewrite the reading passage at reading age 10 but keep the technical vocabulary".

### A worked step-by-step: a differentiated reading task in about eight minutes

- **Step 1.** Open Gemini and paste your learning objective plus the source text pupils will read.
- **Step 2.** Ask: "Produce three versions of this passage — original, one at reading age 10 with the same key terms retained, and one extension version with two additional inference-level questions. Keep all three factually identical."
- **Step 3.** Ask for a single comprehension question set that works across all three versions, so the class stays on the same discussion.
- **Step 4.** Ask: "List the misconceptions pupils are most likely to show in their answers, and one quick check for each."
- **Step 5.** Read everything yourself. Fix the two or three phrasings that do not sound like you, and delete anything you cannot defend.

That last step is the lesson. Gemini gets you to a strong draft; you remain the teacher of record.

## Using Gemini for feedback without outsourcing judgement

Marking is where AI is most tempting and most risky. A defensible workflow looks like this: you assess the work and decide the grade; Gemini helps you say more, faster.

Paste your rubric, then one anonymised pupil response, and ask for three things: which rubric criteria the response meets, two specific strengths with quotations from the response, and one improvement written as an instruction the pupil can act on tomorrow. Ask it to avoid praise adjectives and to reference only what is in the text.

Two rules make this safe. First, remove names and any identifying detail before pasting anything — check your school's data-protection guidance, because many settings prohibit uploading pupil work to consumer AI accounts at all. Second, never ask for a grade. Grading is a professional judgement that must sit with you, and models are inconsistent on borderline scripts.

## Teaching pupils to use Gemini honestly

The strongest AI policy is one pupils have practised, not one they have signed. A 30-minute lesson that works from Year 7 upwards:

- Give pupils a question and Gemini's answer to it, printed. Ask them to find one claim they cannot verify.
- Have them check that claim against a textbook or a reliable site, and write down what they found.
- Ask them to rewrite one paragraph in their own voice, then explain in two sentences what they changed and why.
- Close with the class rule you will hold them to: AI may help you understand or plan, and you must be able to explain every sentence you submit.

This teaches source evaluation and takes the mystery out of the tool at the same time. It also gives you language to use when work arrives that a pupil clearly cannot explain.

## Real-world case studies

### A secondary science department cut planning time on a new unit

A team of four teachers uploaded the specification section for a new required unit plus their existing practical risk assessments, and asked Gemini for a six-lesson sequence with a knowledge organiser and a retrieval quiz per lesson. The first output was too crowded, so they asked for the sequence over eight lessons instead. Roughly a day of shared planning became an afternoon. The department still wrote the assessment itself, because they wanted the wording to match past-paper phrasing exactly.

### A Year 5 teacher rebuilt one worksheet into four

One teacher took a single fractions worksheet and produced four versions: a scaffolded version with worked examples, the original, an extension with two multi-step word problems, and a version with the same numbers but a football context for a group who had disengaged. Ten minutes of work. She reported the biggest gain was not time saved but that the lowest-attaining group had something at the right level for once, rather than the same sheet with fewer questions.

### A head of English used it against her own marking bottleneck

For a set of 28 essays, she graded each script herself, then used Gemini with her rubric to expand her one-line notes into specific, actionable comments. Turnaround dropped from twelve days to four. Her caution: two comments in the first batch praised an argument the pupil had not actually made, which is exactly why every comment gets read before it goes back.

## Frequently asked questions

**Is Google Gemini free for teachers?**
There is a free tier that covers most planning tasks. Paid tiers and Google Workspace for Education add higher usage limits, longer document handling and administrative controls. Ask your IT lead which account type your school has provisioned before you use it with anything school-related.

**Can I upload pupil work to Gemini?**
Only if your school's data-protection policy allows it, and normally only with names and identifying details removed. Many schools restrict this to managed Workspace accounts rather than personal ones. When in doubt, work from anonymised extracts.

**Will Gemini invent facts?**
Yes, occasionally, and confidently. It is most reliable when it is working from material you have supplied and least reliable on specific figures, citations, dates and exam-board wording. Verify anything you would be embarrassed to be wrong about in front of a class.

**Should pupils be allowed to use it for homework?**
Set the boundary by task, not by tool. Planning, explaining a concept and checking understanding are reasonable uses. Producing the assessed text is not. Say which category each piece of homework falls into when you set it, and pupils will follow it far more consistently than a blanket ban.

## Where to go next

Pick one task this week — not four. Rebuild a single worksheet into three levels, or turn one set of marking notes into fuller comments. Save the prompt that worked in a document you can reach in ten seconds, because a prompt you have to rewrite is a prompt you will stop using. Then browse the LeasonAI prompt library for a task-shaped starting point, and read our guide on why AI detection tools fail before you rely on one.
$md$
);