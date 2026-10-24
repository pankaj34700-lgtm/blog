import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BlogCard } from '@/components/BlogCard';
import { formatPublishedDate } from '@/lib/formatDate';
import type { BlogPost } from '@/types/blog';
import { renderApp } from './testUtils';

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

describe('home page content', () => {
  it('TC-112 renders exactly 10 blog cards', async () => {
    renderApp();

    expect(await screen.findAllByRole('article')).toHaveLength(10);
  });

  it('TC-113 leads with the newest published post', async () => {
    renderApp();

    const cards = await screen.findAllByRole('article');
    expect(within(cards[0]).getByRole('heading', { level: 2 })).toHaveTextContent(
      'Why I Still Reach for Plain CSS',
    );
  });

  it('TC-114 shows title, excerpt, author, date, and tags on a card', async () => {
    renderApp();

    const [first] = await screen.findAllByRole('article');
    expect(within(first).getByRole('heading', { level: 2 })).toHaveTextContent(
      'Why I Still Reach for Plain CSS',
    );
    expect(within(first).getByText(/Modern frameworks promise speed/)).toBeInTheDocument();
    expect(within(first).getByText('Maya Chen')).toBeInTheDocument();
    expect(within(first).getByText('Oct 21, 2026')).toBeInTheDocument();
    expect(within(first).getByText('css')).toBeInTheDocument();
    expect(within(first).getByText('frontend')).toBeInTheDocument();
  });

  it('TC-115 gives cover images alt text and lazy loading', async () => {
    renderApp();

    const [first] = await screen.findAllByRole('article');
    const image = within(first).getByRole('img');
    expect(image).toHaveAttribute('alt', 'Abstract blue and violet gradient with soft circles');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('src', '/covers/cover-1.svg');
  });

  it('TC-116 formats the publish date in a stable form', () => {
    expect(formatPublishedDate('2026-10-20')).toBe('Oct 20, 2026');

    render(<BlogCard post={fixture} />);
    expect(screen.getByText('Oct 20, 2026')).toBeInTheDocument();
    expect(screen.getByText('Oct 20, 2026')).toHaveAttribute('dateTime', '2026-10-20');
  });
});

describe('accessibility structure', () => {
  it('TC-121 has one banner, one main, one h1, and h2 cards', async () => {
    const { container } = renderApp();
    await screen.findAllByRole('article');

    expect(screen.getAllByRole('banner')).toHaveLength(1);
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelectorAll('article h2')).toHaveLength(10);
  });

  it('TC-122 never skips a heading level', async () => {
    const { container } = renderApp();
    await screen.findAllByRole('article');

    const levels = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((heading) =>
      Number(heading.tagName.slice(1)),
    );

    expect(levels[0]).toBe(1);
    for (let index = 1; index < levels.length; index += 1) {
      expect(levels[index] - levels[index - 1]).toBeLessThanOrEqual(1);
    }
  });

  it('TC-120 renders without console warnings or errors', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    renderApp();
    await screen.findAllByRole('article');

    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
