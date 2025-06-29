export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { key } = req.body
  const adminSecret = process.env.ADMIN_SECRET_KEY

  if (key === adminSecret) {
    res.status(200).json({ valid: true })
  } else {
    res.status(401).json({ valid: false })
  }
}
