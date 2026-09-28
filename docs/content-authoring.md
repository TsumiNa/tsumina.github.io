# Technical content authoring

Blog entries belong in `src/content/blog/`; learning notes belong in `src/content/notes/`. Both collections accept `.mdx` files only, including prose-only entries, so every article can adopt shared components without a later extension migration.

## Preview and approval

Content visibility follows Git state rather than a frontmatter flag. Every Content Collection entry is rendered by branch builds and appears in the Cloudflare branch preview. The owner reviews the rendered preview and approves the pull request before merge; merging is what makes the content eligible for the production build.

Do not add a `draft` visibility field. Learning Notes may use `status: draft`, but that value is a public maturity label and does not hide the Note.

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
---
```

Blog entries accept `category: research | technical | learning | tutorial` (default `technical`); each category with posts gets a static listing at `/blog/category/<category>/`. Notes also accept `topic` and the visible maturity label `status: draft | evolving | stable`. A translation is a separate file with the same `translationKey` and its own `lang`; the article's `hreflang` alternates and the header language switcher only advertise translations that actually exist.

## Optional series hierarchy

Blog posts without `series` remain standalone entries directly under their category. A series uses an ordered numeric path to build a reading tree with at most three article levels:

```yaml
series:
  key: ai-coding-for-non-cs
  title: AI coding for non-CS learners
  order: 1
  path: [1, 2]
```

- `key` is a stable lowercase identifier shared by every entry in the series.
- `title` is the localized series title. Entries with the same key and language must use the same title.
- `order` sorts multiple series in one category and must remain consistent within the series.
- `path` locates the article in the tree: `[0]` can be a prologue, `[1]` a first chapter, `[1, 1]` its first section, and `[1, 1, 1]` one final nested level. Every child path requires an article at its parent path.

All entries in one localized series must use the same category. Duplicate positions, missing parents, inconsistent series metadata, and paths deeper than three levels fail the build. The series path controls list hierarchy and reading order; the file path still controls the article URL.

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
