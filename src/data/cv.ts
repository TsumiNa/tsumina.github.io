/** Career facts transcribed from ChangLiu-CV-202609.pdf, with the owner's correction.
 * See docs/cv-source.md before changing dates or importing publication metadata.
 */
export interface CVEntry {
  title: string;
  organization: string;
  start?: string;
  end?: string;
  current?: boolean;
}
export const cv = {
  name: 'Chang Liu',
  degree: 'Ph.D. in Engineering',
  email: 'liu.chang@ism.ac.jp',
  researchmap: 'https://researchmap.jp/liu.chang',
  source: 'ChangLiu-CV-202609.pdf',
  appointments: [
    {
      title: 'Project associate professor',
      organization: 'The Institute of Statistical Mathematics (ISM), Japan',
      start: '2025-04',
      current: true,
    },
    {
      title: 'Visiting Scientist',
      organization: 'RIKEN TRIP-AGIS, Japan',
      start: '2025-04',
      current: true,
    },
  ] satisfies CVEntry[],
  experience: [
    {
      title: 'Project assistant professor',
      organization: 'The Institute of Statistical Mathematics (ISM), Japan',
      start: '2018-08',
      end: '2025-03',
    },
    {
      title: 'Postdoctoral researcher',
      organization: 'National Institute for Materials Science (NIMS), Japan',
      start: '2017-09',
      end: '2019-03',
    },
    {
      title: 'Assistant researcher',
      organization: 'Shizuoka University, Japan',
      start: '2017-04',
      end: '2017-08',
    },
    {
      title: 'High-school teacher',
      organization: 'Zhengzhou 101 School, China',
      start: '2007-09',
      end: '2009-09',
    },
  ] satisfies CVEntry[],
  education: [
    // The source groups both graduate degrees within 2012-04–2017-03.
    // Do not infer a separate doctoral start or award date from that range.
    { title: 'Ph.D. in Engineering', organization: 'Shizuoka University, Japan' },
    {
      title: 'Master of Engineering',
      organization: 'Shizuoka University, Japan',
      start: '2012-04',
      end: '2014-03',
    },
    {
      title: 'Research student',
      organization: 'Shizuoka University, Japan',
      start: '2011-04',
      end: '2012-03',
    },
    {
      title: 'Japanese education',
      organization: 'Subaru Japanese Education School, Japan',
      start: '2009-10',
      end: '2011-03',
    },
    {
      title: 'Bachelor of Science in Physics',
      organization: 'Zhengzhou University, China',
      start: '2003-09',
      end: '2007-08',
    },
  ] satisfies CVEntry[],
  thesis:
    '第一原理計算による希薄合金の研究：点欠陥による格子歪エネルギーと合金の内部エネルギーの実空間クラスター展開',
  projects: [
    {
      name: 'FAAA',
      description: 'Python framework for building AI agents with large language models.',
      start: '2024-09',
      current: true,
      url: 'https://github.com/TsumiNa/faaa',
    },
    {
      name: 'ShotgunCSP',
      description:
        'Non-iterative, single-shot screening framework for crystal structure prediction.',
      start: '2024-09',
      current: true,
      url: 'https://github.com/TsumiNa/ShotgunCSP',
    },
    {
      name: 'Avalon',
      description:
        'High-throughput task manager for computational science, long-running tasks, and API access.',
      start: '2021-09',
      end: '2022',
      url: 'https://github.com/yoshida-lab/avalon',
    },
    {
      name: 'Crystallus',
      description: 'Universal crystal structure generator written in Rust and Python.',
      start: '2021-09',
      current: true,
      private: true,
    },
    {
      name: 'XenonPy',
      description: 'Python machine-learning tools for materials informatics.',
      start: '2017-10',
      current: true,
      url: 'https://xenonpy.readthedocs.io/en/latest/',
    },
    {
      name: 'CVM',
      description:
        'Toolset applying the cluster variation method to solvus temperature calculations.',
      start: '2016-11',
      end: '2018',
      url: 'https://github.com/TsumiNa/CVM',
    },
  ],
  teaching: [
    {
      title: 'Research assistant: amorphous materials using VASP calculations',
      organization: '',
      start: '2016-10',
      end: '2017-08',
    },
    {
      title:
        'Big-data analysis and parallel calculation; maintenance and parallelization of ab-initio codes',
      organization: '',
      start: '2013-05',
      current: true,
    },
    {
      title: 'Undergraduate supervision and mentorship; physics laboratory courses',
      organization: '',
      start: '2012-09',
      end: '2014-12',
    },
  ] satisfies CVEntry[],
  memberships: [
    {
      title: 'The Japan Institute of Metals and Materials',
      organization: '',
      start: '2012-09',
      current: true,
    },
    { title: 'Materials Research Society', organization: '', start: '2018-11', current: true },
    {
      title: 'The Materials Research Society of Japan',
      organization: '',
      start: '2023-06',
      current: true,
    },
  ] satisfies CVEntry[],
  talks: [
    {
      title: 'AI Scientist-Driven Materials R&D: Current Status and Outlook',
      venue: 'The 4th International Forum on AI+ Metallurgy & Materials',
      location: 'Shenyang, China',
      year: 2025,
    },
    {
      title: 'Accelerating quasicrystal discovery with machine learning',
      venue: 'The 16th International Conference on Quasicrystals (ICQ16)',
      location: 'Nancy, France',
      year: 2025,
    },
  ],
  programming: ['C/C++', 'Rust', 'Python', 'JavaScript', 'Fortran', 'Haskell'],
  databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Cassandra'],
  languages: ['Japanese', 'English', 'Chinese (Mandarin)'],
} as const;
