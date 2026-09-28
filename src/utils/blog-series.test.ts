import assert from 'node:assert/strict';
import test from 'node:test';
import type { BlogEntry } from './blog-series';
import { blogSlug, getBlogSeriesNavigation, organizeBlogEntries } from './blog-series';

test('maps an index entry to its directory URL', () => {
  assert.equal(blogSlug('example/index'), 'example');
  assert.equal(blogSlug('example/chapter/index-zh'), 'example/chapter');
  assert.equal(blogSlug('standalone'), 'standalone');
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

test('keeps root posts standalone and builds a folder-based three-level series', () => {
  const organized = organizeBlogEntries([
    entry('standalone'),
    entry('01-example/index-en', { title: 'Example series' }),
    entry('01-example/10-second'),
    entry('01-example/02-first/02-section-two'),
    entry('01-example/02-first'),
    entry('01-example/02-first/01-section-one'),
  ]);

  assert.deepEqual(
    organized.standalone.map((item) => item.id),
    ['standalone'],
  );
  assert.equal(organized.series[0].title, 'Example series');
  assert.equal(organized.series[0].overview?.id, '01-example/index-en');
  assert.deepEqual(
    organized.series[0].roots.map((node) => node.entry.id),
    ['01-example/02-first', '01-example/10-second'],
  );
  assert.deepEqual(
    organized.series[0].roots[0].children.map((node) => node.entry.id),
    ['01-example/02-first/01-section-one', '01-example/02-first/02-section-two'],
  );
  assert.deepEqual(organized.series[0].roots[0].children[1].position, [1, 2]);
});

test('uses a readable folder name when a series has no overview', () => {
  const organized = organizeBlogEntries([entry('01-ai-coding-for-non-cs/01-introduction')]);
  assert.equal(organized.series[0].title, 'AI Coding for Non-CS');
});

test('omits entries with show false while keeping the collection entry valid', () => {
  const organized = organizeBlogEntries([
    entry('visible'),
    entry('hidden', { show: false }),
    entry('series/01-visible'),
    entry('series/02-hidden', { show: false }),
  ]);

  assert.deepEqual(
    organized.standalone.map((item) => item.id),
    ['visible'],
  );
  assert.deepEqual(
    organized.series[0].roots.map((node) => node.entry.id),
    ['series/01-visible'],
  );
});

test('rejects duplicate normalized folder positions', () => {
  assert.throws(
    () => organizeBlogEntries([entry('example/chapter'), entry('example/chapter/index-en')]),
    /duplicate article path/,
  );
});

test('rejects a section without its chapter article', () => {
  assert.throws(() => organizeBlogEntries([entry('example/chapter/section')]), /missing chapter/);
});

test('rejects paths deeper than overview, chapter, and section', () => {
  assert.throws(
    () => organizeBlogEntries([entry('example/chapter/section/detail')]),
    /exceeds the three article levels/,
  );
});

test('rejects categories mixed within one series folder', () => {
  assert.throws(
    () =>
      organizeBlogEntries([entry('example/one'), entry('example/two', { category: 'learning' })]),
    /one category/,
  );
});

test('returns previous and next entries in reading order', () => {
  const entries = [
    entry('example/index-en', { title: 'Example series' }),
    entry('example/01-first'),
    entry('example/01-first/01-section'),
    entry('example/02-second'),
  ];
  const navigation = getBlogSeriesNavigation(entries, 'example/01-first/01-section');

  assert.equal(navigation?.title, 'Example series');
  assert.equal(navigation?.position, '1.1');
  assert.equal(navigation?.previous?.id, 'example/01-first');
  assert.equal(navigation?.next?.id, 'example/02-second');
});
