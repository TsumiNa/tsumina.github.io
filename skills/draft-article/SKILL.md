---
name: draft-article
description: Draft, revise, or translate a Blog post or Learning Note for this site from the owner's outline and key points. Enforces the outline-driven workflow, author grounding, factual integrity, argumentation quality, anti-content-farm style, and the draft:true approval gate. Use whenever asked to write, expand, or translate site content.
---

# draft-article — AI-assisted writing for this site

Most articles on this site are drafted by an AI agent from the owner’s outline and key points, then reviewed and approved by the owner. This skill is the canonical writing instruction for the repository and is deliberately self-sufficient and tool-agnostic: follow it in full regardless of which AI client is running, even one with no built-in writing support.

## Roles and approval gate

- The owner supplies the topic, an outline or key points, the target collection and category, any sources, and the target language(s).
- The agent drafts. The owner reviews, edits, and approves.
- Every AI-created or AI-revised article is written with `draft: true` and keeps it. Only the owner flips `draft: false` or explicitly instructs it. Never publish on your own judgment.
- Once the owner has approved an article, it becomes author-owned prose: later edits and reviews fall under the author-preserving boundary in `implementation-and-tests.instructions.md`.

## Author identity and grounding

The byline is the owner’s: a materials-informatics researcher working on machine learning for materials discovery, crystal structure prediction, quasicrystals, and AI for scientific software. Before drafting anything that touches these fields or the owner’s own work, read `src/data/cv.ts` (career facts, projects such as XenonPy, ShotgunCSP, Crystallus, FAAA) and `researchThemes` in `src/config/site.ts`, and keep every biographical or project fact consistent with them.

- Inside the owner’s domains, write with the directness of a practitioner; explain from mechanism, not from press-release summaries.
- Outside those domains, do not borrow authority the owner does not have: frame the piece as study or exploration (the `learning` category exists for this) and attribute expertise to the cited sources instead.
- Never invent first-person experience, opinions, or results the outline did not supply. “I” may only do, think, or find what the owner actually stated.
- Mention the owner’s publications or software only where genuinely relevant, with facts taken from the repository data or supplied sources — not from memory.

## Factual integrity (non-negotiable)

- Write only from the owner’s points, supplied sources, and well-established knowledge you can attribute.
- Never invent facts, numbers, benchmarks, experimental results, quotations, citations, DOIs, URLs, biography details, or personal anecdotes on the owner’s behalf.
- Every non-obvious claim needs an owner-supplied basis or a verifiable citation (DOI or stable link). If neither exists, drop the claim or mark it `<!-- TODO(owner): verify … -->` and list it in the handoff.
- When the outline is ambiguous or silent on something that matters, ask. Do not fill gaps with plausible invention.

## Logic and argumentation

An article is an argument, not a pile of paragraphs.

- **One thesis.** State the article’s point early — in the first or second paragraph. Every section must advance it; cut anything that does not.
- **Paragraph discipline.** One point per paragraph. The first sentence carries the point; the rest of the paragraph supports only that point. If a paragraph needs two topic sentences, it is two paragraphs.
- **Earned conclusions.** Every important conclusion must be traceable, in the text, to at least one of: (a) a cited source, (b) owner-supplied data or points, or (c) a chain of reasoning the reader can follow step by step. A conclusion with none of these does not get written.
- **Visible logic.** Transitions state the actual relation between ideas — because, therefore, however, in contrast — so a reader can trace why each section follows the previous one. No decorative transitions.
- **Calibrated strength.** Match verbs to evidence: data “show”, analyses “suggest”, single anecdotes “hint”. Distinguish observation, inference, and speculation, and label speculation as speculation.
- **Reverse-outline test.** Before handoff, reconstruct the outline from the draft alone: each paragraph should reduce to one point, each point should serve the thesis, and each conclusion should point back at its basis. Whatever fails the test is rewritten or removed.

## Workflow

1. **Restate.** Turn the outline into a short plan: sections, the point each section makes, and what evidence exists, plus open questions. For a short post this is a few sentences; for a loose request, align on the plan before drafting long. If no outline or key points were provided at all, request them before drafting anything — never invent the content of an article.
2. **Draft** with correct frontmatter per `docs/content-authoring.md`: `title`, a concrete 1–2 sentence `description` (it feeds SEO metadata and `llms.txt`), `published`, `lang`, sparse `tags` (reuse existing ones), `category` for blog or `topic`/`status` for notes, `draft: true`, and `translationKey` when translations are planned.
3. **Verify mechanics**: `pnpm format` and `pnpm build`; add `pnpm check` when imports, components, or expressions are involved.
4. **Self-review** against the checklist below, including the reverse-outline test.
5. **Hand off**: what was written, every unverified claim or TODO, open questions, and the suggested next step. Never present a draft as finished truth.

## Voice and style

- Write as the owner (first person singular) for technically literate readers: researchers, engineers, students.
- Plain, precise, confident. Prefer short sentences to nested ones, concrete statements to abstractions. A generalization earns its place with an example, a number, or a reference.
- Cut filler. No “in today’s rapidly evolving landscape”, “it’s important to note”, “delve”, “unlock”, “leverage” as a verb for “use”, and no closing pep-talk paragraph.
- Prefer flowing prose. Use bullets only for genuinely enumerable items (steps, parameters, options); do not convert arguments into bullet lists.
- Headings are sentence case, informative, and follow the outline; rarely deeper than `###`.
- Define notation and jargon at first use; keep terminology consistent within and across articles.
- Use SI units and honest precision — no significant figures the source does not have.
- Code blocks are minimal and language-labeled; state whether the code was actually run. Math uses KaTeX; figures, tables, and chemistry notation follow `docs/content-authoring.md`.
- Length follows substance. If the key points support 600 words, write 600, not 1500.

## Not content-farm writing

This site is a researcher’s record of substance. Optimize for the reader’s time and trust, never for clicks, engagement, or algorithmic reach. Concretely banned:

- Bait titles: curiosity gaps (“you won’t believe…”), shock words, numbered-list bait (“10 things…”), or titles that withhold the article’s actual point. The title states what the article contains.
- Throat-clearing openings about how important, hot, or fast-moving the field is. Open with the point.
- Hype vocabulary (revolutionary, game-changing, paradigm shift), manufactured urgency, emotional manipulation, emoji decoration, and engagement-bait rhetorical questions.
- Padding: restating the same idea in new words, recycling common knowledge as insight, or stretching thin material to look substantial.
- If the outline does not contain something worth publishing, say exactly that to the owner instead of dressing it up. An honest “this needs more substance” beats a polished empty article.

## Category conventions

- `research`: context → question → approach → evidence → implications; cite primary literature with DOIs.
- `technical`: problem → constraints → design decisions → implementation → trade-offs and failure modes.
- `learning`: exploratory tone is fine; say what was tried and what is still unclear.
- `tutorial`: prerequisites → numbered steps → expected result at each checkpoint → common failures.
- Notes collection: working knowledge; set `status` (`draft`/`evolving`/`stable`) honestly; short entries are fine.

## Translations (ja / zh)

- Translate only after the English original is approved, unless the owner directs otherwise. A translation is a separate file with the same `translationKey` and its own `lang`.
- Translate meaning, not word order: the result must read as natively written. Keep citations, numbers, code, and identifiers identical. For uncommon technical terms, give the established target-language term with the English original in parentheses at first use.
- Use full-width CJK punctuation in Japanese and Chinese prose; keep ASCII punctuation inside code, URLs, and citations.
- The anti-content-farm rules apply with extra force in Chinese: no 公众号-style bait, hype, or filler.
- Translations pass through the same `draft: true` → owner-approval gate.

## Self-review checklist

Before handing off, confirm: the thesis is stated early and every section serves it; the reverse-outline test passes; every important conclusion traces to a citation, owner-supplied material, or explicit reasoning; no invented facts, citations, or first-person experience; biography and project facts match `src/data/cv.ts`; voice, length, and anti-content-farm rules respected; frontmatter valid and category/tags/description sensible; format and build checks pass; `draft: true` still set.
