'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { BlogCard } from '@/components/ui/blog-cards';

interface PostSummary {
  slug: string;
  title: string;
  date: string;
  description: string;
}

interface InfiniteBlogListProps {
  posts: PostSummary[];
  batchSize?: number;
}

export function InfiniteBlogList({ posts, batchSize = 5 }: InfiniteBlogListProps) {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + batchSize, posts.length));
  }, [batchSize, posts.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  return (
    <>
      <div className="flex flex-col space-y-6 md:space-y-8">
        {visiblePosts.map((post) => (
          <BlogCard
            key={post.slug}
            title={post.title}
            date={post.date}
            description={post.description}
            href={`/blog/${post.slug}/`}
          />
        ))}
      </div>
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </>
  );
}
