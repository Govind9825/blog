import dbConnect from "../../../lib/mongodb"
import Post from "../../../models/Post"
import { generateSlug } from "../../../lib/utils"

export default async function handler(req, res) {
  const { slug } = req.query

  try {
    await dbConnect()

    if (req.method === "GET") {
      const post = await Post.findOne({ slug })

      if (!post) {
        return res.status(404).json({ message: "Post not found" })
      }

      res.status(200).json(post)
    } else if (req.method === "PUT") {
      const { title, content } = req.body

      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" })
      }

      const newSlug = generateSlug(title)

      // Check if new slug conflicts with existing posts (excluding current post)
      if (newSlug !== slug) {
        const existingPost = await Post.findOne({ slug: newSlug })
        if (existingPost) {
          return res.status(400).json({ message: "A post with this title already exists" })
        }
      }

      const updatedPost = await Post.findOneAndUpdate({ slug }, { title, content, slug: newSlug }, { new: true })

      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" })
      }

      res.status(200).json({
        success: true,
        message: "Post updated successfully",
        post: updatedPost,
      })
    } else if (req.method === "DELETE") {
      const deletedPost = await Post.findOneAndDelete({ slug })

      if (!deletedPost) {
        return res.status(404).json({ message: "Post not found" })
      }

      res.status(200).json({
        success: true,
        message: "Post deleted successfully",
      })
    } else {
      res.status(405).json({ message: "Method not allowed" })
    }
  } catch (error) {
    console.error("Error handling post:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
