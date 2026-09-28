import assert from 'node:assert/strict';
import test from 'node:test';
import type { BlogEntry } from './blog-series';
import { organizeBlogEntries } from './blog-series';

function entry(
  id: string,
  path?: number[],
  overrides: Partial<NonNullable<BlogEntry['data']['series']>> = {},
): BlogEntry {
  return {
    id,
    collection: 'blog',
    data: {
      title: id,
      published: new Date('2026-01-01'),
      lang: 'en',
      tags: [],
      featured: false,
      category: 'tutorial',
      ...(path
        ? {
            series: {
              key: 'example-series',
              title: 'Example series',
              order: 1,
              path,
              ...overrides,
            },
          }
        : {}),
    },
  } as BlogEntry;
}

test('keeps standalone posts and builds a sorted three-level series tree', () => {
  const organized = organizeBlogEntries([
    entry('standalone'),
    entry('section-two', [2, 1, 2]),
    entry('chapter-two', [2]),
    entry('section', [2, 1]),
    entry('section-one', [2, 1, 1]),
    entry('chapter-one', [1]),
  ]);

  assert.deepEqual(
    organized.standalone.map((item) => item.id),
    ['standalone'],
  );
  assert.deepEqual(
    organized.series[0].roots.map((node) => node.entry.id),
    ['chapter-one', 'chapter-two'],
  );
  assert.equal(organized.series[0].roots[1].children[0].entry.id, 'section');
  assert.deepEqual(
    organized.series[0].roots[1].children[0].children.map((node) => node.entry.id),
    ['section-one', 'section-two'],
  );
});

test('rejects duplicate positions', () => {
  assert.throws(
    () => organizeBlogEntries([entry('one', [1]), entry('two', [1])]),
    /duplicate path/,
  );
});

test('rejects a child without its parent', () => {
  assert.throws(() => organizeBlogEntries([entry('orphan', [1, 1])]), /missing parent path/);
});

test('rejects paths deeper than three levels', () => {
  assert.throws(() => organizeBlogEntries([entry('too-deep', [1, 1, 1, 1])]), /1–3 level path/);
});

test('rejects inconsistent metadata within one series', () => {
  assert.throws(
    () =>
      organizeBlogEntries([entry('one', [1]), entry('two', [2], { title: 'A different title' })]),
    /one title, order, and category/,
  );
});
