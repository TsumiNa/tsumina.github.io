import type { Locale } from './index';

export const cvUI = {
  en: {
    intro: 'Materials informatics · Scientific AI',
    lead: 'Chang Liu is a Project Associate Professor at the Institute of Statistical Mathematics and a Visiting Scientist at RIKEN TRIP-AGIS. His research connects machine learning, materials discovery, crystal structure prediction, quasicrystals, and scientific AI systems.',
    profile: 'Profile',
    appointments: 'Current appointments',
    experience: 'Experience',
    education: 'Education',
    projects: 'Research software',
    teaching: 'Teaching and mentorship',
    memberships: 'Professional memberships',
    talks: 'Selected invited talks',
    skills: 'Programming and databases',
    languages: 'Languages',
    thesis: 'Doctoral thesis',
    present: 'Present',
    private: 'Private repository',
    source:
      'Based on the September 2026 CV, with the master’s dates corrected by the author. Official position and degree titles are retained in English.',
    educationNote:
      'The source CV lists master’s and doctoral study together as April 2012–March 2017. The master’s period is confirmed as April 2012–March 2014; separate doctoral dates are not specified.',
  },
  ja: {
    intro: '材料インフォマティクス · 科学のためのAI',
    lead: 'Chang Liu は統計数理研究所の Project Associate Professor、理化学研究所 TRIP-AGIS の Visiting Scientist です。機械学習、材料探索、結晶構造予測、準結晶、科学研究のためのAIシステムに取り組んでいます。',
    profile: 'プロフィール',
    appointments: '現在の職務',
    experience: '職歴',
    education: '学歴',
    projects: '研究ソフトウェア',
    teaching: '教育・研究指導',
    memberships: '所属学会',
    talks: '主な招待講演',
    skills: 'プログラミング・データベース',
    languages: '言語',
    thesis: '博士論文',
    present: '現在',
    private: '非公開リポジトリ',
    source:
      '2026年9月版CVに基づき、修士課程の期間は本人の訂正を反映しています。職名と学位名は原文の英語表記を使用しています。',
    educationNote:
      '原資料では修士・博士課程を2012年4月〜2017年3月とまとめて記載しています。修士課程は2012年4月〜2014年3月と確認済みです。博士課程の個別の期間は記載されていません。',
  },
  zh: {
    intro: '材料信息学 · 科学人工智能',
    lead: 'Chang Liu 现任统计数理研究所 Project Associate Professor，并兼任理化学研究所 RIKEN TRIP-AGIS Visiting Scientist。研究涵盖机器学习、材料发现、晶体结构预测、准晶与科学人工智能系统。',
    profile: '个人简介',
    appointments: '现任职务',
    experience: '工作经历',
    education: '教育经历',
    projects: '科研软件',
    teaching: '教学与指导',
    memberships: '学术团体',
    talks: '精选邀请报告',
    skills: '编程与数据库',
    languages: '语言',
    thesis: '博士论文',
    present: '至今',
    private: '私有仓库',
    source: '依据2026年9月版CV整理，硕士就读时间已按本人更正更新。职务和学位名称保留原文英文表述。',
    educationNote:
      '原CV将硕士与博士就读时间合并列为2012年4月—2017年3月。硕士时间已确认为2012年4月—2014年3月；博士的独立起止时间未注明。',
  },
} satisfies Record<Locale, Record<string, string>>;

export function cvPeriod(entry: { start?: string; end?: string; current?: boolean }, lang: Locale) {
  const date = (value: string) => {
    if (value.length === 4) return value;
    return new Intl.DateTimeFormat(lang, {
      year: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    }).format(new Date(`${value}-01T00:00:00Z`));
  };
  if (!entry.start) return '';
  return `${date(entry.start)} – ${entry.current ? cvUI[lang].present : entry.end ? date(entry.end) : ''}`;
}
