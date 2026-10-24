import { describe, expect, it } from 'vitest';
import { listLatestBlogs } from '@/data/blogRepository';
import { dummyBlogs } from '@/data/blogs';

describe('blog repository', () => {
  it('TC-110 returns the newest 10 published posts, excluding drafts', async () => {
    expect(dummyBlogs.filter((post) => post.status === 'published')).toHaveLength(12);
    expect(dummyBlogs.filter((post) => post.status === 'draft')).toHaveLength(2);

    const posts = await listLatestBlogs(10);

    expect(posts).toHaveLength(10);
    expect(posts.every((post) => post.status === 'published')).toBe(true);

    for (let index = 1; index < posts.length; index += 1) {
      expect(Date.parse(posts[index - 1].publishedAt)).toBeGreaterThanOrEqual(
        Date.parse(posts[index].publishedAt),
      );
    }
  });

  it('TC-111 returns unique ids and honours the limit', async () => {
    const posts = await listLatestBlogs();
    const ids = new Set(posts.map((post) => post.id));

    expect(posts).toHaveLength(10);
    expect(ids.size).toBe(10);
    expect(await listLatestBlogs(3)).toHaveLength(3);
    expect(await listLatestBlogs(0)).toHaveLength(0);
  });

  it('never surfaces a draft even when it is the newest document', async () => {
    const posts = await listLatestBlogs(10);
    const titles = posts.map((post) => post.title);

    expect(titles).not.toContain('Draft: Rethinking the Blog Home Page');
    expect(titles).not.toContain('Draft: What Comes After Launch');
  });
});
