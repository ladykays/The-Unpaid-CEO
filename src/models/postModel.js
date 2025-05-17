import { readPosts, writePosts } from "../services/fileServices.js";
import { calculateReadingTime, getExcerpt } from "../utils/contentUtils.js"; // Import utility functions for content processing
import { v4 as uuidv4 } from "uuid"; // Import the UUID library to generate unique IDs

//Fetch all blog posts from the JSON file storage.
export async function getAllPosts() { 
  const posts = await readPosts(); // Return an array of post objects with title, content, etc.

  // Basic validation
  if (!Array.isArray(posts)) {
    console.error('Posts data is not an array');
    return [];
  }
  
  return posts.filter(post => 
    post.id && 
    post.title && 
    post.content && 
    post.category
  );
}

// Fetch a single blog post by ID from the JSON file storage.
export async function getPostById(id) {
  const posts = await readPosts(); // Read all posts from the JSON file
  return posts.find((post) => post.id === id); // Find and return the post with the matching ID
}

// Fetch blog post by title from the JSON file storage.
export async function getPostByTitle(title) {
  const posts = await readPosts(); // Read all posts from the JSON file
  return posts.find((post) => post.title === title); // Find and return the post with the matching title
}

// Fetch blog posts by category from the JSON file storage.
export async function getPostByCategory(category) {
  const post = await readPosts(); // Read all posts from the JSON file
  const filteredPosts = post.filter((post) => post.category === category);
  return filteredPosts; // Filter and return posts with the matching category
}

// Create a new blog post and save it to the JSON file storage.
export async function createPost(postData) {
  const posts = await readPosts(); // Read all posts from the JSON file
  const newPost = {
    ...postData, // Spread the post data from the request body
    id: uuidv4(), // Generate a unique ID for the new post
    category: postData.category || "Uncategorized", // Default category if none is provided
    image: postData.image || "/images/default.jpg", // Default image if none is provided
    createdAt: new Date().toISOString(), // Store the creation date in ISO format
    excerpt: getExcerpt(postData.content), // Generate an excerpt from the content
    readingTime: calculateReadingTime(postData.content), // Calculate the reading time for the content
  };
  posts.push(newPost); // Add the new post to the array of posts
  await writePosts(posts); // Write the updated posts array back to the JSON file
  return newPost; // Return the newly created post
}

// update an existing blog post by ID and save it to the JSON file storage.
export async function updatePost(id, updatedData) {
  const posts = await readPosts();
  const postIndex = posts.findIndex((post) => post.id === id); // Find the index of the post to update
  if (postIndex === -1) return null; // Return null if the post is not found

  const updatedPost = {
    ...posts[postIndex],
    ...updatedData,
    image: updatedData.image || posts[postIndex].image,
    excerpt: getExcerpt(updatedData.content),
    readingTime: calculateReadingTime(updatedData.content),
    updatedAt: new Date().toISOString(), // Store the update date in ISO format
  };
  posts[postIndex] = updatedPost;
  await writePosts(posts); 
  return updatedPost; 
}

// Delete a blog post by ID and save the changes to the JSON file storage.
export async function deletePost(id) {
  const posts = await readPosts(); 
  const postIndex = posts.findIndex((post) => post.id === id); // Find the index of the post to delete

  if (postIndex === -1) return null; // Return null if the post is not found

  const deletedPost = posts[postIndex]; // Store the post to be deleted
  const deletedAt = new Date().toISOString(); // Store the deletion date in ISO format

  // Add the deletion date to the post object
  deletedPost.deletedAt = deletedAt; 
  console.log(`${deletedPost.title} was deleted on ${deletedPost.deletedAt}`); // Log the deletion
  
  posts.splice(postIndex, 1); // Remove the post from the array
  await writePosts(posts); // Write the updated posts array back to the JSON file
  return deletedAt; 

}