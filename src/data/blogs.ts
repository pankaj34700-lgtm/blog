import type { BlogPost } from '@/types/blog';

/**
 * Local dummy content shaped like the future `blogs` collection.
 * Only `src/data` may import this module; everything else goes through
 * `listLatestBlogs`. The two drafts exist to prove the published filter works.
 */
export const dummyBlogs: BlogPost[] = [
  {
    id: 'post-001',
    title: 'Why I Still Reach for Plain CSS',
    slug: 'why-i-still-reach-for-plain-css',
    excerpt:
      'Modern frameworks promise speed, yet a well-organized stylesheet with custom properties keeps paying off long after the novelty fades.',
    content:
      'Plain CSS is not a nostalgia project. Custom properties, logical properties, and container queries cover most of what a blog needs, with zero runtime cost and no build complexity.',
    authorName: 'Maya Chen',
    coverImageUrl: '/covers/cover-1.svg',
    coverImageAlt: 'Abstract blue and violet gradient with soft circles',
    tags: ['css', 'frontend'],
    publishedAt: '2026-10-21',
    status: 'published',
    readMinutes: 6,
  },
  {
    id: 'post-002',
    title: 'Firestore Data Modeling Without a Backend',
    slug: 'firestore-data-modeling-without-a-backend',
    excerpt:
      'When the client owns the reads and rules own the writes, the data model becomes the architecture. Here is how to keep it honest.',
    content:
      'Denormalize for the query you actually run, keep security rules small and testable, and treat indexes as part of the feature rather than an afterthought.',
    authorName: 'Arjun Patel',
    coverImageUrl: '/covers/cover-2.svg',
    coverImageAlt: 'Abstract amber and orange gradient with diagonal shapes',
    tags: ['firebase', 'firestore'],
    publishedAt: '2026-10-18',
    status: 'published',
    readMinutes: 9,
  },
  {
    id: 'post-003',
    title: 'The Ten-Minute Code Review',
    slug: 'the-ten-minute-code-review',
    excerpt:
      'A review that takes an hour is usually two reviews in disguise. Splitting intent from style makes both faster and kinder.',
    content:
      'Read the diff once for intent, once for correctness, and leave style to the formatter. If a change cannot be reviewed in ten minutes, it is too large to review well.',
    authorName: 'Lena Ortiz',
    coverImageUrl: '/covers/cover-3.svg',
    coverImageAlt: 'Abstract teal and green gradient with layered arcs',
    tags: ['engineering', 'teams'],
    publishedAt: '2026-10-14',
    status: 'published',
    readMinutes: 4,
  },
  {
    id: 'post-004',
    title: 'React State Is Not the Enemy',
    slug: 'react-state-is-not-the-enemy',
    excerpt:
      'Most state bugs are not caused by too much state. They come from state that has more than one owner.',
    content:
      'Derive what you can, colocate what you must, and lift state only when two distant branches genuinely need the same value.',
    authorName: 'Maya Chen',
    coverImageUrl: '/covers/cover-4.svg',
    coverImageAlt: 'Abstract rose and pink gradient with concentric rings',
    tags: ['react', 'frontend'],
    publishedAt: '2026-10-09',
    status: 'published',
    readMinutes: 7,
  },
  {
    id: 'post-005',
    title: 'Shipping Less, Learning More',
    slug: 'shipping-less-learning-more',
    excerpt:
      'A release does not have to be large to be useful. The smallest version that answers a question is often the best one.',
    content:
      'Cut the feature until it answers exactly one question, ship it, and let the answer decide the next cut. Momentum comes from learning, not from volume.',
    authorName: 'Theo Nakamura',
    coverImageUrl: '/covers/cover-5.svg',
    coverImageAlt: 'Abstract indigo gradient with a grid of small squares',
    tags: ['product', 'craft'],
    publishedAt: '2026-10-03',
    status: 'published',
    readMinutes: 5,
  },
  {
    id: 'post-006',
    title: 'A Practical Guide to Storage Rules',
    slug: 'a-practical-guide-to-storage-rules',
    excerpt:
      'Uploads are the easiest way to leak data. A handful of path rules and content-type checks close the obvious doors.',
    content:
      'Scope writes to the authenticated owner, cap size and type at the rule layer, and never trust a filename. Test the denies, not just the allows.',
    authorName: 'Arjun Patel',
    coverImageUrl: '/covers/cover-6.svg',
    coverImageAlt: 'Abstract cyan gradient with stacked translucent panels',
    tags: ['firebase', 'security'],
    publishedAt: '2026-09-27',
    status: 'published',
    readMinutes: 8,
  },
  {
    id: 'post-007',
    title: 'Designing Empty States People Trust',
    slug: 'designing-empty-states-people-trust',
    excerpt:
      'An empty state is a promise about what the screen will do next. Vague copy reads as a bug.',
    content:
      'Say what is missing, why it is missing, and exactly what the reader can do about it. A dead end is not a design.',
    authorName: 'Lena Ortiz',
    coverImageUrl: '/covers/cover-7.svg',
    coverImageAlt: 'Abstract sand and cream gradient with a single circle',
    tags: ['design', 'ux'],
    publishedAt: '2026-09-21',
    status: 'published',
    readMinutes: 4,
  },
  {
    id: 'post-008',
    title: 'Tests That Earn Their Keep',
    slug: 'tests-that-earn-their-keep',
    excerpt:
      'Coverage is a number, confidence is a feeling, and neither is a strategy. Test the seams where mistakes are expensive.',
    content:
      'Test behavior at the boundary, keep fixtures small, and delete the tests that only restate the implementation.',
    authorName: 'Theo Nakamura',
    coverImageUrl: '/covers/cover-8.svg',
    coverImageAlt: 'Abstract violet gradient with crossing thin lines',
    tags: ['testing', 'craft'],
    publishedAt: '2026-09-15',
    status: 'published',
    readMinutes: 6,
  },
  {
    id: 'post-009',
    title: 'Reading Code Is a Skill',
    slug: 'reading-code-is-a-skill',
    excerpt:
      'We spend far more time reading than writing, yet practice almost none of it deliberately.',
    content:
      'Start at the edges: entry points, tests, and configuration. Follow one request end to end before forming an opinion about the design.',
    authorName: 'Maya Chen',
    coverImageUrl: '/covers/cover-9.svg',
    coverImageAlt: 'Abstract slate gradient with an open book shape',
    tags: ['career', 'engineering'],
    publishedAt: '2026-09-08',
    status: 'published',
    readMinutes: 5,
  },
  {
    id: 'post-010',
    title: 'The Quiet Cost of Clever Abstractions',
    slug: 'the-quiet-cost-of-clever-abstractions',
    excerpt:
      'Every abstraction buys flexibility with indirection. The bill arrives later, usually from someone new to the codebase.',
    content:
      'Prefer three similar lines to a premature framework. Abstract after the second real use case, not the first imagined one.',
    authorName: 'Arjun Patel',
    coverImageUrl: '/covers/cover-10.svg',
    coverImageAlt: 'Abstract moss gradient with overlapping rectangles',
    tags: ['architecture', 'craft'],
    publishedAt: '2026-09-02',
    status: 'published',
    readMinutes: 7,
  },
  {
    id: 'post-011',
    title: 'Notes on Keyboard Accessibility',
    slug: 'notes-on-keyboard-accessibility',
    excerpt:
      'Focus order, visible rings, and sensible landmarks cover more ground than most teams expect.',
    content:
      'Keyboard access is not an edge case. Test with Tab alone, make focus visible, and keep the tab order aligned with reading order.',
    authorName: 'Lena Ortiz',
    coverImageUrl: '/covers/cover-1.svg',
    coverImageAlt: 'Abstract blue and violet gradient with soft circles',
    tags: ['a11y', 'frontend'],
    publishedAt: '2026-08-26',
    status: 'published',
    readMinutes: 6,
  },
  {
    id: 'post-012',
    title: 'Small Deploys, Calm Fridays',
    slug: 'small-deploys-calm-fridays',
    excerpt:
      'Deployment anxiety is usually a size problem. Smaller releases make failures boring and recovery quick.',
    content:
      'Ship one change at a time, keep rollback one command away, and let the boring deploy become the default.',
    authorName: 'Theo Nakamura',
    coverImageUrl: '/covers/cover-2.svg',
    coverImageAlt: 'Abstract amber and orange gradient with diagonal shapes',
    tags: ['devops', 'teams'],
    publishedAt: '2026-08-19',
    status: 'published',
    readMinutes: 4,
  },
  {
    id: 'post-013',
    title: 'Draft: Rethinking the Blog Home Page',
    slug: 'rethinking-the-blog-home-page',
    excerpt: 'An unpublished note on card density, scanning behavior, and why ten posts may be the right number.',
    content: 'Work in progress. Not ready to publish.',
    authorName: 'Maya Chen',
    coverImageUrl: '/covers/cover-3.svg',
    coverImageAlt: 'Abstract teal and green gradient with layered arcs',
    tags: ['design'],
    publishedAt: '2026-10-23',
    status: 'draft',
    readMinutes: 3,
  },
  {
    id: 'post-014',
    title: 'Draft: What Comes After Launch',
    slug: 'what-comes-after-launch',
    excerpt: 'A draft about the first quiet week after a release, and the small fixes that matter most.',
    content: 'Work in progress. Not ready to publish.',
    authorName: 'Theo Nakamura',
    coverImageUrl: '/covers/cover-4.svg',
    coverImageAlt: 'Abstract rose and pink gradient with concentric rings',
    tags: ['product'],
    publishedAt: '2026-10-22',
    status: 'draft',
    readMinutes: 2,
  },
];
