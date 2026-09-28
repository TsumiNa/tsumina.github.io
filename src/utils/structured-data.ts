import { site } from '../config/site';
import { cv } from '../data/cv';
import { ui, type Locale } from '../i18n';
import type { DisplayPublication } from './publications';

const personId = `${site.url}/#person`;
const inLanguageOf: Record<Locale, string> = { en: 'en-US', ja: 'ja-JP', zh: 'zh-CN' };

export function personLd() {
  const appointment = cv.appointments[0];
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId,
    name: site.name,
    alternateName: [ui.zh.displayName, ui.ja.displayName, site.githubHandle],
    jobTitle: appointment?.title,
    worksFor: appointment && { '@type': 'Organization', name: appointment.organization },
    email: `mailto:${site.email}`,
    url: site.url,
    sameAs: [site.orcid, site.github, site.researchmap],
  };
}

export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.title,
    url: site.url,
    description: site.description,
    author: { '@id': personId },
  };
}

export function articleLd(input: {
  title: string;
  description?: string;
  published: Date;
  updated?: Date;
  url: URL | string;
  lang: Locale;
  tags?: string[];
  kind: 'blog' | 'notes';
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': input.kind === 'blog' ? 'BlogPosting' : 'TechArticle',
    headline: input.title,
    description: input.description,
    datePublished: input.published.toISOString(),
    dateModified: (input.updated ?? input.published).toISOString(),
    inLanguage: inLanguageOf[input.lang],
    keywords: input.tags?.length ? input.tags.join(', ') : undefined,
    image: input.image ? new URL(input.image, site.url).toString() : undefined,
    mainEntityOfPage: String(input.url),
    author: { '@id': personId, '@type': 'Person', name: site.name, url: site.url },
  };
}

export function publicationsLd(pubs: DisplayPublication[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${site.name} — Publications`,
    itemListElement: pubs.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': p.type === 'data-set' ? 'Dataset' : 'ScholarlyArticle',
        name: p.title,
        identifier: p.doi ? `https://doi.org/${p.doi}` : undefined,
        url: p.doi ? `https://doi.org/${p.doi}` : p.url,
        datePublished: p.year ? String(p.year) : undefined,
        author: p.authors?.map((a) => ({ '@type': 'Person', name: a.name })),
        isPartOf: p.venue ? { '@type': 'Periodical', name: p.venue } : undefined,
      },
    })),
  };
}
