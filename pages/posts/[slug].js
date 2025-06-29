"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Layout from "../../components/Layout"
import { formatDate } from "../../lib/utils"

export default function PostPage() {
  const router = useRouter()
  const { slug } = router.query
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${slug}`)
      if (!response.ok) {
        if (response.status === 404) {
          setError("Post not found")
        } else {
          throw new Error("Failed to fetch post")
        }
        return
      }
      const data = await response.json()
      setPost(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout title="Post Not Found">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error === "Post not found" ? "Post Not Found" : "Error Loading Post"}
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </Layout>
    )
  }

  if (!post) {
    return (
      <Layout title="Post Not Found">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </Layout>
    )
  }

  // Extract plain text from HTML for meta description
  const getMetaDescription = (htmlContent) => {
    const textContent = htmlContent.replace(/<[^>]*>/g, "")
    return textContent.length > 160 ? textContent.substring(0, 160) + "..." : textContent
  }

  return (
    <>
      <Head>
        <title>{post.title} - Blog App</title>
        <meta name="description" content={getMetaDescription(post.content)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={getMetaDescription(post.content)} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={getMetaDescription(post.content)} />
      </Head>

      <Layout title={`${post.title} - Blog App`}>
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
            <div className="flex items-center text-gray-600 space-x-4">
              <time dateTime={post.createdAt}>Published on {formatDate(post.createdAt)}</time>
              {post.updatedAt !== post.createdAt && <span>• Updated on {formatDate(post.updatedAt)}</span>}
            </div>
          </header>

          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <footer className="mt-12 pt-8 border-t border-gray-200">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Back to all posts
            </button>
          </footer>
        </article>
      </Layout>
    </>
  )
}
