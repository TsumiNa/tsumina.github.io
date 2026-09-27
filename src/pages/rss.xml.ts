import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../config/site';
export async function GET(context: any) {
  const posts = await getCollection('blog', ({ data }) => !data.draft && data.lang === 'en');
  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.published,
      link: `/blog/${p.id}/`,
    })),
  });
}
