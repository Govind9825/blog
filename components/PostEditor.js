"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { generateSlug } from "../lib/utils"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import "react-quill/dist/quill.snow.css"

export default function PostEditor({
  initialTitle = "",
  initialContent = "",
  initialSlug = "",
  onSubmit,
  submitButtonText = "Create Post",
  isLoading = false,
}) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [slug, setSlug] = useState(initialSlug)

  useEffect(() => {
    if (title) {
      setSlug(generateSlug(title))
    }
  }, [title])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content")
      return
    }
    onSubmit({ title: title.trim(), content, slug })
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link"],
      ["clean"],
    ],
  }

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "link",
  ]

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 p-6 max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-200 dark:border-zinc-700"
    >
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
        {submitButtonText}
      </h2>

      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter post title..."
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Slug (auto-generated)
        </label>
        <input
          type="text"
          id="slug"
          value={slug}
          readOnly
          className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Content
        </label>
        <div className="rounded-md overflow-hidden border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Write your blog post content here..."
            style={{ height: "300px", border: "none" }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? "Saving..." : submitButtonText}
        </button>
      </div>
    </form>
  )
}
