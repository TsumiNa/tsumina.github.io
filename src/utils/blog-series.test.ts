import assert from 'node:assert/strict';
import test from 'node:test';
import type { BlogDirectoryConfigResolver, BlogEntry } from './blog-series';
import {
  getBlogDirectories,
  getBlogSeriesNavigation,
  organizeBlogEntries,
  parseBlogDirectoryConfig,
} from './blog-series';

const resolveConfig: BlogDirectoryConfigResolver = (segments) => ({
  title: { en: segments.at(-1)!.replace(/^\d+-/, '').replaceAll('-', ' ') },
  show: true,
});

test('parses localized titles, visibility, and cover from config.toml', () => {
  assert.deepEqual(
    parseBlogDirectoryConfig(
      'show = false\ncover = "/cover.svg"\n[title]\nen = "Readable"\nzh = "可读标题"\n',
    ),
    {
      title: { en: 'Readable', zh: '可读标题' },
      show: false,
      cover: '/cover.svg',
    },
  );
  assert.throws(() => parseBlogDirectoryConfig('show = true\n'), /\[title\] is required/);
  assert.throws(
    () => parseBlogDirectoryConfig('show = "no"\n[title]\nen = "Title"\n'),
    /show must be a boolean/,
  );
});

function entry(id: string, overrides: Partial<BlogEntry['data']> = {}): BlogEntry {
  return {
    id,
    collection: 'blog',
    data: {
      title: id,
      published: new Date('2026-01-01'),
      lang: 'en',
      tags: [],
      show: true,
      featured: false,
      category: 'tutorial',
      ...overrides,
    },
  } as BlogEntry;
}

test('keeps root posts standalone and builds series, chapters, and articles from folders', () => {
  const organized = organizeBlogEntries(
    [
      entry('standalone'),
      entry('01-example/01-prologue'),
      entry('01-example/10-second/02-later'),
      entry('01-example/02-first/02-section-two'),
      entry('01-example/02-first/01-section-one'),
    ],
    resolveConfig,
  );

  assert.deepEqual(
    organized.standalone.map((item) => item.id),
    ['standalone'],
  );
  assert.equal(organized.series[0].title, 'example');
  assert.deepEqual(
    organized.series[0].articles.map(({ entry }) => entry.id),
    ['01-example/01-prologue'],
  );
  assert.deepEqual(
    organized.series[0].chapters.map((chapter) => chapter.key),
    ['02-first', '10-second'],
  );
  assert.deepEqual(
    organized.series[0].chapters[0].articles.map(({ entry }) => entry.id),
    ['01-example/02-first/01-section-one', '01-example/02-first/02-section-two'],
  );
});

test('omits entries hidden by article or inherited directory config', () => {
  const hiddenChapterResolver: BlogDirectoryConfigResolver = (segments) => ({
    title: { en: segments.at(-1)! },
    show: segments.at(-1) !== 'hidden-chapter',
  });
  const organized = organizeBlogEntries(
    [
      entry('visible'),
      entry('hidden', { show: false }),
      entry('series/chapter/01-visible'),
      entry('series/chapter/02-hidden', { show: false }),
      entry('series/hidden-chapter/01-inherited-hidden'),
    ],
    hiddenChapterResolver,
  );

  assert.deepEqual(
    organized.standalone.map((item) => item.id),
    ['visible'],
  );
  assert.deepEqual(
    organized.series[0].chapters[0].articles.map(({ entry }) => entry.id),
    ['series/chapter/01-visible'],
  );
});

test('generates series and chapter directory descriptors', () => {
  const directories = getBlogDirectories(
    [
      entry('series/01-prologue'),
      entry('series/01-basics/01-introduction'),
      entry('series/02-delivery/01-build'),
    ],
    resolveConfig,
  );

  assert.deepEqual(
    directories.map((directory) =>
      directory.kind === 'series'
        ? directory.series.key
        : `${directory.series.key}/${directory.chapter.key}`,
    ),
    ['series', 'series/01-basics', 'series/02-delivery'],
  );
});

test('rejects authored index files because Astro generates directory indexes', () => {
  assert.throws(
    () => organizeBlogEntries([entry('example/index-zh')], resolveConfig),
    /reserved index filename/,
  );
});

test('rejects paths deeper than series, chapter, and article', () => {
  assert.throws(
    () => organizeBlogEntries([entry('example/chapter/group/article')], resolveConfig),
    /exceeds the supported/,
  );
});

test('rejects categories mixed within one series folder', () => {
  assert.throws(
    () =>
      organizeBlogEntries(
        [entry('example/one'), entry('example/chapter/two', { category: 'learning' })],
        resolveConfig,
      ),
    /one category/,
  );
});

test('rejects a direct article whose route collides with a chapter index', () => {
  assert.throws(
    () =>
      organizeBlogEntries(
        [entry('example/01-basics'), entry('example/01-basics/01-introduction')],
        resolveConfig,
      ),
    /competing for route/,
  );
});

test('returns chapter context and previous/next entries in reading order', () => {
  const entries = [
    entry('example/01-prologue'),
    entry('example/01-basics/01-first'),
    entry('example/01-basics/02-second'),
    entry('example/02-delivery/01-build'),
  ];
  const navigation = getBlogSeriesNavigation(entries, 'example/01-basics/02-second', resolveConfig);

  assert.equal(navigation?.group.title, 'example');
  assert.equal(navigation?.chapter?.title, 'basics');
  assert.equal(navigation?.previous?.id, 'example/01-basics/01-first');
  assert.equal(navigation?.next?.id, 'example/02-delivery/01-build');
});
