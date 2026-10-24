import { formatPublishedDate } from '@/lib/formatDate';
import type { BlogPost } from '@/types/blog';

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="blog-card">
      <div className="blog-card__media">
        <img
          src={post.coverImageUrl}
          alt={post.coverImageAlt}
          loading="lazy"
          width={800}
          height={450}
        />
      </div>
      <div className="blog-card__body">
        <ul className="tag-list" aria-label="Tags">
          {post.tags.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>
        <h2 className="blog-card__title">{post.title}</h2>
        <p className="blog-card__excerpt">{post.excerpt}</p>
        <p className="blog-card__meta">
          <span className="blog-card__author">{post.authorName}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.publishedAt}>{formatPublishedDate(post.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readMinutes} min read</span>
        </p>
      </div>
    </article>
  );
}
