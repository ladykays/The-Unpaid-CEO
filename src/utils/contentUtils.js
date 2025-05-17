import { WORDS_PER_MINUTE } from "../config/constants.js";

// Function to generate an excerpt from the content
export function getExcerpt(content, length = 100) {
  if (!content) return '';

  // Remove markdown-style bold syntax (**text** 👉 text)
  const plainText = content
    // Remove headings (must come first)
    .replace(/^#{1,6}\s+.*$/gm, '')  // Matches # Heading to ###### Heading
    // Remove other markdown
    .replace(/\*\*(.*?)\*\*/g, '$1')  // Bold
    .replace(/\*(.*?)\*/g, '$1')      // Italics
    .replace(/!?\[(.*?)\]\(.*?\)/g, '$1') // Links and images
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // Code
    .replace(/~~(.*?)~~/g, '$1')      // Strikethrough
    // Clean up whitespace
    .replace(/\n+/g, ' ')             // Newlines to spaces
    .replace(/\s+/g, ' ')             // Collapse spaces
    .trim();

    // If we removed everything, fallback to raw content
  if (!plainText) {
    plainText = content
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  // Truncate and add ellipsis if needed
  const excerpt =
    plainText.length > length ? plainText.substring(0, length) + "..." : plainText; // Truncate content to the specified length
    
  return excerpt;
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
