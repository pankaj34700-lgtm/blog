import { useCallback, useEffect, useState } from 'react';
import { listLatestBlogs } from '@/data/blogRepository';
import type { BlogPost } from '@/types/blog';

export type BlogLoader = () => Promise<BlogPost[]>;

export type BlogsState =
  | { status: 'loading'; posts: BlogPost[]; error: null }
  | { status: 'error'; posts: BlogPost[]; error: string }
  | { status: 'ready'; posts: BlogPost[]; error: null };

const defaultLoader: BlogLoader = () => listLatestBlogs();

export function useBlogs(loader: BlogLoader = defaultLoader) {
  const [state, setState] = useState<BlogsState>({ status: 'loading', posts: [], error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    loader()
      .then((posts) => {
        if (!cancelled) {
          setState({ status: 'ready', posts, error: null });
        }
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          const message = cause instanceof Error ? cause.message : 'Something went wrong.';
          setState({ status: 'error', posts: [], error: message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [loader, attempt]);

  const retry = useCallback(() => {
    setState({ status: 'loading', posts: [], error: null });
    setAttempt((value) => value + 1);
  }, []);

  return { ...state, retry };
}
