---
name: draft-article
description: Draft, revise, or translate a Blog post or Learning Note for this site from the owner's outline and key points. Enforces author grounding, factual integrity, TL;DR-first structure, numbered citations, anti-content-farm style, and preview-before-merge approval. The agent gathers supporting sources and generates needed figures. Use whenever asked to write, expand, or translate site content.
---

# draft-article — AI-assisted writing for this site

Most articles on this site are drafted by an AI agent from the owner’s outline and key points, then reviewed and approved by the owner. This skill is the canonical writing instruction for the repository and is deliberately self-sufficient and tool-agnostic: follow it in full regardless of which AI client is running, even one with no built-in writing support.

## Roles and approval gate

- The owner supplies the topic, an outline or key points, the target collection and category, any sources, and the target language(s).
- The agent drafts. The owner reviews, edits, and approves.
- Every Blog post and Learning Note is an `.mdx` file and is rendered in branch builds. When remote PR work is authorized, use the Cloudflare branch preview as the primary visual review surface.
- The owner approves content before merge. Never merge or otherwise publish AI-created or AI-revised prose on your own judgment; creating or updating a review PR does not authorize merging it.
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

## Research and supporting material

The owner’s outline defines what the article says; the agent is responsible for assembling what supports it.

**Gathering sources.** When a planned claim needs support the owner did not supply, find it: search for primary literature, official documentation, or authoritative references, preferring a paper’s DOI over blogs and press releases. Cite only what you actually retrieved and read — never from memory, never from an abstract alone when the claim depends on details, and never secondhand through another work without saying so. Record every source (title, venue, year, DOI/URL) as you gather. A claim that survives gathering without support is flagged as a TODO, not kept on faith.

**Generating figures and materials.** Plan and produce the figures the article needs instead of leaving placeholders:

- Schematics and conceptual diagrams: author clean, legible SVG. Group an article’s assets under `public/figures/<article-slug>/` and render them with the `Figure`/`FigureGrid` components per `docs/content-authoring.md`, with informative alt text and a caption that states what the figure shows.
- Data plots: only from real data — owner-supplied or gathered, with the source named in the caption. Never plot invented or “illustrative” numbers as if they were measurements. Label axes with units; keep the plot legible at reading-column width; no chartjunk.
- Tables follow the same rule: real values, sources named.
- No decorative images. Every figure must carry information the text needs (see “Not content-farm writing”).

## Logic and argumentation

An article is an argument, not a pile of paragraphs.

- **One thesis.** State the article’s point early — in the first or second paragraph. Every section must advance it; cut anything that does not.
- **Paragraph discipline.** One point per paragraph. The first sentence carries the point; the rest of the paragraph supports only that point. If a paragraph needs two topic sentences, it is two paragraphs.
- **Earned conclusions.** Every important conclusion must be traceable, in the text, to at least one of: (a) a cited source, (b) owner-supplied data or points, or (c) a chain of reasoning the reader can follow step by step. A conclusion with none of these does not get written.
- **Visible logic.** Transitions state the actual relation between ideas — because, therefore, however, in contrast — so a reader can trace why each section follows the previous one. No decorative transitions.
- **Calibrated strength.** Match verbs to evidence: data “show”, analyses “suggest”, single anecdotes “hint”. Distinguish observation, inference, and speculation, and label speculation as speculation.
- **Reverse-outline test.** Before handoff, reconstruct the outline from the draft alone: each paragraph should reduce to one point, each point should serve the thesis, and each conclusion should point back at its basis. Whatever fails the test is rewritten or removed.

## TL;DR opening

Every article opens with a TL;DR: immediately after the title, before the first heading — 2–4 sentences (or up to four tight bullets) stating the thesis and the main conclusions. It is an inverted-pyramid opener: a reader who stops there still leaves with the article’s actual point, so no teasing and no withheld conclusions. Write it last, from the finished draft, and keep it consistent with the body.

Markup: in MDX use `<Callout type="Note" title="TL;DR">…</Callout>`; in plain Markdown use a `> **TL;DR** —` blockquote. The `description` frontmatter remains a separate 1–2 sentence summary for SEO and `llms.txt`; the TL;DR lives in the body.

## Workflow

1. **Restate.** Turn the outline into a short plan: sections, the point each section makes, and what evidence exists, plus open questions. For a short post this is a few sentences; for a loose request, align on the plan before drafting long. If no outline or key points were provided at all, request them before drafting anything — never invent the content of an article.
2. **Gather.** Collect the support each planned claim needs and plan the figures — what each shows and where its data comes from (see “Research and supporting material”). Generate the figure assets.
3. **Draft** as `.mdx`, opening with the TL;DR and using correct frontmatter per `docs/content-authoring.md`: `title`, a concrete 1–2 sentence `description` (it feeds SEO metadata and `llms.txt`), `published`, `lang`, sparse `tags` (reuse existing ones), `category` for blog or `topic`/`status` for notes, optional `banner` and `show`, and `translationKey` when translations are planned. Put Blog files in the documented `series/chapter/article.mdx` hierarchy when they belong to a series; Astro generates directory indexes, so do not author `index*.mdx`. Every series/chapter folder requires `config.toml` with localized titles and inherited `show`; `cover` is optional. Never encode series structure in article frontmatter. Do not add a publication-hiding `draft` field; review isolation comes from the branch and PR.
4. **Verify mechanics**: `pnpm format` and `pnpm build`; add `pnpm check` when imports, components, or expressions are involved.
5. **Self-review** against the checklist below, including the reverse-outline test.
6. **Hand off**: what was written, the sources gathered (with links) and figures generated, every unverified claim or TODO, open questions, the Cloudflare preview URL when a review PR exists, and the suggested next step. Never present unapproved prose as finished truth.

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

## Citations and references

Use numbered cite-plus-reference style, implemented with Markdown footnotes (the repository’s supported mechanism; see `docs/content-authoring.md`):

- Place the marker at the exact claim it supports — `…improves the screening yield.[^liu2024]` — not collected at the end of a paragraph. Reuse the same footnote for repeat citations of one source.
- Each footnote is one reference entry, formatted to match the site’s publication style: `Family, I., Family, I. & Family, I. Title. *Venue* **vol**, pages (year). https://doi.org/10.xxxx/xxxxx`. For non-DOI web sources give the site or institution and a stable URL; for software give the project name and repository URL.
- Cite only sources actually consulted during gathering. If you read a summary of X inside Y, cite Y — or go read X.
- The cited source must say what the sentence claims, at the strength the sentence claims it.

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
- Translations pass through the same branch preview → owner approval → merge gate.

## Self-review checklist

Before handing off, confirm: the TL;DR is present, faithful to the body, and gives away the conclusion; the thesis is stated early and every section serves it; the reverse-outline test passes; every important conclusion traces to a citation, owner-supplied material, or explicit reasoning; every footnote reference was actually consulted and supports its claim; every figure has real data or an honest schematic role, informative alt text, and a sourced caption; no invented facts, citations, or first-person experience; biography and project facts match `src/data/cv.ts`; voice, length, and anti-content-farm rules respected; the file uses `.mdx`; its folder depth and frontmatter are valid and category/tags/description are sensible; format and build checks pass; and the review PR remains unmerged until owner approval.
