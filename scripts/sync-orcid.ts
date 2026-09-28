/**
 * Synchronize src/data/publications.json from the public ORCID API.
 *
 * ORCID work summaries carry no author lists, so each DOI-bearing work is
 * enriched from its DOI registrar: Crossref for journal articles and most
 * preprints, DataCite for figshare-style datasets. Works without a DOI (or
 * whose registrar lookup fails) keep the plain ORCID summary fields.
 *
 * The script needs no secret: pub.orcid.org, api.crossref.org, and
 * api.datacite.org are public. ORCID_ACCESS_TOKEN is optional.
 */
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Publication, PublicationAuthor } from '../src/data/publication-types';

const orcid = process.env.ORCID_ID ?? '0000-0002-9511-4283';
const orcidBase = process.env.ORCID_API_BASE ?? 'https://pub.orcid.org/v3.0';
const mailto = process.env.SYNC_CONTACT_EMAIL ?? 'liu.chang@ism.ac.jp';

const orcidHeaders: Record<string, string> = { Accept: 'application/json' };
if (process.env.ORCID_ACCESS_TOKEN)
  orcidHeaders.Authorization = `Bearer ${process.env.ORCID_ACCESS_TOKEN}`;

async function fetchJson(url: string, headers: Record<string, string> = {}): Promise<any | null> {
  try {
    const response = await fetch(url, { headers });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function bareOrcidId(value: string | undefined): string | undefined {
  return value?.replace(/^https?:\/\/orcid\.org\//, '') || undefined;
}

function crossrefAuthors(list: any[]): PublicationAuthor[] {
  return list.map((a) => {
    const name = [a.given, a.family].filter(Boolean).join(' ') || a.name || '';
    return {
      name,
      ...(a.given ? { given: a.given } : {}),
      ...(a.family ? { family: a.family } : {}),
      ...(a.ORCID ? { orcid: bareOrcidId(a.ORCID) } : {}),
    };
  });
}

function dataciteAuthors(list: any[]): PublicationAuthor[] {
  return list.map((a) => {
    const name =
      [a.givenName, a.familyName].filter(Boolean).join(' ') || a.name?.replace(/,\s*/, ' ') || '';
    const orcidId = a.nameIdentifiers?.find(
      (x: any) => x.nameIdentifierScheme?.toUpperCase() === 'ORCID',
    )?.nameIdentifier;
    return {
      name,
      ...(a.givenName ? { given: a.givenName } : {}),
      ...(a.familyName ? { family: a.familyName } : {}),
      ...(orcidId ? { orcid: bareOrcidId(orcidId) } : {}),
    };
  });
}

async function enrichFromCrossref(record: Publication): Promise<boolean> {
  const message = (
    await fetchJson(
      `https://api.crossref.org/works/${encodeURIComponent(record.doi!)}?mailto=${mailto}`,
    )
  )?.message;
  if (!message) return false;
  const authors = crossrefAuthors(message.author ?? []);
  if (authors.length > 0) record.authors = authors;
  record.venue = message['container-title']?.[0] || record.venue || message.publisher || undefined;
  if (message.volume) record.volume = String(message.volume);
  if (message.issue) record.issue = String(message.issue);
  const pages = message.page ?? message['article-number'];
  if (pages) record.pages = String(pages);
  const issued = message.issued?.['date-parts']?.[0];
  if (issued?.[0]) record.year = issued[0];
  if (issued?.[1]) record.month = issued[1];
  record.source = 'orcid+crossref';
  return true;
}

async function enrichFromDataCite(record: Publication): Promise<boolean> {
  const attributes = (
    await fetchJson(`https://api.datacite.org/dois/${encodeURIComponent(record.doi!)}`)
  )?.data?.attributes;
  if (!attributes) return false;
  const authors = dataciteAuthors(attributes.creators ?? []);
  if (authors.length > 0) record.authors = authors;
  record.venue = attributes.container?.title || attributes.publisher || record.venue;
  if (attributes.publicationYear) record.year = attributes.publicationYear;
  if (!record.url && attributes.url) record.url = attributes.url;
  record.source = 'orcid+datacite';
  return true;
}

const works = await fetchJson(`${orcidBase}/${orcid}/works`, orcidHeaders);
if (!works) throw new Error(`ORCID request failed for ${orcid}`);

const records: Publication[] = [];
for (const group of works.group ?? []) {
  const summary = group['work-summary']?.[0];
  if (!summary) continue;
  const ids = summary['external-ids']?.['external-id'] ?? [];
  const doi = ids
    .find((x: any) => x['external-id-type']?.toLowerCase() === 'doi')
    ?.['external-id-value']?.toLowerCase()
    ?.trim();
  const put = String(summary['put-code']);
  records.push({
    id: doi ?? `orcid-${put}`,
    title: summary.title?.title?.value ?? 'Untitled work',
    year: Number(summary['publication-date']?.year?.value) || undefined,
    month: Number(summary['publication-date']?.month?.value) || undefined,
    venue: summary['journal-title']?.value,
    doi,
    url: summary.url?.value,
    type: summary.type,
    orcidPutCode: put,
    source: 'orcid',
  });
}

const unique = [...new Map(records.map((x) => [x.doi ?? x.id, x])).values()];
let enriched = 0;
for (const record of unique) {
  if (!record.doi) continue;
  if ((await enrichFromCrossref(record)) || (await enrichFromDataCite(record))) enriched += 1;
  else console.warn(`No registrar metadata for DOI ${record.doi}; keeping ORCID summary.`);
  await new Promise((done) => setTimeout(done, 100));
}

unique.sort(
  (a, b) =>
    (b.year ?? 0) - (a.year ?? 0) ||
    (b.month ?? 0) - (a.month ?? 0) ||
    a.title.localeCompare(b.title),
);
await writeFile(resolve('src/data/publications.json'), JSON.stringify(unique, null, 2) + '\n');
console.log(
  `Wrote ${unique.length} deduplicated ORCID works for ${orcid} (${enriched} enriched via DOI registrars).`,
);
