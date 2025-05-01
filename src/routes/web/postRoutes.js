import express from "express";
import { getAllPosts } from "../../controllers/viewController.js"; // Import the controller function to get all posts
import {
  createPost,
  getPostById,
  getEditForm,
  updatePost,
  deletePost,
  getPostsByCategory,
} from "../../controllers/postController.js"; // Import the post controller functions

const router = express.Router(); // Create a new router instance

//RESTful routes for blog posts
router.get("/posts", getAllPosts); // Route to get all posts
router.post("/posts", createPost); // Route to create a new post

// Filtering routes
router.get("/posts/category/:category", getPostsByCategory); // Route to get posts by category

// Routes for individual posts
router.get("/posts/:id", getPostById); // Route to get a single post by ID
router.get("/posts/edit/:id", getEditForm); // Route to get the edit form for a post
router.patch("/posts/update/:id", updatePost); // Route to update a post
router.delete("/posts/delete/:id", deletePost); // Route to delete a post

export default router; // Export the router to be used in the main app
// This code sets up the routing for the blog posts in the web application.
// It imports the necessary controller functions and defines the routes for getting all posts
