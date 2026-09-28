import generated from '../data/publications.json';
import { publicationOverrides, type PublicationOverride } from '../data/publication-overrides';
import type { Publication, PublicationAuthor } from '../data/publication-types';

export type { Publication, PublicationAuthor } from '../data/publication-types';

export type DisplayPublication = Omit<Publication, 'authors'> &
  Omit<PublicationOverride, 'authors'> & { authors?: PublicationAuthor[] };

export function getPublications(): DisplayPublication[] {
  return (generated as Publication[])
    .map((p) => {
      const override = publicationOverrides[p.doi?.toLowerCase() || p.id] ?? {};
      const authors = override.authors
        ? override.authors.map((name): PublicationAuthor => ({ name }))
        : p.authors;
      return { ...p, ...override, authors };
    })
    .filter((p) => !p.hidden)
    .sort(
      (a, b) =>
        (b.year ?? 0) - (a.year ?? 0) ||
        (b.month ?? 0) - (a.month ?? 0) ||
        a.title.localeCompare(b.title),
    );
}
