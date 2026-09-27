# Technical content authoring

Blog entries belong in `src/content/blog/`; learning notes belong in `src/content/notes/`. Use `.mdx` when importing components. Drafts are built into the collection but excluded from routes and listings.

## Frontmatter

```yaml
---
title: A precise title
description: A short listing and SEO summary.
published: 2026-09-27
updated: 2026-10-03
lang: en
tags: [materials, machine-learning]
draft: false
translationKey: stable-topic-key
---
```

Notes also accept `topic` and `status: draft | evolving | stable`. A translation is a separate file with the same `translationKey` and its own `lang`.

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

See the deliberately unpublished `src/content/notes/technical-publishing-sample.mdx` for all primitives together.
