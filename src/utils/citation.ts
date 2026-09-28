import { site } from '../config/site';
import type { PublicationAuthor } from '../data/publication-types';
import type { DisplayPublication } from './publications';

/** One author prepared for Nature-style rendering ("Liu, C." with markers). */
export interface CitationAuthor {
  display: string;
  isOwner: boolean;
  corresponding: boolean;
  equalContribution: boolean;
}

const ownerOrcid = site.orcid.replace(/^https?:\/\/orcid\.org\//, '');
const cjkPattern = /[\u2e80-\u9fff\uf900-\ufaff\u3040-\u30ff]/;

function normalize(value: string): string {
  return value.toLowerCase().replace(/[.,]/g, ' ').replace(/\s+/g, ' ').trim();
}

function initials(given: string): string {
  return given
    .split(/\s+/)
    .map((part) =>
      part
        .split('-')
        .map((piece) => (piece ? `${piece[0].toUpperCase()}.` : ''))
        .join('-'),
    )
    .join(' ');
}

function natureName(author: PublicationAuthor): string {
  if (!author.family || cjkPattern.test(author.name)) return author.name;
  return author.given ? `${author.family}, ${initials(author.given)}` : author.family;
}

function matchesAny(author: PublicationAuthor, display: string, list?: string[]): boolean {
  if (!list?.length) return false;
  const candidates = new Set(
    [author.name, author.family, display].filter(Boolean).map((x) => normalize(x!)),
  );
  return list.some((entry) => candidates.has(normalize(entry)));
}

function isOwner(author: PublicationAuthor): boolean {
  if (author.orcid) return author.orcid === ownerOrcid;
  const name = normalize(author.name);
  return (
    name === 'chang liu' ||
    name === 'liu chang' ||
    name === '\u5218\u7545' || // 刘畅
    name === '\u5289\u66a2' || // 劉暢
    (normalize(author.family ?? '') === 'liu' && normalize(author.given ?? '').startsWith('chang'))
  );
}

/** Prepare a publication's authors for Nature-style citation rendering. */
export function citationAuthors(pub: DisplayPublication): CitationAuthor[] {
  return (pub.authors ?? []).map((author) => {
    const display = natureName(author);
    return {
      display,
      isOwner: isOwner(author),
      corresponding: matchesAny(author, display, pub.correspondingAuthors),
      equalContribution: matchesAny(author, display, pub.equalContribution),
    };
  });
}

/** True when any listed publication carries a corresponding/equal-contribution marker. */
export function hasAuthorMarkers(pubs: DisplayPublication[]): boolean {
  return pubs.some((p) => p.correspondingAuthors?.length || p.equalContribution?.length);
}
