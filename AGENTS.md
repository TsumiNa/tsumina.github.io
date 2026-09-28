# Project Purpose

This is a personal academic and technical website: a static-first Astro site for CV, Publications, Blog, and Learning Notes, with English (default), Japanese, and Simplified Chinese routes.

# Required Workflow Instructions

Before modifying this repository, read and follow the applicable rules in:

- [Branch and Pull Request Workflow](.github/instructions/branch-and-pr-workflow.instructions.md) for branch selection, PR scope, and code-refactor planning;
- [Implementation, Checks, and Content Review](.github/instructions/implementation-and-tests.instructions.md) for Astro/TypeScript implementation, proportionate verification, and the author-preserving Markdown/MDX review boundary;
- [AI-Assisted Writing](.github/instructions/ai-writing.instructions.md) when drafting, revising, or translating Blog/Notes content on the owner's behalf — most articles are AI-drafted from the owner's outline and gated on the owner's approval;
- [Shell Environment and Repository Commands](.github/instructions/shell-environment.instructions.md) before running terminal commands.

These files are mandatory extensions of `AGENTS.md`, not optional guidance. Classify work by what is changing:

- Astro components, layouts, TypeScript, CSS/design tokens, schemas, routing, build integrations, scripts, tests, and deployment configuration follow the code and refactor rules.
- Authored Markdown/MDX prose, article structure, examples, citations, figures, and translations follow the content-review rules and do not trigger `docs/plans` refactor planning.
- Mixed changes must keep the two scopes separate. Code rules must not be used to prescribe changes to an article's thesis, conclusions, voice, terminology, structure, or level of detail.

# Architecture Principles

- Keep source content in Git as Markdown/MDX or typed structured data. Blog and Notes must use Astro Content Collections.
- Prefer static generation, build-time transformations, reusable layouts/components, semantic HTML, and minimal client JavaScript.
- Keep the architecture platform-neutral. GitHub Pages is primary; Cloudflare consumes the same `dist/` output.
- Centralize site metadata, i18n dictionaries, design tokens, and publication normalization.

# Theme / UI Rules

- Preserve the coherent, typography-led theme architecture. Reuse primitives before adding components.
- Use centralized tokens and the established spacing/type scale; do not create page-specific design systems.
- Maintain a restrained, modern academic/scientific visual language, responsive behavior, accessibility, print support, and light/dark themes.

# No-Ad-Hoc Rules

In site code and rendering implementation, do not use copy-pasted layouts, scattered inline styles, duplicated components, route-specific hacks, unnecessary dependencies or framework islands, unstructured content embedded in templates, hardcoded multilingual strings, provider coupling outside deployment adapters, or page-specific scientific figure/table/equation fixes. Put genuinely shared implementation behavior in the appropriate layout, component, utility, or token; this rule does not authorize restructuring article content.

# Content Rules

- Blog and Notes use Content Collections. English is default; JA/ZH translations are optional independent files associated by stable `translationKey`.
- Exclude drafts from production. Never fabricate personal facts or publication metadata.
- A supplied CV is authoritative for biography/career details. ORCID is the upstream publication source.
- Generated ORCID data and manual overrides stay separate; generated data must never overwrite overrides.

# Publication Rules

- Synchronize ORCID at build-time/scheduled time, never per page view. Normalize to the internal `Publication` model and deduplicate by DOI when possible.
- Prioritize title, authors, venue, and year. The owner's name may be emphasized. Never invent missing metadata.

# Technical Publishing Rules

Blog and Notes are scientific publishing surfaces. Preserve figures and multi-panel figures, responsive/wide tables, Shiki-highlighted code, KaTeX equations, chemistry/materials notation and static chemical diagrams, citations/footnotes, scientific diagrams, and controlled wide/full-width breakouts. When changing the rendering implementation, prefer build-time remark/rehype and reusable Astro/MDX components; never solve rendering behavior with page-specific hacks. Review authored prose only within the content-review boundary in `implementation-and-tests.instructions.md`.

# i18n Rules

- English uses root routes; Japanese uses `/ja/`; Chinese uses `/zh/`.
- Explicit selection wins and persists. Browser detection may suggest or route only once and must never repeatedly force redirects.
- Maintain `lang`, canonical, `hreflang`, and `x-default`. Fall back gracefully to English when no translation exists.

# Styling Rules

Use CSS custom properties/design tokens, not random colors or spacing. Stay mobile-first, accessible, light/dark aware, and test CJK typography. Do not add a CSS framework unless inherited and justified.

# Dependency Rules

Before adding a dependency: check Astro/platform support, then existing dependencies, then prefer a small maintained package. Do not add packages for trivial utilities.

# Development Rules

Use pnpm and TypeScript. Run the checks required for the specific change type by `implementation-and-tests.instructions.md`; do not impose code/build checks on instruction-only work when that file does not require them. Preserve root-path GitHub Pages builds and optional Cloudflare deployment. Normal builds require no runtime secret. Never commit credentials.

# Change Discipline

Update this file or its referenced instruction files when a lasting repository rule changes, and update documentation when public behavior changes. For code and site architecture, prefer a coherent shared implementation over stacked workarounds while keeping the requested scope small. Do not treat article editing or review as code refactoring.

# AI Agent Behavior

Inspect existing architecture first, reuse its patterns, avoid unrelated rewrites, and do not silently alter information architecture. Never fabricate CV/publication data. Explain deviations and prefer incremental coherent changes over speculative rewrites.
