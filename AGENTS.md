# Project Purpose

This is a personal academic and technical website: a static-first Astro site for CV, Publications, Blog, and Learning Notes, with English (default), Japanese, and Simplified Chinese routes.

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

Do not use copy-pasted layouts, scattered inline styles, duplicated components, route-specific hacks, unnecessary dependencies or framework islands, unstructured content embedded in templates, hardcoded multilingual strings, provider coupling outside deployment adapters, or page-specific scientific figure/table/equation fixes. Refactor shared behavior into the appropriate layout, component, utility, or token.

# Content Rules

- Blog and Notes use Content Collections. English is default; JA/ZH translations are optional independent files associated by stable `translationKey`.
- Exclude drafts from production. Never fabricate personal facts or publication metadata.
- A supplied CV is authoritative for biography/career details. ORCID is the upstream publication source.
- Generated ORCID data and manual overrides stay separate; generated data must never overwrite overrides.

# Publication Rules

- Synchronize ORCID at build-time/scheduled time, never per page view. Normalize to the internal `Publication` model and deduplicate by DOI when possible.
- Prioritize title, authors, venue, and year. The owner's name may be emphasized. Never invent missing metadata.

# Technical Publishing Rules

Blog and Notes are scientific publishing surfaces. Preserve figures and multi-panel figures, responsive/wide tables, Shiki-highlighted code, KaTeX equations, chemistry/materials notation and static chemical diagrams, citations/footnotes, scientific diagrams, and controlled wide/full-width breakouts. Prefer build-time remark/rehype and reusable Astro/MDX components. Never solve these with page-specific hacks.

# i18n Rules

- English uses root routes; Japanese uses `/ja/`; Chinese uses `/zh/`.
- Explicit selection wins and persists. Browser detection may suggest or route only once and must never repeatedly force redirects.
- Maintain `lang`, canonical, `hreflang`, and `x-default`. Fall back gracefully to English when no translation exists.

# Styling Rules

Use CSS custom properties/design tokens, not random colors or spacing. Stay mobile-first, accessible, light/dark aware, and test CJK typography. Do not add a CSS framework unless inherited and justified.

# Dependency Rules

Before adding a dependency: check Astro/platform support, then existing dependencies, then prefer a small maintained package. Do not add packages for trivial utilities.

# Development Rules

Use pnpm and TypeScript. Run formatting, type checks, and builds before finishing. Preserve root-path GitHub Pages builds and optional Cloudflare deployment. Normal builds require no runtime secret. Never commit credentials.

# Change Discipline

Update this file when a lasting rule changes and documentation when public behavior changes. Refactor rather than stacking patches; keep the implementation simple.

# AI Agent Behavior

Inspect existing architecture first, reuse its patterns, avoid unrelated rewrites, and do not silently alter information architecture. Never fabricate CV/publication data. Explain deviations and prefer incremental coherent changes over speculative rewrites.
