import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../config/site';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => data.lang === 'en')).sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf(),
  );
  return rss({
    title: site.title,
    description: site.description,
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.published,
      categories: [p.data.category, ...p.data.tags],
      link: `/blog/${p.id}/`,
    })),
  });
}
