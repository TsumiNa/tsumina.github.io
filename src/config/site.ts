import { cv } from '../data/cv';

export const site = {
  name: cv.name,
  title: `${cv.name} — Research & Engineering`,
  description:
    'Research and technical writing on machine learning, materials discovery, and scientific computing.',
  url: 'https://tsumina.github.io',
  orcid: 'https://orcid.org/0000-0002-9511-4283',
  github: 'https://github.com/TsumiNa',
  githubHandle: 'TsumiNa',
  researchmap: cv.researchmap,
  email: cv.email,
  /**
   * Google Analytics 4 measurement ID ("G-XXXXXXXXXX"). Left empty until
   * analytics is adopted; set the PUBLIC_GA_ID build variable (GitHub Actions
   * and Cloudflare Workers Builds) or replace the fallback to enable it.
   * No secret is involved — GA measurement IDs are public by design.
   */
  gaId: import.meta.env.PUBLIC_GA_ID ?? '',
} as const;

export const researchThemes = [
  {
    title: 'AI for Materials Discovery',
    description:
      'Data-driven methods for representing, predicting, and discovering complex materials.',
  },
  {
    title: 'Crystal Structure Prediction',
    description: 'Machine-learning-assisted approaches to structure discovery and evaluation.',
  },
  {
    title: 'Quasicrystals & Complex Materials',
    description:
      'Computational and data-driven study of quasicrystalline and structurally complex systems.',
  },
  {
    title: 'AI & Scientific Software',
    description:
      'Reproducible research workflows, scientific agents, and dependable machine-learning systems.',
  },
] as const;
