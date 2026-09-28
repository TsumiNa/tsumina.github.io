---
description: 'Use when drafting, revising, or translating Blog and Notes content on the owner\u2019s behalf. Defines the outline-driven workflow, factual-integrity rules, voice, category conventions, and the draft-approval gate.'
name: 'AI-Assisted Writing'
applyTo: 'src/content/**'
---

# AI-Assisted Writing

Most articles on this site are drafted by an AI agent from the owner\u2019s outline and key points, then reviewed and approved by the owner. This file is the canonical writing instruction and is deliberately self-sufficient: follow it in full even when the client has no built-in writing skill.

## Roles and approval gate

- The owner supplies the topic, an outline or key points, the target collection and category, any sources, and the target language(s).
- The agent drafts. The owner reviews, edits, and approves.
- Every AI-created or AI-revised article is written with `draft: true` and keeps it. Only the owner flips `draft: false` or explicitly instructs it. Never publish on your own judgment.
- Once the owner has approved an article, it becomes author-owned prose: later edits and reviews fall under the author-preserving boundary in `implementation-and-tests.instructions.md`.

## Factual integrity (non-negotiable)

- Write only from the owner\u2019s points, supplied sources, and well-established knowledge you can attribute.
- Never invent facts, numbers, benchmarks, experimental results, quotations, citations, DOIs, URLs, biography details, or personal anecdotes on the owner\u2019s behalf.
- Every non-obvious claim needs an owner-supplied basis or a verifiable citation (DOI or stable link). If neither exists, drop the claim or mark it `<!-- TODO(owner): verify \u2026 -->` and list it in the handoff.
- When the outline is ambiguous or silent on something that matters, ask. Do not fill gaps with plausible invention.

## Workflow

1. **Restate.** Turn the outline into a short plan: sections, the point each section makes, and what evidence exists, plus open questions. For a short post this is a few sentences; for a loose request, align on the plan before drafting long.
2. **Draft** with correct frontmatter per `docs/content-authoring.md`: `title`, a concrete 1\u20132 sentence `description` (it feeds SEO metadata and `llms.txt`), `published`, `lang`, sparse `tags` (reuse existing ones), `category` for blog or `topic`/`status` for notes, `draft: true`, and `translationKey` when translations are planned.
3. **Verify mechanics**: `pnpm format` and `pnpm build`; add `pnpm check` when imports, components, or expressions are involved.
4. **Self-review** against the checklist below.
5. **Hand off**: what was written, every unverified claim or TODO, open questions, and the suggested next step. Never present a draft as finished truth.

## Voice and style

- Write as the owner (first person singular) for technically literate readers: researchers, engineers, students.
- Plain, precise, confident. Prefer short sentences to nested ones, concrete statements to abstractions. A generalization earns its place with an example, a number, or a reference.
- Cut filler. No \u201cin today\u2019s rapidly evolving landscape\u201d, \u201cit\u2019s important to note\u201d, \u201cdelve\u201d, \u201cunlock\u201d, \u201cleverage\u201d as a verb for \u201cuse\u201d, and no closing pep-talk paragraph.
- Prefer flowing prose. Use bullets only for genuinely enumerable items (steps, parameters, options); do not convert arguments into bullet lists.
- Headings are sentence case, informative, and follow the outline; rarely deeper than `###`.
- Define notation and jargon at first use; keep terminology consistent within and across articles.
- Use SI units and honest precision \u2014 no significant figures the source does not have.
- Code blocks are minimal and language-labeled; state whether the code was actually run. Math uses KaTeX; figures, tables, and chemistry notation follow `docs/content-authoring.md`.
- Length follows substance. If the key points support 600 words, write 600, not 1500.

## Category conventions

- `research`: context \u2192 question \u2192 approach \u2192 evidence \u2192 implications; cite primary literature with DOIs.
- `technical`: problem \u2192 constraints \u2192 design decisions \u2192 implementation \u2192 trade-offs and failure modes.
- `learning`: exploratory tone is fine; say what was tried and what is still unclear.
- `tutorial`: prerequisites \u2192 numbered steps \u2192 expected result at each checkpoint \u2192 common failures.
- Notes collection: working knowledge; set `status` (`draft`/`evolving`/`stable`) honestly; short entries are fine.

## Translations (ja / zh)

- Translate only after the English original is approved, unless the owner directs otherwise. A translation is a separate file with the same `translationKey` and its own `lang`.
- Translate meaning, not word order: the result must read as natively written. Keep citations, numbers, code, and identifiers identical. For uncommon technical terms, give the established target-language term with the English original in parentheses at first use.
- Use full-width CJK punctuation in Japanese and Chinese prose; keep ASCII punctuation inside code, URLs, and citations.
- Translations pass through the same `draft: true` \u2192 owner-approval gate.

## Self-review checklist

Before handing off, confirm: every claim traced to the outline, a source, or flagged; no invented citations or numbers; voice and length rules respected; frontmatter valid and category/tags/description sensible; format and build checks pass; `draft: true` still set.
