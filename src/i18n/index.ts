export type Locale = 'en' | 'ja' | 'zh';
export const locales: Locale[] = ['en', 'ja', 'zh'];
export const ui = {
  en: {
    home: 'Home',
    research: 'Research',
    publications: 'Publications',
    blog: 'Blog',
    notes: 'Notes',
    cv: 'CV',
    search: 'Search',
    intro: 'Researcher / AI Engineer / Scientific Computing',
    lead: 'Exploring machine learning for scientific discovery, materials informatics, complex materials, and reproducible research software.',
    focus: 'Research focus',
    writing: 'Recent writing',
    empty: 'Content will appear here when authoritative source material is available.',
    language: 'Language',
    theme: 'Theme',
  },
  ja: {
    home: 'ホーム',
    research: '研究',
    publications: '論文',
    blog: 'ブログ',
    notes: '学習ノート',
    cv: '経歴',
    search: '検索',
    intro: '研究者 / AIエンジニア / 科学計算',
    lead: '科学的発見のための機械学習、材料インフォマティクス、複雑材料、再現可能な研究ソフトウェアを探究しています。',
    focus: '研究テーマ',
    writing: '最近の文章',
    empty: '信頼できる資料が追加されると、ここに内容が表示されます。',
    language: '言語',
    theme: 'テーマ',
  },
  zh: {
    home: '首页',
    research: '研究',
    publications: '出版物',
    blog: '博客',
    notes: '学习笔记',
    cv: '履历',
    search: '搜索',
    intro: '研究人员 / AI 工程师 / 科学计算',
    lead: '探索面向科学发现的机器学习、材料信息学、复杂材料与可复现科研软件。',
    focus: '研究方向',
    writing: '近期文章',
    empty: '添加可靠来源资料后，内容将在此显示。',
    language: '语言',
    theme: '主题',
  },
} as const;
export const prefix = (lang: Locale) => (lang === 'en' ? '' : `/${lang}`);
export function localePath(lang: Locale, path = '') {
  return `${prefix(lang)}/${path}`.replace(/\/+/g, '/');
}
