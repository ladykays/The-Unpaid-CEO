import * as postModel from "../models/postModel.js"; // Import all exports from postModel
import { 
  sortByRecentActivity,
  extractCategories,
  filterPostsByCategory,
  calculateReadingTime,
  getExcerpt,
} from "../utils/contentUtils.js";

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
    const posts = await postModel.getPostByCategory(category);
    const filteredPosts = filterPostsByCategory(allPosts, category);
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
    const recentPosts = posts.slice(-3); // Get the last 3 posts
    res.render("index.ejs", {
      posts: recentPosts,
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







/* export default class PostController {
  // Create new post
  static async createPost(req, res) {
    try {
      const newPost = await Post.createPost(req.body); // Create a new post using the request body
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

  // Get single post
  static async getPostById(req, res) {
    const { id } = req.params; // Extract the post ID from the URL
    try {
      const posts = await Post.getAllPosts();
      const post = posts.find((p) => p.id === id);
      if (!post) return res.status(404).send("Post not found");
      res.render("post.ejs", {
        post: post,
        showActions: false, // Hide edit and delete buttons
        showReadMore: false, // Don't show "Read More" button
        isHyperlink: false, // Don't make it a hyperlink
        currentPage: "post", // Current page for navigation
      });
    } catch (error) {
      console.error("Post page error:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  // Get edit form
  static async getEditForm(req, res) {
    const { id } = req.params;
    try {
      const posts = await Post.getAllPosts();
      const post = posts.find((p) => p.id === id);
      if (!post) return res.status(404).send("Post not found");
      res.render("editForm.ejs", {
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

  // Update a post
  static async updatePost(req, res) {
    const { id } = req.params;
    try {
      const updatedPost = await Post.updatePost(id, req.body); // Update the post using the request body
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

  // Delete a post
  static async deletePost(req, res) {
    const { id } = req.params;
    try {
      await Post.deletePost(id); // Delete the post by ID
      res.redirect("/posts"); // Redirect to the posts page
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  // Get post by category
  static async getPostsByCategory(req, res) {
    const { category } = req.params;
    try {
      const posts = await Post.getAllPosts();
      const filteredPosts = posts.filter((post) => post.category === category);
      res.render("posts.ejs", {
        posts: filteredPosts,
        showActions: true, // Show edit and delete buttons
        showReadMore: false, // Don't show "Read More" button
        isHyperlink: true, // Make it a hyperlink
        currentPage: "posts", // Current page for navigation
      });
    } catch (error) {
      console.error("Error fetching posts by category:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}
 */