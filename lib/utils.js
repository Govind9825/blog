export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim("-") // Remove leading/trailing hyphens
}

// Format date
export function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  return new Date(dateString).toLocaleDateString("en-US", options)
}
