"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import PostEditor from "../../components/PostEditor"

export default function NewPost() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [adminKey, setAdminKey] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [authError, setAuthError] = useState("")

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setAuthError("")

    try {
      const res = await fetch("/api/verify-admin-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: adminKey }),
      })

      const data = await res.json()

      if (res.ok && data.valid) {
        setIsAuthorized(true)
      } else {
        setAuthError("Invalid secret key")
      }
    } catch (err) {
      setAuthError("Something went wrong",err)
    }
  }

  const handleSubmit = async (postData) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      const result = await response.json()

      if (response.ok) {
        alert("Post created successfully!")
        router.push(`/posts/${result.post.slug}`)
      } else {
        alert(result.message || "Failed to create post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
      alert("Failed to create post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout title="Create New Post - Blog App">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
          <p className="text-gray-600">Write and publish a new blog post.</p>
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
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <PostEditor
              onSubmit={handleSubmit}
              submitButtonText="Create Post"
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </Layout>
  )
}
