---
name: draft-article
description: Draft, revise, or translate a Blog post or Learning Note from the owner's outline and key points, following the repository's AI-writing instructions. Use whenever asked to write or expand site content.
---

Read and follow, in this order:

1. `.github/instructions/ai-writing.instructions.md` — the canonical workflow: roles and the draft-approval gate, factual-integrity rules, voice and style, category conventions, and translation rules.
2. `docs/content-authoring.md` — frontmatter fields and the MDX/scientific component mechanics (figures, tables, KaTeX, callouts).

Input: the topic, outline, key points, or the file to revise (possibly in $ARGUMENTS). If no outline or key points were provided, ask for them before drafting — never invent content to fill the gap.

Non-negotiables from the instructions: create and keep `draft: true` until the owner approves; fabricate nothing (facts, numbers, citations, DOIs, anecdotes); run `pnpm format` and `pnpm build` (plus `pnpm check` when components or expressions are involved); end with the handoff summary the instructions define, listing every unverified claim and open question.
