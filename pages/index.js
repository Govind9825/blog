"use client"

import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import PostCard from "../components/PostCard"

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts")
      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }
      const data = await response.json()
      console.log("data : ",data)
      setPosts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  console.log("Updated posts:", posts)
}, [posts])

  if (loading) {
    return (
      <Layout title="Home - Blog App">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout title="Home - Blog App">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">Error: {error}</div>
          <button
            onClick={fetchPosts}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Home - Blog App">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Our Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing stories, insights, and ideas from our community of writers.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No blog posts yet.</div>
            <p className="text-gray-400">Be the first to create a post!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <PostCard posts={posts} />
          </div>
        )}
      </div>
    </Layout>
  )
}
