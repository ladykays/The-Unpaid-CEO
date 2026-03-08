//import { readPosts, writePosts } from "../services/fileServices.js";
import db from "../config/db.js";
import { calculateReadingTime, cleanMarkdown } from "../utils/contentUtils.js"; // Import utility functions for content processing
//import { v4 as uuidv4 } from "uuid"; // Import the UUID library to generate unique IDs

//Fetch all blog posts from the JSON file storage.
export async function getAllPosts() { 
  try {
    const result = await db.query(
      `SELECT p.*, u.name AS author_name, u.email AS author_email
       FROM posts p
       LEFT JOIN users u ON p.user_id = u.id 
       ORDER BY COALESCE(p.updated_at, p.created_at) DESC` // If updated_at exists → use it If updated_at is NULL → use created_at
    );

    /* // Basic validation
    if (!result.rows || !Array.isArray(result.rows)) {
      console.error('Posts data is not an array');
      return [];
    } */

    // Map database col names to match existing frontend expectations
    return result.rows.map(post => ({
      id: post.id,
      userId: post.user_id,
      author: {
        id: post.user_id,
        name: post.author_name,
        email: post.author_email
      },
      title: post.title,
      content: post.content,
      category: post.category,
      image: post.image,
      excerpt: post.excerpt,
      readingTime: post.reading_time,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    }));

  } catch (err) {
    console.log("Error fetching posts: ", err);
    throw err;
  }

  /* const posts = await readPosts(); // Return an array of post objects with title, content, etc.

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
  ); */
}

// Fetch a single blog post by ID.
export async function getPostById(id) {
  try {
    const result = await db.query(
      `SELECT p.*, u.name AS author_name, u.email AS author_email
       FROM posts p
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`, [id]  
    );

    if (result.rows.length === 0) return null;

    const post = result.rows[0];

    // Match existing format on the frontend
    return {
      id: post.id,
      userId: post.user_id,
      author: {
        id: post.user_id,
        name: post.author_name,
        email: post.author_email
      },
      title: post.title,
      content: post.content,
      category: post.category,
      image: post.image,
      excerpt: post.excerpt,
      readingTime: post.reading_time,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    }

  } catch (err) {
    console.log("Error fetching post by ID: ", err);
    throw err;
  }
  /* const posts = await readPosts(); // Read all posts from the JSON file
  return posts.find((post) => post.id === id); // Find and return the post with the matching ID */
}

// Fetch blog post by title.
export async function getPostByTitle(title) {
  try {
    const result = await db.query(
      `SELECT p.*, u.name AS author_name, u.email AS author_email
       FROM posts p
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.title = $1`, [title]
    );

    if (result.rows.length === 0) return null;

    const post = result.rows[0];

    return {
      id: post.id,
      userId: post.user_id,
      author: {
        id: post.user_id,
        name: post.author_name,
        email: post.author_email
      },
      title: post.title,
      content: post.content,
      category: post.category,
      image: post.image,
      excerpt: post.excerpt,
      readingTime: post.reading_time,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    };
  } catch (err) {
    console.log("Error fetching post by title: ", err);
    throw err;
  }
  /* const posts = await readPosts(); // Read all posts from the JSON file
  return posts.find((post) => post.title === title); // Find and return the post with the matching title */
}

// Fetch blog posts by category.
export async function getPostByCategory(category) {
  try {
    const result = await db.query(
      `SELECT p.*, u.name AS author_name, u.email AS author_email 
       FROM posts p 
       LEFT JOIN users u ON p.user_id = u.id
       WHERE category = $1 
       ORDER BY COALESCE(p.updated_at, p.created_at) DESC`, [category]
    );

    if (result.rows.length === 0) return null;
    
    return result.rows.map(post => ({
      id: post.id,
      userId: post.user_id,
      author: {
        id: post.user_id,
        name: post.author_name,
        email: post.author_email
      },
      title: post.title,
      content: post.content,
      category: post.category,
      image: post.image,
      excerpt: post.excerpt,
      readingTime: post.reading_time,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    }));
  } catch (err) {
    console.log("Error fetching posts by category: ", err);
    throw err;
  };

  /* const post = await readPosts(); // Read all posts from the JSON file
  const filteredPosts = post.filter((post) => post.category === category);
  return filteredPosts; // Filter and return posts with the matching category */
};

// Fetch posts by user ID
export async function getPostsByUserId(userId) {
  try {
    const result = await db.query(
      `SELECT p.*, u.name as author_name, u.email as author_email 
       FROM posts p
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.user_id = $1
       ORDER BY COALESCE(p.updated_at, p.created_at) DESC`,
      [userId]
    );
    
    return result.rows.map(post => ({
      id: post.id,
      userId: post.user_id,
      author: {
        id: post.user_id,
        name: post.author_name,
        email: post.author_email
      },
      title: post.title,
      category: post.category,
      image: post.image,
      content: post.content,
      excerpt: post.excerpt,
      readingTime: post.reading_time,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    }));
  } catch (error) {
    console.error('Error fetching posts by user ID:', error);
    throw error;
  }
}

// Create a new blog post
export async function createPost(postData, userId) {
  try {
    if (!userId) {
      throw new Error('User ID is required to create a post');
    }

    // Create structure for new post
    const newPost = {
      ...postData, // Spread the post data from the request body
      category: postData.category || "Uncategorized", // Default category if none is provided
      image: postData.image || "/images/default.jpg", // Default image if none is provided"
      excerpt: cleanMarkdown(postData.content, 100), // Generate an excerpt from the content
      readingTime: calculateReadingTime(postData.content), // Calculate the reading time for the content
    };

    const result = db.query(
      `INSERT INTO posts (
        user_id, title, category, image, content, excerpt, reading_time, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`, [newPost]
    );

    const createdPost = result.rows[0];

    // Return created post with author info
    return await getPostById(createdPost.id);
  } catch (err) {
    console.log("Error creating post: ", err);
    throw err;
  }
  /* const posts = await readPosts(); // Read all posts from the JSON file
  const newPost = {
    ...postData, // Spread the post data from the request body
    id: uuidv4(), // Generate a unique ID for the new post
    category: postData.category || "Uncategorized", // Default category if none is provided
    image: postData.image || "/images/default.jpg", // Default image if none is provided
    createdAt: new Date().toISOString(), // Store the creation date in ISO format
    excerpt: cleanMarkdown(postData.content, 100), // Generate an excerpt from the content
    readingTime: calculateReadingTime(postData.content), // Calculate the reading time for the content
  };
  posts.push(newPost); // Add the new post to the array of posts
  await writePosts(posts); // Write the updated posts array back to the JSON file
  return newPost; // Return the newly created post */
}

// update an existing blog post.
export async function updatePost(id, updatedData, userId) {
  try {
    // First check if post exists and user owns it
    const existingPost = await getPostById(id);
    if (!existingPost) return null;

    // Check if user is authorized to update this post
    if (existingPost.userId !== userId) {
      throw new Error('You are not authorized to update this post');
    }

    // Create structure for new post
    const updatedPost = {
      ...postData, // Spread the post data from the request body
      category: postData.category || "Uncategorized", // Default category if none is provided
      image: postData.image || "/images/d.efault.jpg", // Default image if none is provided"
      excerpt: cleanMarkdown(postData.content, 100), // Generate an excerpt from the content
      readingTime: calculateReadingTime(postData.content), // Calculate the reading time for the content
    };

    const result = await db.query(
      `UPDATE posts
       SET title = COALESCE($1, title),
           category = COALESCE($2, category),
           image = COALESCE($3, image),
           content = COALESCE($4, content),
           reading_time = $5,
           excerpt = $6,
           updated_at = $7
      WHERE id = $8 AND user_id = $9
      RETURNING *` [updatedPost]
    );

    if (result.rows.length === 0) return null;

    return await getPostById(id);
  } catch (err) {
    console.log("Error updating post: ", err);
    throw err;
  }
  /* const posts = await readPosts();
  const postIndex = posts.findIndex((post) => post.id === id); // Find the index of the post to update
  if (postIndex === -1) return null; // Return null if the post is not found

  const updatedPost = {
    ...posts[postIndex],
    ...updatedData,
    image: updatedData.image || posts[postIndex].image,
    excerpt: cleanMarkdown(updatedData.content),
    readingTime: calculateReadingTime(updatedData.content),
    updatedAt: new Date().toISOString(), // Store the update date in ISO format
  };
  posts[postIndex] = updatedPost;
  await writePosts(posts); 
  return updatedPost;  */
}

// Delete a blog post
export async function deletePost(id, userId) {
  
  /* const posts = await readPosts(); 
  const postIndex = posts.findIndex((post) => post.id === id); // Find the index of the post to delete

  if (postIndex === -1) return null; // Return null if the post is not found

  const deletedPost = posts[postIndex]; // Store the post to be deleted
  const deletedAt = new Date().toISOString(); // Store the deletion date in ISO format

  // Add the deletion date to the post object
  deletedPost.deletedAt = deletedAt; 
  console.log(`${deletedPost.title} was deleted on ${deletedPost.deletedAt}`); // Log the deletion
  
  posts.splice(postIndex, 1); // Remove the post from the array
  await writePosts(posts); // Write the updated posts array back to the JSON file
  return deletedAt;  */

}