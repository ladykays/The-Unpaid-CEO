import Post from "../models/postModel.js";
import { calculateReadingTime, getExcerpt } from "../../utils/contentUtils.js"; // Import utility functions for content processing

export default class PostController {
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
