export type BlogPostStatus = 'published' | 'draft';

/**
 * Client-side shape of a blog post. Mirrors the planned `blogs/{postId}`
 * Firestore document, with `publishedAt` kept as an ISO date until the
 * Firestore Timestamp conversion lands.
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorName: string;
  coverImageUrl: string;
  coverImageAlt: string;
  tags: string[];
  publishedAt: string;
  status: BlogPostStatus;
  readMinutes: number;
}
