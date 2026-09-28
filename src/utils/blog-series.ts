import type { CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

const localizedIndex = /^index(?:-(?:en|ja|zh))?$/;

/** `index[-locale].mdx` represents its directory in public URLs. */
export const blogSlug = (id: string) => id.replace(/\/index(?:-(?:en|ja|zh))?$/, '');

export interface BlogSeriesNode {
  entry: BlogEntry;
  path: string[];
  position: number[];
  children: BlogSeriesNode[];
}

export interface BlogSeriesGroup {
  key: string;
  title: string;
  category: BlogEntry['data']['category'];
  overview?: BlogEntry;
  roots: BlogSeriesNode[];
}

export interface OrganizedBlogEntries {
  standalone: BlogEntry[];
  series: BlogSeriesGroup[];
}

export interface BlogSeriesNavigation {
  title: string;
  position?: string;
  overview?: BlogEntry;
  previous?: BlogEntry;
  next?: BlogEntry;
}

const compareNames = (a: string, b: string) =>
  a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' });

const pathKey = (path: string[]) => path.join('/');

const titleFromKey = (key: string) =>
  key
    .replace(/^\d+[-_.]*/, '')
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === 'ai' || lower === 'cs') return lower.toUpperCase();
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join(' ')
    .replace(/\bFor\b/g, 'for')
    .replace(/\bNon CS\b/g, 'Non-CS');

function locationOf(entry: BlogEntry) {
  const segments = entry.id.split('/');
  if (segments.length === 1) return undefined;

  const key = segments[0];
  const path = segments.slice(1);
  if (localizedIndex.test(path.at(-1) ?? '')) path.pop();
  if (path.length > 2) {
    throw new Error(
      `Series "${key}" entry "${entry.id}" exceeds the three article levels: overview, chapter, section.`,
    );
  }
  return { key, path };
}

export function organizeBlogEntries(entries: BlogEntry[]): OrganizedBlogEntries {
  const standalone: BlogEntry[] = [];
  const grouped = new Map<
    string,
    { category: BlogEntry['data']['category']; entries: BlogEntry[] }
  >();

  for (const entry of entries) {
    if (!entry.data.show) continue;
    const location = locationOf(entry);
    if (!location) {
      standalone.push(entry);
      continue;
    }

    const existing = grouped.get(location.key);
    if (!existing) {
      grouped.set(location.key, { category: entry.data.category, entries: [entry] });
      continue;
    }

    if (existing.category !== entry.data.category) {
      throw new Error(`Series "${location.key}" must use one category within a language.`);
    }
    existing.entries.push(entry);
  }

  const groups = [...grouped.entries()].map(([key, { category, entries: seriesEntries }]) => {
    const nodes = new Map<string, BlogSeriesNode>();
    let overview: BlogEntry | undefined;

    for (const entry of seriesEntries) {
      const path = locationOf(entry)!.path;
      const normalized = pathKey(path);
      if (path.length === 0) {
        if (overview) {
          throw new Error(`Series "${key}" has more than one overview article.`);
        }
        overview = entry;
        continue;
      }
      if (nodes.has(normalized)) {
        throw new Error(`Series "${key}" has duplicate article path "${normalized}".`);
      }
      nodes.set(normalized, { entry, path, position: [], children: [] });
    }

    const roots: BlogSeriesNode[] = [];
    for (const node of nodes.values()) {
      if (node.path.length === 1) {
        roots.push(node);
        continue;
      }

      const parentPath = node.path.slice(0, -1);
      const parent = nodes.get(pathKey(parentPath));
      if (!parent) {
        throw new Error(
          `Series "${key}" entry "${node.entry.id}" is missing chapter "${parentPath.join('/')}".`,
        );
      }
      parent.children.push(node);
    }

    const sortNodes = (items: BlogSeriesNode[], parentPosition: number[] = []) => {
      items.sort((a, b) => compareNames(a.path.at(-1)!, b.path.at(-1)!));
      for (const [index, item] of items.entries()) {
        item.position = [...parentPosition, index + 1];
        sortNodes(item.children, item.position);
      }
    };
    sortNodes(roots);

    return {
      key,
      title: overview?.data.title ?? titleFromKey(key),
      category,
      overview,
      roots,
    };
  });

  standalone.sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
  groups.sort((a, b) => compareNames(a.key, b.key));
  return { standalone, series: groups };
}

const flattenNodes = (nodes: BlogSeriesNode[]): BlogSeriesNode[] =>
  nodes.flatMap((node) => [node, ...flattenNodes(node.children)]);

export function getBlogSeriesNavigation(
  entries: BlogEntry[],
  currentId: string,
): BlogSeriesNavigation | undefined {
  const organized = organizeBlogEntries(entries);
  for (const series of organized.series) {
    const nodes = flattenNodes(series.roots);
    const ordered = series.overview
      ? [series.overview, ...nodes.map((node) => node.entry)]
      : nodes.map((node) => node.entry);
    const currentIndex = ordered.findIndex((entry) => entry.id === currentId);
    if (currentIndex === -1) continue;
    const node = nodes.find((item) => item.entry.id === currentId);
    return {
      title: series.title,
      position: node?.position.join('.'),
      overview: series.overview,
      previous: ordered[currentIndex - 1],
      next: ordered[currentIndex + 1],
    };
  }
  return undefined;
}
