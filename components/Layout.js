"use client"

import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"

export default function Layout({ children, title = "Blog App" }) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path) => router.pathname === path

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
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  BlogApp
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-6">
                  <NavLink href="/" label="Home" active={isActive("/")} />
                  <NavLink href="/admin/new" label="Create Post" active={isActive("/admin/new")} />
                  <NavLink href="/admin/posts" label="All Posts" active={isActive("/admin/posts")} />
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Dropdown */}
            {isMobileMenuOpen && (
              <div className="md:hidden mt-2 space-y-1 pb-4">
                <MobileNavLink href="/" label="Home" active={isActive("/")} />
                <MobileNavLink href="/admin/new" label="Create Post" active={isActive("/admin/new")} />
                <MobileNavLink href="/admin/posts" label="All Posts" active={isActive("/admin/posts")} />
              </div>
            )}
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </>
  )
}

function NavLink({ href, label, active }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
      }`}
    >
      {label}
    </Link>
  )
}

function MobileNavLink({ href, label, active }) {
  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-md text-base font-medium transition-colors ${
        active ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
      }`}
    >
      {label}
    </Link>
  )
}
