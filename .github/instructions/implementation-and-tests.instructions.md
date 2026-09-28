---
description: 'Use for Astro, TypeScript, CSS, configuration, and Markdown/MDX changes. Enforces minimal scope, repository-native implementation, proportionate checks, and author-preserving content review.'
name: 'Implementation, Checks, and Content Review'
applyTo: '**'
---

# Implementation, Checks, and Content Review

Implement the requested outcome with the smallest coherent change that fits the existing Astro architecture.

## 1. Minimal implementation

- Inspect nearby code, content schemas, components, layouts, utilities, tokens, and scripts before adding a new pattern.
- Reuse existing primitives and Content Collections. Do not add abstraction layers, framework islands, registries, factories, configuration systems, or dependencies for hypothetical future needs.
- Keep one-off logic local when extraction would not improve meaning or reuse. Extract shared behavior when it removes real duplication or establishes a genuine site-wide contract.
- Implement only the requested scope. Mention worthwhile follow-ups instead of silently including them.
- Do not rename, reorganize, restyle, or reformat unrelated files.
- Preserve static generation, platform-neutral `dist/` output, root-path deployment, accessibility, responsive behavior, print styles, light/dark themes, and English/Japanese/Chinese routing.

## 2. Astro and TypeScript conventions

- Use TypeScript and the repository's existing Astro patterns. Prefer build-time data transformation and semantic HTML over client-side JavaScript.
- Keep site metadata, i18n dictionaries, design tokens, publication normalization, and Content Collection schemas centralized in their established locations.
- Give exported utilities and shared data structures explicit, meaningful types. Validate external or authored data at the existing schema or normalization boundary.
- Do not introduce a dependency for a trivial helper. Before adding one, confirm Astro compatibility, check whether an installed dependency already solves the problem, and prefer a small maintained package.
- Never require runtime secrets for a normal production build or commit credentials.

## 3. Verification by change type

Use the checks that exercise the changed behavior. Do not claim a check passed unless it was run successfully.

### Baseline checks

For code, configuration, styles, structured data, or rendering changes, run:

```sh
pnpm format
pnpm check
pnpm build
```

For Markdown/MDX-only changes, at minimum run `pnpm format` and `pnpm build`. Also run `pnpm check` when frontmatter, imports, embedded components, expressions, routes, schemas, or rendering behavior could be affected.

For instruction- or documentation-only changes outside published site content, run `pnpm format`. Run `pnpm check` or `pnpm build` only if the changed files can affect source validation or output.

### Focused tests

- When existing tests cover the changed logic, update and run the focused tests as well as the applicable baseline checks.
- Add focused tests for substantive reusable TypeScript logic, parsers, normalization, routing decisions, or regressions where an automated assertion provides durable value.
- Cover the primary path and likely failures such as missing or malformed data, boundary values, duplicate identifiers, unsupported languages, invalid paths, and dependency errors.
- Do not add a test framework solely for a trivial markup, style, content, or configuration edit. If the repository has no suitable automated harness, verify through `astro check`, a production build, and targeted inspection of the generated route or artifact.
- Keep tests near the behavior according to the repository's established convention. Do not invent a second test layout.

## 4. Markdown and MDX review boundary

Treat Blog and Learning Notes as author-owned writing. Review technical integrity and editorial correctness without taking over authorship.

Article creation, revision, translation, restructuring, or review is content work, not a code refactor. It does not trigger the `docs/plans` rules in `branch-and-pr-workflow.instructions.md`. The presence of MDX imports, embedded components, equations, figures, or code examples does not by itself turn an article edit into an implementation refactor; only an actual change to the underlying component, schema, renderer, build pipeline, or other site code is code work.

### In scope

- typos, duplicated or missing words, punctuation, grammar, and clearly awkward or broken sentences;
- consistency issues that impede reading, including headings, lists, terminology, capitalization, and obvious translation slips;
- broken, malformed, misleadingly labeled, or missing links, anchors, citations, footnotes, references, image paths, and cross-references;
- invalid or inconsistent frontmatter, dates, slugs, tags, `translationKey` values, imports, and Content Collection schema usage;
- Markdown/MDX syntax, code-fence language labels, KaTeX syntax, component props, accessibility text, and build/render failures;
- accidental loss or breakage of figures, tables, equations, chemistry notation, citations, code, or controlled wide/full-width layouts.

### Out of scope unless the user explicitly asks

- changing the article's thesis, conclusions, opinions, technical position, narrative structure, emphasis, voice, tone, or level of detail;
- rewriting passages merely to match the reviewer's preferred style;
- replacing the author's terminology or phrasing when the original is clear and correct;
- adding new claims, examples, citations, interpretations, or background material;
- requiring optional stylistic changes as a condition of approval.

Keep suggested prose edits minimal and local. Distinguish objective errors from optional suggestions. If a possible factual or technical issue cannot be established from the supplied sources, flag it as a question for the author rather than rewriting the claim. Never fabricate facts, citations, publication metadata, biography details, or translation content.

For a mixed change, review the implementation portion under Sections 1–3 and the authored article portion under this section. Do not transfer code-review requirements such as architectural decomposition, abstraction changes, or refactor planning onto the article's content.

## 5. Completion checklist

Before finishing, confirm:

1. The change matches the request without unrelated expansion.
2. Existing architecture and shared primitives were reused.
3. Required links, references, routes, and multilingual associations remain valid.
4. Applicable formatting, checks, focused tests, and production build passed.
5. Review feedback on Markdown/MDX stays within the author-preserving boundary above.
