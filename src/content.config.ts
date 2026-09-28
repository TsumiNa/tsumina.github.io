import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const common = z.object({
  title: z.string(),
  description: z.string().optional(),
  published: z.coerce.date(),
  updated: z.coerce.date().optional(),
  lang: z.enum(['en', 'ja', 'zh']).default('en'),
  tags: z.array(z.string()).default([]),
  translationKey: z.string().optional(),
});
const series = z.object({
  key: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string(),
  order: z.number().int().nonnegative().default(0),
  path: z.array(z.number().int().nonnegative()).min(1).max(3),
});
export const blogCategories = ['research', 'technical', 'learning', 'tutorial'] as const;
export type BlogCategory = (typeof blogCategories)[number];
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: common.extend({
    featured: z.boolean().default(false),
    category: z.enum(blogCategories).default('technical'),
    series: series.optional(),
  }),
});
const notes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/notes' }),
  schema: common.extend({
    topic: z.string().optional(),
    status: z.enum(['draft', 'evolving', 'stable']).default('evolving'),
  }),
});
export const collections = { blog, notes };
