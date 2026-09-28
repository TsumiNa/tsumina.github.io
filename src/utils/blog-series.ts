import type { CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

export interface BlogSeriesNode {
  entry: BlogEntry;
  path: number[];
  children: BlogSeriesNode[];
}

export interface BlogSeriesGroup {
  key: string;
  title: string;
  order: number;
  category: BlogEntry['data']['category'];
  roots: BlogSeriesNode[];
}

export interface OrganizedBlogEntries {
  standalone: BlogEntry[];
  series: BlogSeriesGroup[];
}

const pathKey = (path: number[]) => path.join('.');

const comparePaths = (a: number[], b: number[]) => {
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    if (a[index] === undefined) return -1;
    if (b[index] === undefined) return 1;
    if (a[index] !== b[index]) return a[index] - b[index];
  }
  return 0;
};

export function organizeBlogEntries(entries: BlogEntry[]): OrganizedBlogEntries {
  const standalone: BlogEntry[] = [];
  const grouped = new Map<
    string,
    { group: Omit<BlogSeriesGroup, 'roots'>; entries: BlogEntry[] }
  >();

  for (const entry of entries) {
    const series = entry.data.series;
    if (!series) {
      standalone.push(entry);
      continue;
    }
    if (series.path.length < 1 || series.path.length > 3) {
      throw new Error(`Series "${series.key}" entry "${entry.id}" must have a 1–3 level path.`);
    }

    const existing = grouped.get(series.key);
    if (!existing) {
      grouped.set(series.key, {
        group: {
          key: series.key,
          title: series.title,
          order: series.order,
          category: entry.data.category,
        },
        entries: [entry],
      });
      continue;
    }

    if (
      existing.group.title !== series.title ||
      existing.group.order !== series.order ||
      existing.group.category !== entry.data.category
    ) {
      throw new Error(
        `Series "${series.key}" must use one title, order, and category within a language.`,
      );
    }
    existing.entries.push(entry);
  }

  const groups = [...grouped.values()].map(({ group, entries: seriesEntries }) => {
    const nodes = new Map<string, BlogSeriesNode>();

    for (const entry of seriesEntries) {
      const path = entry.data.series!.path;
      const key = pathKey(path);
      if (nodes.has(key)) {
        throw new Error(`Series "${group.key}" has duplicate path [${path.join(', ')}].`);
      }
      nodes.set(key, { entry, path, children: [] });
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
          `Series "${group.key}" entry "${node.entry.id}" is missing parent path [${parentPath.join(', ')}].`,
        );
      }
      parent.children.push(node);
    }

    const sortNodes = (items: BlogSeriesNode[]) => {
      items.sort((a, b) => comparePaths(a.path, b.path));
      for (const item of items) sortNodes(item.children);
    };
    sortNodes(roots);

    return { ...group, roots };
  });

  groups.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  return { standalone, series: groups };
}
