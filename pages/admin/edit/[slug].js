"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Layout from "../../../components/Layout"
import PostEditor from "../../../components/PostEditor"

export default function EditPost() {
  const router = useRouter()
  const { slug } = router.query
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const handleSubmit = async (postData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      const result = await response.json()

      if (response.ok) {
        alert("Post updated successfully!")
        // If slug changed, redirect to new URL
        if (result.post.slug !== slug) {
          router.push(`/posts/${result.post.slug}`)
        } else {
          router.push(`/posts/${slug}`)
        }
      } else {
        alert(result.message || "Failed to update post")
      }
    } catch (error) {
      console.error("Error updating post:", error)
      alert("Failed to update post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout title="Edit Post - Blog App">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  if (error || !post) {
    return (
      <Layout title="Edit Post - Blog App">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || "Post not found"}</h1>
          <button
            onClick={() => router.push("/admin/posts")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to All Posts
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title={`Edit: ${post.title} - Blog App`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Post</h1>
          <p className="text-gray-600">Make changes to your blog post.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <PostEditor
            initialTitle={post.title}
            initialContent={post.content}
            initialSlug={post.slug}
            onSubmit={handleSubmit}
            submitButtonText="Update Post"
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </Layout>
  )
}
