import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type Publication = {
  id: string;
  title: string;
  year?: number;
  month?: number;
  venue?: string;
  doi?: string;
  url?: string;
  type?: string;
  orcidPutCode?: string;
  source: 'orcid';
};
const orcid = process.env.ORCID_ID ?? '0000-0002-9511-4283';
const base = process.env.ORCID_API_BASE ?? 'https://pub.orcid.org/v3.0';
const headers: Record<string, string> = { Accept: 'application/json' };
if (process.env.ORCID_ACCESS_TOKEN)
  headers.Authorization = `Bearer ${process.env.ORCID_ACCESS_TOKEN}`;
const response = await fetch(`${base}/${orcid}/works`, { headers });
if (!response.ok)
  throw new Error(`ORCID request failed: ${response.status} ${response.statusText}`);
const body: any = await response.json();
const records: Publication[] = [];
for (const group of body.group ?? []) {
  const summary = group['work-summary']?.[0];
  if (!summary) continue;
  const ids = summary['external-ids']?.['external-id'] ?? [];
  const doi = ids
    .find((x: any) => x['external-id-type']?.toLowerCase() === 'doi')
    ?.['external-id-value']?.toLowerCase();
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
const unique = [...new Map(records.map((x) => [x.doi ?? x.id, x])).values()].sort(
  (a, b) => (b.year ?? 0) - (a.year ?? 0),
);
await writeFile(resolve('src/data/publications.json'), JSON.stringify(unique, null, 2) + '\n');
console.log(`Wrote ${unique.length} deduplicated ORCID works for ${orcid}.`);
