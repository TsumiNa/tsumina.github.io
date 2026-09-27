# TsumiNa academic website

A static-first [Astro](https://astro.build/) website for an academic CV, normalized publications, polished Blog posts, and evolving Learning Notes. English is canonical; Japanese and Simplified Chinese use `/ja/` and `/zh/`. The repository is the content source of truth, and the same `dist/` deploys to GitHub Pages or Cloudflare Pages.

## Architecture

- Astro + TypeScript with no UI framework and no hydrated framework islands.
- Blog and Notes are typed Astro Content Collections; MDX supports shared scientific components.
- Shiki syntax highlighting and KaTeX math render at build time.
- Pagefind indexes the finished static output.
- `src/config`, `src/i18n`, and CSS tokens centralize site behavior and design.
- ORCID is normalized by an explicit sync command; manual publication overrides remain separate.

No existing theme was copied. See [`docs/theme-decision.md`](docs/theme-decision.md) for the evaluated shortlist and rationale.

## Local development

Requires Node 22 and pnpm 10.

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

## Publications and ORCID

```sh
ORCID_ID=0000-0002-9511-4283 pnpm sync:orcid
```

The public ORCID endpoint may work without a token. Supported environment variables are:

- `ORCID_ID` (defaults to the configured public identifier)
- `ORCID_ACCESS_TOKEN` (optional API token; secret)
- `ORCID_API_BASE` (optional testing/endpoint override)
- `ORCID_CLIENT_ID` and `ORCID_CLIENT_SECRET` are reserved for a future token-acquisition job and must never be committed.

The script deduplicates by normalized DOI and writes `src/data/publications.json`. Curate `src/data/publication-overrides.ts` by DOI or generated ID for featured/hidden flags, corrected display values, tags, annotation, and related links. Sync never writes that file.

## Deployment

`.github/workflows/deploy.yml` builds once and deploys the artifact to GitHub Pages at the root URL. Enable Pages with **GitHub Actions** as its source.

Optional Cloudflare deployment consumes that same artifact when repository variable `ENABLE_CLOUDFLARE=true`. Configure:

- secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- variable `CLOUDFLARE_PROJECT_NAME`

Cloudflare is otherwise skipped and cannot block Pages. `.github/workflows/sync-orcid.yml` runs a read-only weekly/manual sync preview and prints a diff; it deliberately does not commit.

## Content status

No authoritative CV file was present during initialization, so career, education, awards, dates, and affiliations are deliberately absent. The publication store starts empty until `pnpm sync:orcid` succeeds. Research-theme copy is generic and explicitly limited to the supplied subject areas.
