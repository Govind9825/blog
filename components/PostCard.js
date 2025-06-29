"use client";

import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import { formatDate } from "../lib/utils";

export default function PostCard({ posts }) {
  const simplifiedPosts = posts.map((post) => ({
    quote: post.title,
    name: formatDate(post.createdAt),
    slug: post.slug,
  }));

  return (
    <div className="space-y-4 py-6 bg-black w-[80vw] m-auto">
      <InfiniteMovingCards items={simplifiedPosts} direction="left" speed="fast" />
      <InfiniteMovingCards items={simplifiedPosts} direction="right" speed="fast" />
      <InfiniteMovingCards items={simplifiedPosts} direction="left" speed="fast" />
    </div>
  );
}
