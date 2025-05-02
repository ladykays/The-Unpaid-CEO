import { WORDS_PER_MINUTE } from "../config/constants.js";

// Function to generate an excerpt from the content
export function getExcerpt(content, length = 100) {
  const excerpt =
    content.length > length ? content.substring(0, length) + "..." : content; // Truncate content to the specified length
  return excerpt;
}

// Function to calculate reading time based on content length
export function calculateReadingTime(content) {
  const words = content.split(/\s+/).length; // Split content into words
  const readingTime = Math.ceil(words / WORDS_PER_MINUTE); // Calculate reading time in minutes
  return readingTime;
}
