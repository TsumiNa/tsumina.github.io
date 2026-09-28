# Technical content authoring

Blog entries belong in `src/content/blog/`; learning notes belong in `src/content/notes/`. Both collections accept `.mdx` files only, including prose-only entries, so every article can adopt shared components without a later extension migration.

## Preview and approval

Every Content Collection entry is rendered by branch builds and has a direct URL in the Cloudflare branch preview. The owner reviews the rendered preview and approves the pull request before merge; merging is what makes the content eligible for the production build.

Do not add a `draft` visibility field. Set `show: false` only when an entry should remain directly accessible but be omitted from listings, the home page, RSS, `llms.txt`, Pagefind, and search-engine indexing. This is not access control. Learning Notes may use `status: draft`, but that value is a public maturity label and does not hide the Note.

## Frontmatter

```yaml
---
title: A precise title
description: A short listing and SEO summary.
published: 2026-09-27
updated: 2026-10-03
lang: en
tags: [materials, machine-learning]
category: technical
translationKey: stable-topic-key
show: true
banner:
  src: /figures/article-slug/banner.webp
  alt: A meaningful description of the banner image
---
```

Blog entries accept `category: research | technical | learning | tutorial` (default `technical`); each category with visible posts gets a static listing at `/blog/category/<category>/`. Notes also accept `topic` and the visible maturity label `status: draft | evolving | stable`. `show` defaults to `true`. `banner` is optional, but when present requires both a root-relative `src` and meaningful `alt` text; it is reused in the listing, article header, Open Graph metadata, and structured data. A translation is a separate file with the same `translationKey` and its own `lang`; the article's `hreflang` alternates and the header language switcher only advertise translations that actually exist.

## Optional series hierarchy

Blog posts directly inside `src/content/blog/` are standalone. A directory creates a series, and its file tree is the reading tree:

```text
src/content/blog/
├── standalone-post.mdx
└── ai-coding-for-non-cs/
    ├── 00-prologue-zh.mdx
    ├── 01-project-language/
    │   ├── 01-frameworks-zh.mdx
    │   └── 02-abstraction-zh.mdx
    └── 02-first-delivery/
        └── 01-build-and-ci-zh.mdx
```

- The first directory is the series. An `.mdx` directly inside it is a series-level article such as a prologue.
- A second directory is a chapter; its `.mdx` files are the articles or sections in that chapter.
- Do not author `index.mdx` or `index-en.mdx`/`index-ja.mdx`/`index-zh.mdx` inside a series. Astro generates index pages for both the series and every chapter.
- Prefix filenames with zero-padded numbers such as `01-` and `02-`; natural filename order controls reading order and previous/next navigation.
- The maximum authored path is `series/chapter/article.mdx`. Deeper paths, a direct article whose URL collides with a chapter directory, reserved index filenames, and mixed categories in one localized series fail the build.

Series information never belongs in frontmatter. Folder names control hierarchy, labels, ordering, and URLs, so use readable slugs with optional numeric prefixes. Article pages receive a sticky, collapsible series table of contents with the current article highlighted; on small screens it becomes a collapsed disclosure above the article. The implementation is static and uses native HTML without client JavaScript.

### Directory configuration

Every series and chapter directory must contain `config.toml`. The folder name remains a stable, URL-safe path segment; localized display titles and directory-level behavior live in the config:

```toml
show = true
cover = "/figures/ai-coding/cover.svg"

[title]
en = "AI Coding for Non-CS Learners"
ja = "AI coding 時代の非 CS 専攻向けプログラミング"
zh = "AI coding 时代的非 CS 编程"
```

- `[title]` is required. Add a non-empty `en`, `ja`, or `zh` value for every language represented by articles below that directory. Titles never change the route.
- `show` defaults to `true`. When `false`, the directory index and every descendant article are removed from listings, generated tables of contents, the home page, RSS, `llms.txt`, Pagefind, and search-engine indexing. Direct article URLs still build for branch-preview review; this is not access control.
- `cover` is optional and must be a root-relative image path. A series cover appears on its generated book index and listing card; a chapter cover appears on the generated chapter title page.
- A chapter's `show` is combined with its parent series setting. A hidden series therefore hides all chapters and articles below it.
- Keep future directory-level behavior in this file rather than article frontmatter.

## Figures and multi-panel figures

```mdx
import Figure from '../../components/content/Figure.astro';
import FigureGrid from '../../components/content/FigureGrid.astro';

<Figure
  src="/figures/result.svg"
  alt="Describe the evidence, not merely its appearance"
  label="Fig. 1"
  caption="Result at 300 K."
  width="wide"
/>

<FigureGrid caption="Fig. 2. Comparison panels.">
  <Figure src="/figures/a.svg" alt="Panel a description" label="(a)" />
  <Figure src="/figures/b.svg" alt="Panel b description" label="(b)" />
</FigureGrid>
```

`width` is `normal`, `wide`, or `full`. Prefer authored SVG or optimized PNG/JPEG/WebP/AVIF files and meaningful alt text.

## Tables

Ordinary Markdown tables are automatically styled. For a caption or breakout, import `ResponsiveTable` and provide semantic table markup:

```mdx
<ResponsiveTable caption="Table 1. Model comparison." width="wide">
  <thead>
    <tr>
      <th>Model</th>
      <th>MAE (eV)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Baseline</td>
      <td>0.12</td>
    </tr>
  </tbody>
</ResponsiveTable>
```

Wide tables scroll rather than shrinking to illegibility.

## Code

Fenced blocks use Astro's build-time Shiki renderer. A language provides highlighting; braces highlight lines:

````markdown
```python {2}
energy = calculate(structure)
print(energy)
```
````

Blocks scroll horizontally. A copy/wrap toolbar is intentionally deferred to avoid mandatory client JavaScript.

## Equations and scientific notation

Use `$E=mc^2$` inline and double-dollar fences for display math. `remark-math` and KaTeX render at build time. Long display equations scroll. Unicode notation such as Fe₂O₃, α-Al₂O₃, Å, μm, (111), and [001] is supported directly.

## Chemical structures

Prefer publication-quality static SVG:

```mdx
import ChemStructure from '../../components/content/ChemStructure.astro';
<ChemStructure src="/figures/molecule.svg" alt="Structural formula of …" caption="Molecular structure." />
```

SMILES-to-structure generation is deferred; generate the SVG with a domain tool and commit it so no heavy chemistry runtime reaches every reader.

## Footnotes and references

Use standard Markdown footnotes and DOI links:

```markdown
The method follows prior work.[^paper]

[^paper]: Author, _Title_, 2026. https://doi.org/…
```

A structured BibTeX/CSL engine is deferred, but this syntax can be migrated later.

## Callouts

```mdx
import Callout from '../../components/content/Callout.astro';
<Callout type="Definition" title="Order parameter">Concise semantic content.</Callout>
```

Use Note, Important, Warning, Definition, Example, Result, Experiment, or Observation sparingly.

## Diagrams

Commit responsive SVG and render it through `Figure`. The repository includes a static workflow fixture. Mermaid is intentionally deferred: a build-time Mermaid dependency is not justified until real content needs it.
