import type { BlogLoader } from '@/hooks/useBlogs';
import { useBlogs } from '@/hooks/useBlogs';
import { BlogCard } from '@/components/BlogCard';

function LoadingState() {
  return (
    <div className="state">
      <p className="state__message" role="status">
        Loading posts…
      </p>
      <div className="skeleton-grid" aria-hidden="true">
        {[0, 1, 2].map((key) => (
          <div key={key} className="skeleton-card" />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="state">
      <p className="state__message">No posts yet.</p>
      <p className="state__hint">Check back soon — the first stories are on their way.</p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="state state--error">
      <p className="state__message" role="alert">
        We couldn’t load the posts: {message}
      </p>
      <button type="button" className="button button--primary" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export function HomePage({ loader }: { loader?: BlogLoader }) {
  const { status, posts, error, retry } = useBlogs(loader);

  return (
    <main className="page">
      <section className="page__intro">
        <h1>Latest stories</h1>
        <p>Fresh writing from the BlogX desk — ideas, notes, and the occasional strong opinion.</p>
      </section>

      {status === 'loading' && <LoadingState />}
      {status === 'error' && <ErrorState message={error} onRetry={retry} />}
      {status === 'ready' && posts.length === 0 && <EmptyState />}
      {status === 'ready' && posts.length > 0 && (
        <ul className="blog-grid" aria-label="Latest posts">
          {posts.map((post) => (
            <li key={post.id} className="blog-grid__item">
              <BlogCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
