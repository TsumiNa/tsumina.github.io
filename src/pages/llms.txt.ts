import { getCollection } from 'astro:content';
import { researchThemes, site } from '../config/site';
import { cv } from '../data/cv';
import { ui } from '../i18n';
import { getPublications } from '../utils/publications';
import { blogSlug } from '../utils/blog-series';

/**
 * llms.txt — a compact, plain-Markdown map of the site for AI agents,
 * following the llms.txt convention (H1, block-quote summary, H2 link lists).
 */
export async function GET() {
  const blog = (await getCollection('blog', ({ data }) => data.lang === 'en' && data.show)).sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf(),
  );
  const notes = (await getCollection('notes', ({ data }) => data.lang === 'en' && data.show)).sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf(),
  );
  const pubs = getPublications();
  const articles = pubs.filter((p) => p.type === 'journal-article');
  const appointment = cv.appointments[0];

  const lines: string[] = [
    `# ${site.title}`,
    '',
    `> ${site.description} English content lives at the site root; Japanese under /ja/ and Simplified Chinese under /zh/.`,
    '',
    `${site.name} (${ui.zh.displayName} / ${ui.ja.displayName}) is ${appointment?.title} at ${appointment?.organization} and Visiting Scientist at RIKEN TRIP-AGIS. ORCID: ${site.orcid} — GitHub: ${site.github} — researchmap: ${site.researchmap}`,
    '',
    '## Pages',
    '',
    `- [Research](${site.url}/research/): research themes and directions`,
    `- [Publications](${site.url}/publications/): ${pubs.length} works synchronized from ORCID, rendered as Nature-style citations with DOIs`,
    `- [CV](${site.url}/cv/): appointments, experience, education, software, talks`,
    `- [Blog](${site.url}/blog/): essays on research, engineering, and scientific software`,
    `- [Notes](${site.url}/notes/): evolving study notes and technical references`,
    '',
    '## Research focus',
    '',
    ...researchThemes.map((theme) => `- ${theme.title}: ${theme.description}`),
  ];

  if (articles.length > 0) {
    lines.push('', '## Selected publications', '');
    for (const p of articles.slice(0, 10)) {
      const doi = p.doi ? ` https://doi.org/${p.doi}` : '';
      lines.push(`- ${p.title} (${p.venue}, ${p.year}).${doi}`);
    }
  }
  if (blog.length > 0) {
    lines.push('', '## Blog posts', '');
    for (const entry of blog)
      lines.push(
        `- [${entry.data.title}](${site.url}/blog/${blogSlug(entry.id)}/)${entry.data.description ? `: ${entry.data.description}` : ''}`,
      );
  }
  if (notes.length > 0) {
    lines.push('', '## Notes', '');
    for (const entry of notes)
      lines.push(
        `- [${entry.data.title}](${site.url}/notes/${entry.id}/)${entry.data.description ? `: ${entry.data.description}` : ''}`,
      );
  }
  lines.push('');
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
