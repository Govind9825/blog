"use client"

import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"

export default function Layout({ children, title = "Blog App" }) {
  const router = useRouter()

  const isActive = (path) => {
    return router.pathname === path
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="A full-stack blog application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  BlogApp
                </Link>

                <div className="hidden md:flex space-x-6">
                  <Link
                    href="/"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/admin/new"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/admin/new")
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    Create Post
                  </Link>
                  <Link
                    href="/admin/posts"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/admin/posts")
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    All Posts
                  </Link>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button className="text-gray-700 hover:text-blue-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </>
  )
}
