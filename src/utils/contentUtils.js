import { WORDS_PER_MINUTE } from "../config/constants.js";


// Function to clean markdown 
export function cleanMarkdown(content, length = null) {
  
  // If no content is provided, return an empty string
  if (!content) return '';

  // Convert markdown content to plain text
  const plainText = content
    // Remove markdown headings like "# Heading", "## Subheading", etc.
    .replace(/^#{1,6}\s+.*$/gm, '')  // Matches lines starting with 1–6 '#' followed by space and text

    // Remove bold markdown syntax: **bold** becomes bold
    .replace(/\*\*(.*?)\*\*/g, '$1')

    // Remove italic markdown syntax: *italic* becomes italic
    .replace(/\*(.*?)\*/g, '$1')

    // Remove links and images: [text](url) or ![alt](url) becomes just "text" or "alt"
    .replace(/!?\[(.*?)\]\(.*?\)/g, '$1')

    // Remove inline code: `code` or ```code``` becomes just "code"
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1')

    // Remove strikethrough: ~~text~~ becomes text
    .replace(/~~(.*?)~~/g, '$1')

    // Remove emoji/icons (basic unicode emoji pattern)
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])/g,
      ''
    )

    // Replace one or more newlines with a single space
    .replace(/\n+/g, ' ')

    // Collapse multiple spaces into one
    .replace(/\s+/g, ' ')

    // Remove leading and trailing whitespace
    .trim();

  // If all markdown removal results in an empty string, fallback to using raw content (with just whitespace cleaned)
  if (!plainText) {
    plainText = content
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  if (length && plainText.length > length) {
    return plainText.substring(0, length) + '...';
  }

  return plainText;
}

// Function to calculate reading time based on content length
export function calculateReadingTime(content) {
  const words = content.split(/\s+/).length; // Split content into words
  const readingTime = Math.ceil(words / WORDS_PER_MINUTE); // Calculate reading time in minutes
  return readingTime;
}

// Sort posts by the most recent date (either createdAt or updatedAt)
export function sortByRecentActivity(posts) {
  // Make a copy of the posts array so as not to change the original
  const postsCopy = [...posts];
  
  // Sort the copied posts
  postsCopy.sort((postA, postB) => {
    // Helper function to get the most recent date for a post
    function getMostRecentDate(post) {
      // If post has no createdAt date, use a very old date (1970) as default
      if (!post.createdAt) return new Date(0);
      
      // Convert string dates to Date objects so it can be compared properly
      const createdDate = new Date(post.createdAt);
      const updatedDate = post.updatedAt ? new Date(post.updatedAt) : null;
      
      // Use the newer date between created date and updated date
      if (updatedDate && updatedDate > createdDate) {
        return updatedDate;
      } else {
        return createdDate;
      }
    }
    
    // Get dates for both posts being compared
    const dateA = getMostRecentDate(postA);
    const dateB = getMostRecentDate(postB);
    
    // Compare the dates (newest first)
    return dateB - dateA;
  });
  
  return postsCopy;
}

// Extract all unique categories from posts array
export function extractCategories(posts) {
  // Get all unique category names
  const categoryNames = [...new Set(posts.map(post => post.category))];
  
  // Convert to objects with id and name properties
  return categoryNames.map(category => ({
    id: slugifyCategory(category), // Generate slugified ID (a URL-friendly verion of the category name)
    name: category // Original category name
  }));
}

// Helper function to create URL-friendly category IDs
function slugifyCategory(category) {
  return category.toLowerCase() // Convert to lowercase
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w-]+/g, '');   // Remove all non-word characters or hyphens
}

// Filter posts by category (returns all posts if category is 'all')
export function filterPostsByCategory(posts, categoryId) {
  if (categoryId === 'all') return posts; // If category is 'all' return all posts without filtering
  
  // Otherwise, filter posts to only include those where:
  // The slugified version of the post's category matches the requested categoryId
  return posts.filter(post => 
    slugifyCategory(post.category) === categoryId
  );
}
