import dbConnect from "../../../lib/mongodb"
import Post from "../../../models/Post"
import { generateSlug } from "../../../lib/utils"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    await dbConnect()

    const { title, content } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" })
    }

    const slug = generateSlug(title)

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug })
    if (existingPost) {
      return res.status(400).json({ message: "A post with this title already exists" })
    }

    const post = new Post({
      title,
      content,
      slug,
    })

    await post.save()

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: {
        title: post.title,
        slug: post.slug,
        createdAt: post.createdAt,
      },
    })
  } catch (error) {
    console.error("Error creating post:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
