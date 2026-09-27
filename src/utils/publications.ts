import generated from '../data/publications.json';
import { publicationOverrides } from '../data/publication-overrides';
export interface Publication {
  id: string;
  title: string;
  authors?: string[];
  year?: number;
  month?: number;
  venue?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  type?: string;
  orcidPutCode?: string;
  source?: string;
}
export type DisplayPublication = Publication & (typeof publicationOverrides)[string];
export function getPublications(): DisplayPublication[] {
  return (generated as Publication[])
    .map((p) => ({ ...p, ...(publicationOverrides[p.doi?.toLowerCase() || p.id] ?? {}) }))
    .filter((p) => !p.hidden)
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}
