export const site = {
  name: 'TsumiNa',
  title: 'TsumiNa — Research & Engineering',
  description:
    'Research and technical writing on machine learning, materials discovery, and scientific computing.',
  url: 'https://tsumina.github.io',
  orcid: 'https://orcid.org/0000-0002-9511-4283',
  github: 'https://github.com/TsumiNa',
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
