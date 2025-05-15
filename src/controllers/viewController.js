import * as postModel from "../models/postModel.js";
import { sortByRecentActivity } from "../utils/contentUtils.js";
import { readResources } from "../services/fileServices.js";

// Homepage
export async function home(req, res) {
  try {
    const posts = await postModel.getAllPosts();
    const recentPosts = sortByRecentActivity(posts).slice(0, 3);
    //const recentPosts = posts.slice(-3).reverse(); // Get 3 most recent (or all if less than 3)
    res.render("index.ejs", {
      posts: recentPosts,
      showActions: false, // Hide edit and delete buttons
      showReadMore: true, // Show "Read More" button
      isHyperlink: false, // Don't make it a hyperlink
      currentPage: "home", // Current page for navigation
    });
  } catch (error) {
    console.error("Homepage error:", error);
    res.render("index.ejs", {
      posts: [],
      currentPage: "home",
    }); // Render with empty posts array
  }
}

// About page
export function about(req, res) {
  res.render("about.ejs", { currentPage: "about" }); // Current page for navigation
}

// Contact page
export function contact(req, res) {
  res.render("contact.ejs", { currentPage: "contact" }); // Current page for navigation
}

// Resources page
export async function resources(req, res) {
  try {
    const resources = await readResources();

    res.render("resources.ejs", { 
      resources,
      currentPage: "resources" 
    }); 
  } catch (error) {
    console.error('Error loading resources: ', error);
    res.status(500).send('Error loading resources');
  }
  }
  

// Create Post Form
export function createPostForm(req, res) {
  res.render("createPostForm.ejs", { currentPage: "createPost" }); // Current page for navigation
}


/* Controller for page related operations */
/* 
export default class PageController {
  // Homepage
  static async home(req, res) {
    try {
      const posts = await Post.getAllPosts();
      const recentPosts = posts.slice(-3).reverse(); // Get 3 most recent (or all if less than 3)
      res.render("index.ejs", {
        posts: recentPosts,
        showActions: false, // Hide edit and delete buttons
        showReadMore: true, // Show "Read More" button
        isHyperlink: false, // Don't make it a hyperlink
        currentPage: "home", // Current page for navigation
      });
    } catch (error) {
      console.error("Homepage error:", error);
      res.render("index.ejs", {
        posts: [],
        currentPage: "home",
      }); // Render with empty posts array
    }
  }

  // About page
  static about(req, res) {
    res.render("about.ejs", { currentPage: "about" }); // Current page for navigation
  }

  // Contact page
  static contact(req, res) {
    res.render("contact.ejs", { currentPage: "contact" }); // Current page for navigation
  }

  // Resources page
  static resources(req, res) {
    res.render("resources.ejs", { currentPage: "resources" }); // Current page for navigation
  }

  // Render the blog posts page
  static async allPosts(req, res) {
    try {
      const posts = await Post.getAllPosts();
      res.render("posts.ejs", {
        posts: posts,
        showActions: true, // Show edit and delete buttons
        showReadMore: false, // Don't show "Read More" button
        isHyperlink: true, // Make it a hyperlink
        currentPage: "posts", // Current page for navigation
      });
    } catch (error) {
      console.error("Posts page error:", error);
      res.render("posts.ejs", {
        posts: [],
        currentPage: "posts",
      }); // Render with empty posts array
    }
  }

  // Form for creating a new post
  static createPostForm(req, res) {
    res.render("createPostForm.ejs", { currentPage: "createPost" }); // Current page for navigation
  }

  // Render the edit post form
  static async editPostForm(req, res) {
    const { id } = req.params; // Extract the post ID from the URL
    try {
      const posts = await Post.getAllPosts();
      const post = posts.find((p) => p.id === id);
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
}
 */