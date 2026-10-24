import { dummyBlogs } from '@/data/blogs';
import type { BlogPost } from '@/types/blog';

export const DEFAULT_BLOG_LIMIT = 10;

/**
 * The single read seam for blog content.
 *
 * Dummy-backed today; swapping in Firestore means replacing this body with
 * `getDocs(query(collection(db, 'blogs'), where('status', '==', 'published'),
 * orderBy('publishedAt', 'desc'), limit(limit)))` and mapping Timestamps.
 * Components must not depend on the dummy module itself.
 */
export async function listLatestBlogs(limit: number = DEFAULT_BLOG_LIMIT): Promise<BlogPost[]> {
  const published = dummyBlogs
    .filter((post) => post.status === 'published')
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

  return published.slice(0, Math.max(0, limit));
}
