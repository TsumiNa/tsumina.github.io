import { ui, type Locale } from '../i18n';

/**
 * Append a "#" anchor link to every identified article heading, with an
 * accessible label in the article's own language. A frontmatter-aware
 * replacement for rehype-autolink-headings, whose static configuration could
 * only inject one hardcoded label for all locales.
 */
export default function rehypeHeadingAnchors() {
  return (tree: any, file: any) => {
    const frontmatter = file.data?.astro?.frontmatter ?? {};
    const lang = (frontmatter.lang ?? 'en') as Locale;
    const label = (ui[lang] ?? ui.en).headingAnchor;
    const walk = (node: any) => {
      for (const child of node.children ?? []) {
        if (/^h[2-6]$/.test(child.tagName ?? '') && child.properties?.id) {
          child.children.push({
            type: 'element',
            tagName: 'a',
            properties: {
              href: `#${child.properties.id}`,
              className: ['heading-anchor'],
              ariaLabel: label,
            },
            children: [{ type: 'text', value: '#' }],
          });
        } else {
          walk(child);
        }
      }
    };
    walk(tree);
  };
}
