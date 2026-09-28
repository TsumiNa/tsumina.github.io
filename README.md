# TsumiNa academic website

A static-first [Astro](https://astro.build/) website for an academic CV, normalized publications, polished Blog posts, and evolving Learning Notes. English is canonical; Japanese and Simplified Chinese use `/ja/` and `/zh/`. The repository is the content source of truth, and the same build produces `dist/` for GitHub Pages or Cloudflare Workers.

## Architecture

- Astro + TypeScript with no UI framework and no hydrated framework islands.
- Blog and Notes are typed Astro Content Collections; MDX supports shared scientific components. Blog entries carry a `category` (research/technical/learning/tutorial) with static per-category listings.
- Shiki syntax highlighting and KaTeX math render at build time.
- Pagefind indexes the finished static output.
- `src/config`, `src/i18n`, and CSS tokens centralize site behavior and design. The theme is a token-driven design system (self-hosted Inter + JetBrains Mono variable fonts, fluid type/space scales, light/dark, print).
- ORCID is normalized by an explicit sync command; manual publication overrides remain separate.
- SEO/AI surface: JSON-LD (Person, WebSite, articles, publications ItemList), translation-accurate `hreflang`, sitemap, RSS, and a generated `/llms.txt` site map for AI agents.
- Analytics: `src/components/Analytics.astro` renders Google Analytics only when the `PUBLIC_GA_ID` build variable is set; default builds ship no tracking.

No existing theme was copied. See [`docs/theme-decision.md`](docs/theme-decision.md) for the evaluated shortlist and rationale.

## Local development

Requires the Node.js LTS major declared in `.node-version` and the pnpm release declared in `package.json`.

```sh
pnpm install
pnpm dev
pnpm check
pnpm format
pnpm build
pnpm preview
```

`pnpm build` runs Astro and then Pagefind over `dist/`. It does not access ORCID.

## Authoring

Add Blog `.md`/`.mdx` entries under `src/content/blog/` and Notes under `src/content/notes/`. Follow `src/content.config.ts`; set `draft: true` to exclude an entry. Optional translations are separate files with `lang: ja` or `lang: zh` and a shared stable `translationKey`.

Figures, grids, wide tables, equations, chemical structure SVGs, callouts, code, and footnotes are documented in [`docs/content-authoring.md`](docs/content-authoring.md). The sole sample is a draft development fixture, not personal content.

Most articles are AI-drafted from the owner's outline and key points, then owner-reviewed. The self-contained, tool-agnostic writing skill lives at [`skills/draft-article/SKILL.md`](skills/draft-article/SKILL.md) in the open SKILL.md format; any agent reading `AGENTS.md` is directed to it, Claude Code discovers it through the `.claude/skills/draft-article` symlink, and `.github/instructions/ai-writing.instructions.md` auto-attaches it for editor integrations. It covers the outline-driven workflow, the owner's researcher identity, factual-integrity and argumentation rules, anti-content-farm style constraints, and the `draft: true` approval gate.

## Publications and ORCID

```sh
ORCID_ID=0000-0002-9511-4283 pnpm sync:orcid
```

The public ORCID endpoint works without a token. Because ORCID work summaries carry no author lists, each DOI-bearing work is enriched from its DOI registrar: Crossref for journal articles and preprints, DataCite for datasets. Supported environment variables are:

- `ORCID_ID` (defaults to the configured public identifier)
- `ORCID_ACCESS_TOKEN` (optional API token; secret)
- `ORCID_API_BASE` (optional testing/endpoint override)
- `SYNC_CONTACT_EMAIL` (contact address for Crossref's polite pool)
- `ORCID_CLIENT_ID` and `ORCID_CLIENT_SECRET` are reserved for a future token-acquisition job and must never be committed.

The script deduplicates by normalized DOI and writes `src/data/publications.json`. Curate `src/data/publication-overrides.ts` by DOI or generated ID for featured/hidden flags, corrected display values, tags, annotation, and related links. Corresponding-author (`*`) and equal-contribution (`†`) markers are also override-only: no public API exposes them reliably, so they are never generated. Sync never writes that file.

Publications render as Nature-style citations: all authors are listed (`Family, I.`), the owner's name is emphasized, and the DOI is linked.

## Deployment

`.github/workflows/deploy.yml` builds and deploys the site to GitHub Pages at the root URL. Enable Pages with **GitHub Actions** as its source.

Cloudflare Workers Builds connects directly to the same repository and independently builds and deploys the same commit. GitHub Actions contains no Cloudflare credentials or deployment job. See [`docs/deployment.md`](docs/deployment.md) for the exact setup, commands, preview behavior, and domain guidance.

`.github/workflows/sync-orcid.yml` refreshes publication data weekly (or on manual dispatch). When the data changed, it commits `src/data/publications.json` to `main` as the Actions bot and dispatches the Pages deploy workflow; Cloudflare Workers Builds rebuilds from the same push via its own GitHub App webhook, so both mirrors stay in sync from one commit.

## Content status

Career information in `src/data/cv.ts` is transcribed from the author's September 2026 CV. The home page and EN/JA/ZH CV pages now use these facts. The author confirmed the master's period as April 2012–March 2014; separate doctoral dates remain unspecified. See [`docs/cv-source.md`](docs/cv-source.md) for provenance, date decisions, and update guidance.

ORCID remains the upstream publication source; the generated publication store is separate from CV career data. Blog and Notes remain empty apart from excluded development drafts.
