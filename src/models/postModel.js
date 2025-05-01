import { readPosts, writePosts } from "../services/fileService.js";
import { calculateReadingTime, getExcerpt } from "../../utils/contentUtils.js"; // Import utility functions for content processing
import { v4 as uuidv4 } from "uuid"; // Import the UUID library to generate unique IDs

class Post {
  constructor(title, category, image, content, excerpt) {
    this.id = uuidv4(); // Generate a unique ID for each post
    this.title = title;
    this.category = category || "Uncategorized"; // Default category if none is provided
    this.image = image || "../public/images/default.jpg"; // Default image if none is provided
    this.content = content;
    this.createdAt = new Date().toISOString(); // Store the creation date in ISO format
    this.excerpt = getExcerpt(this.content); // Generate an excerpt if none is provided
  }
  
  /**
 * Fetch all blog posts from the JSON file storage.
 */
  static async getAllPosts() { 
    return await readPosts(); // Return an array of post objects with title, content, etc.
  }

  /*   static async savePost(post) { // Save a new post to the JSON file
    const posts = await Post.getAllPosts();
    posts.push(post);
    await writeJsonFile(POST_FILE, posts);
  }
static async deletePost(title) { // Delete a post by title
    const posts = await Post.getAllPosts();
    const updatedPosts = posts.filter(post => post.title !== title);
    await writeJsonFile(POST_FILE, updatedPosts);
  }
  static async updatePost(title, updatedContent) { // Update a post by title
    const posts = await Post.getAllPosts();
    const postIndex = posts.findIndex(post => post.title === title);
    if (postIndex !== -1) {
      posts[postIndex].content = updatedContent;
      await writeJsonFile(POST_FILE, posts);
    }
  }
  static async getPostByTitle(title) { // Get a post by title
    const posts = await Post.getAllPosts();
    return posts.find(post => post.title === title);
  }
  static async getPostById(id) { // Get a post by ID
    const posts = await Post.getAllPosts();
    return posts.find(post => post.id === id);
  }
  static async getPostByDate(date) { // Get a post by date
    const posts = await Post.getAllPosts();
    return posts.filter(post => post.createdAt.toDateString() === date.toDateString());
  }
  static async getPostByDateRange(startDate, endDate) { // Get posts within a date range
    const posts = await Post.getAllPosts();
    return posts.filter(post => {
      const postDate = new Date(post.createdAt);
      return postDate >= startDate && postDate <= endDate;
    });
  }
  static async getPostByKeyword(keyword) { // Get posts by keyword in title or content
    const posts = await Post.getAllPosts();
    return posts.filter(post => post.title.includes(keyword) || post.content.includes(keyword));
  }
  static async getPostByAuthor(author) { // Get posts by author
    const posts = await Post.getAllPosts();
    return posts.filter(post => post.author === author);
  }
  static async getPostByCategory(category) { // Get posts by category
    const posts = await Post.getAllPosts();
    return posts.filter(post => post.category === category);
  }
  static async getPostByTag(tag) { // Get posts by tag
    const posts = await Post.getAllPosts();
    return posts.filter(post => post.tags && post.tags.includes(tag));
  }
  static async getPostByStatus(status) { // Get posts by status (published, draft, etc.)
    const posts = await Post.getAllPosts();
    return posts.filter(post => post.status === status);
  }
  static async getPostByComment(comment) { // Get posts by comment
    const posts = await Post.getAllPosts();
    return posts.filter(post => post.comments && post.comments.includes(comment));
  } */
}
