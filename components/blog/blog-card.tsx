'use client';

import Link from 'next/link';
import { BlogPost } from '@/lib/wordpress';

export function BlogCard({ post }: { post: BlogPost }) {
  const image = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  const text =
    post?.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '';

  return (
    <div className="bg-white border border-[#e5e2dc] rounded-2xl p-5 hover:shadow-md transition overflow-hidden">

      {image && (
        <img
          src={image}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-5">

        <p className="text-xs text-[#6e6a63] mb-2">
          {new Date(post.date).toDateString()}
        </p>

        <h3 className="font-semibold text-lg mb-2">
          {post.title.rendered}
        </h3>

        <p className="text-sm text-[#6e6a63] mb-4">
          {text.slice(0, 120)}...
        </p>

        <Link
          href={`/blogs/${post.slug}`}
          className="text-[#01696f] text-sm hover:underline"
        >
          Read article →
        </Link>

      </div>
    </div>
  );
}