import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BlogPost } from '@/types/blog';
import { renderApp } from './testUtils';

vi.mock('@/data/blogRepository', () => ({
  listLatestBlogs: vi.fn(),
}));

import { listLatestBlogs } from '@/data/blogRepository';

const mockedList = vi.mocked(listLatestBlogs);

const fixture: BlogPost = {
  id: 'fixture-1',
  title: 'A Fixture Post',
  slug: 'a-fixture-post',
  excerpt: 'A short excerpt for the fixture.',
  content: 'Fixture content.',
  authorName: 'Test Author',
  coverImageUrl: '/covers/cover-1.svg',
  coverImageAlt: 'Fixture cover alt',
  tags: ['testing'],
  publishedAt: '2026-10-20',
  status: 'published',
  readMinutes: 3,
};

describe('home page states', () => {
  beforeEach(() => {
    mockedList.mockReset();
  });

  it('TC-118 shows a loading state while the loader is pending', () => {
    mockedList.mockReturnValue(new Promise(() => {}));

    renderApp();

    expect(screen.getByRole('status')).toHaveTextContent(/loading posts/i);
    expect(screen.queryAllByRole('article')).toHaveLength(0);
  });

  it('TC-117 shows an empty state when there are no posts', async () => {
    mockedList.mockResolvedValue([]);

    renderApp();

    expect(await screen.findByText('No posts yet.')).toBeInTheDocument();
    expect(screen.queryAllByRole('article')).toHaveLength(0);
  });

  it('TC-119 shows an error, then loads posts after Retry', async () => {
    const user = userEvent.setup();
    mockedList.mockRejectedValueOnce(new Error('network down')).mockResolvedValueOnce([fixture]);

    renderApp();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/couldn’t load the posts: network down/i);

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByRole('article')).toHaveTextContent('A Fixture Post');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
