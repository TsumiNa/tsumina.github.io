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
  show: z.boolean().default(true),
  banner: z
    .object({
      src: z.string().regex(/^\/(?!\/)/, 'Banner src must be a root-relative path.'),
      alt: z.string().min(1),
    })
    .optional(),
});
export const blogCategories = ['research', 'technical', 'learning', 'tutorial'] as const;
export type BlogCategory = (typeof blogCategories)[number];
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: common.extend({
    featured: z.boolean().default(false),
    category: z.enum(blogCategories).default('technical'),
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
