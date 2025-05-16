import * as postModel from "../models/postModel.js"; // Import all exports from postModel
import { 
  sortByRecentActivity,
  extractCategories,
  filterPostsByCategory,
  calculateReadingTime,
  getExcerpt,
} from "../utils/contentUtils.js";

// Function to handle post searches
export async function searchPosts(req, res) {
  // 1. Extract search query from URL parameters
  // Example: /posts/search?q=test → q = "test"
  const { q } = req.query; // Where q is the search query in the example above q = "test"

  // Handle empty search query
  if (!q || q.trim() === '') {
    // If search is empty, redirect to all posts view
    return res.redirect('/posts');  
  }

  try {
    // Fetch all posts from the database
    const posts = await postModel.getAllPosts();
    
    // Debugging logs
    console.log(`Searching for: "${q}"`);
    console.log(`Total posts: ${posts.length}`);
    
    // Validate posts data structure
    if (!Array.isArray(posts)) {
      throw new Error('Posts data is not an array');
    }

    // Extract unique categories for sidebar filtering
    const categories = extractCategories(posts);
    
    // Prepare search term (case-insensitive)
    const searchTerm = q.toLowerCase();

    // Filter posts that match search criteria
    const filteredPosts = posts.filter(post => {
      // Ensure post has required fields
      if (!post.title || !post.content || !post.category) {
        console.warn('Post missing required fields:', post.id);
        return false; // Skip malformed posts
      }
      
      // Check for matches in title, content, or category
      return (
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.category.toLowerCase().includes(searchTerm)
      );
    });

    console.log(`Found ${filteredPosts.length} matching posts`);
    
    // Render the view with results
    res.render('posts.ejs', {
      posts: sortByRecentActivity(filteredPosts), // Sort newest first
      categories, // For category sidebar
      activeCategory: null, // No active category filter
      showActions: true, // Show edit/delete buttons
      showReadMore: false, // Don't show "Read More"
      isHyperlink: true, // Make titles clickable
      currentPage: 'posts', // Active nav item
      searchQuery: q, // Display searched term
    });

  } catch (error) {
    console.error("Search error:", error);

    // Render error
    res.status(500).render('posts.ejs', {
      message: 'Error performing search',
      currentPage: 'posts',
      posts: [],
      categories: []
    });
  }
}

// Function to fetch all posts from the postModel and display them
export async function getAllPosts(req, res) {
  try {
    const posts = await postModel.getAllPosts(); // Fetch all posts
    const sortedPosts = sortByRecentActivity(posts);
    const categories = extractCategories(posts)

    res.render('posts.ejs', {
      posts: sortedPosts,
      categories,
      activeCategory: null,
      showActions: true, // Show edit and delete buttons
      showReadMore: false, // Don't show "Read More" button
      isHyperlink: true, // Make it a hyperlink
      currentPage: 'posts', // Current page for navigation
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).render("posts.ejs", {
      message: "Failed to load posts",
      currentPage: "posts",

      // Only expose full error details in development for security (avoids leaking sensitive info in production)
      error: process.env.NODE_ENV === 'development' ? error : null,
    }); 
  }
}

// Function to fetch a single post by ID from the postModel and display it
export async function getPostById(req, res) {
  const {id} = req.params;

  try {
    const post = await postModel.getPostById(id);
    if (!post) return res.status(404).send("Post not found");
    res.render('blogPost.ejs', {
      post,
      readingTime: calculateReadingTime(post.content),
      excerpt: getExcerpt(post.content),
      currentPage:'post'
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).send("Error loading post");
  }
}

export async function getPostByTitle(req, res) {
  const { title } = req.params;

  try {
    const post = await postModel.getPostByTitle(title);
    if (!post) return res.status(404).send("Post not found");
    res.render('blogPost.ejs', { 
      post,
      readingTime: calculateReadingTime(post.content),
      excerpt: getExcerpt(post.content),
      currentPage:'post'
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).send("Error loading post");
  }
}

// Function to fetch posts by category from the postModel and display them
export async function getPostsByCategory(req, res) {
  const { category } = req.params;

  try {
    //const allPosts = await postModel.getPostByCategory(category); // Get all the posts first
    //const filteredPosts = filterPostsByCategory(allPosts, category); // Filter the posts
    //const categories = extractCategories(allPosts);

    // Get all posts first (not filtered)
    const allPosts = await postModel.getAllPosts();

    // Filter posts to just the category requested
    const filteredPosts = filterPostsByCategory(allPosts, category);

    // Extract categories from allposts 
    const categories = extractCategories(allPosts); 
    
    if (filteredPosts.length === 0) return res.status(404).render('posts.ejs', {
      message: "No posts found in this category",
      categories,
      currentPage: 'posts'
    });

    res.render('posts.ejs', {
      posts: sortByRecentActivity(filteredPosts),
      categories,
      activeCategory: category,
      showActions: true, // Show edit and delete buttons
      showReadMore: false, // Don't show "Read More" button
      isHyperlink: true, // Make it a hyperlink
      currentPage: 'posts', // Current page for navigation
    });
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    res.status(500).send("Error loading posts");
  }
}

// Function to get the edit form
export async function getEditForm(req, res) {
  const { id } = req.params;
  try {
    const post = await postModel.getPostById(id);
    if (!post) return res.status(404).send("Post not found");
    res.render("editPostForm.ejs", {
      postTitle: post.title,
      postContent: post.content,
      postId: post.id,
      postCategory: post.category,
      postImage: post.image,
      currentPage: "editPost", // Current page for navigation
    });
  } catch (error) {
    console.error("Edit post form error:", error);
    res.status(500).send("Internal Server Error");
  }
}


export async function createPost(req, res) {
  try {
    const newPost = await postModel.createPost(req.body); // Create a new post using the request body
    res.redirect(`/posts/${newPost.id}`); // Redirect to the newly created post
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).render("createPostForm.ejs", {
      error: "Failed to create post",
      formData: req.body,
      currentPage: "createPost",
    });
  }
}

// Function to update a post by ID using the postModel and redirect to the updated post
export async function updatePost(req, res) {
  const { id } = req.params;

  try {
    const updatedPost = await postModel.updatePost(id, req.body); // Update the post using the request body
    if (!updatedPost) return res.status(404).send("Post not found");
    res.redirect(`/posts/${updatedPost.id}`); // Redirect to the updated post
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).render("editForm.ejs", {
      error: "Failed to update post",
      formData: req.body,
      postId: id,
      currentPage: "editPost",
    });
  }
}

// Function to delete a post by ID using the postModel and redirect to the posts page
export async function deletePost(req, res) {
  const { id } = req.params;

  try {
    const deletedPost = await postModel.deletePost(id); // Delete the post by ID
    if (!deletedPost) return res.status(404).send("Post not found");
    res.redirect("/posts"); // Redirect to the posts page
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function getRecentPosts(req, res) {
  try {
    const posts = await postModel.getAllPosts();
    const sortedPosts = sortByRecentActivity(posts);
    const recentPosts = sortedPosts.slice(0, 3); // Get the first 3 posts after sorting
    res.render("index.ejs", {
      posts: recentPosts,
      //posts: sortByRecentActivity(recentPosts),
      showActions: false, // Show edit and delete buttons
      showReadMore: true, // Show "Read More" button
      isHyperlink: false, // Make it a hyperlink
      currentPage: "home", // Current page for navigation
    });
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    res.status(500).send("Internal Server Error");
    res.render("index.ejs", {
      posts: [],
      currentPage: "home",
    }); // Render with empty posts array
  }
}
