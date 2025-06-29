"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Layout from "../../components/Layout"
import { formatDate } from "../../lib/utils"

export default function AllPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [adminKey, setAdminKey] = useState("")
  const [authError, setAuthError] = useState("")

  useEffect(() => {
    if (isAuthorized) fetchPosts()
  }, [isAuthorized])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts")
      if (!response.ok) throw new Error("Failed to fetch posts")
      const data = await response.json()
      setPosts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    setDeletingId(slug)

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (response.ok) {
        alert("Post deleted successfully!")
        setPosts(posts.filter((post) => post.slug !== slug))
      } else {
        alert(result.message || "Failed to delete post")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setAuthError("")

    try {
      const res = await fetch("/api/verify-admin-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: adminKey }),
      })

      const data = await res.json()

      if (res.ok && data.valid) {
        setIsAuthorized(true)
      } else {
        setAuthError("Invalid secret key")
      }
    } catch {
      setAuthError("Something went wrong")
    }
  }

  return (
    <Layout title="All Posts - Blog App">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Posts</h1>
          <p className="text-gray-600">View and manage blog posts</p>
        </div>

        {!isAuthorized ? (
          <form
            onSubmit={handleAuthSubmit}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <label className="block mb-4">
              <span className="text-gray-700 font-medium">Enter Admin Secret Key</span>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
              />
            </label>
            {authError && (
              <p className="text-red-600 text-sm mb-2">{authError}</p>
            )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Verify
            </button>
          </form>
        ) : loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">Error: {error}</div>
            <button
              onClick={fetchPosts}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-gray-500 mb-4">No blog posts yet.</div>
            <Link
              href="/admin/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Link
                href="/admin/new"
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700"
              >
                Create New Post
              </Link>
            </div>
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {posts.map((post) => (
                      <tr key={post._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link href={`/posts/${post.slug}`} className="text-sm font-medium text-blue-700 hover:underline">
                            {post.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">{post.slug}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(post.createdAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Link href={`/admin/edit/${post.slug}`} className="text-blue-600 hover:text-blue-900">
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(post.slug, post.title)}
                            disabled={deletingId === post.slug}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            {deletingId === post.slug ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
