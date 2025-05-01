import express from "express";
import Post from "../../models/postModel.js";
import {
  home,
  about,
  contact,
  resources,
  allPosts,
} from "../../controllers/viewController.js"; // Import the controller function to get all posts

const router = express.Router();

router.get("/", home); // Home page
router.get("/about", about); // About page
router.get("/contact", contact); // Contact page
router.get("/resources", resources); // Resources page
router.get("/posts", allPosts); // All posts page
router.get("/createPostForm", createPostForm); //Render the form used to create a new post

// Edit Post Form
router.get("/posts/edit/:id", async (req, res) => {
  const { title } = req.params;
  try {
    const posts = await getAllPosts();
    const post = posts.find((p) => p.id === req.params.id);
    if (!post) return res.status(404).send("Post not found");
    res.render("editPostForm.ejs", {
      postTitle: post.title,
      postContent: post.content,
      postId: post.id,
      postCategory: post.category,
      postImage: post.image,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).send("Error loading edit page");
  }
});

// Specific Post Page
router.get("/posts/:id", async (req, res) => {
  const { id } = req.params; // Extract the post ID from the URL
  try {
    const posts = await Post.getAllPosts();
    const post = posts.find((p) => p.id === id);
    if (!post) return res.status(404).send("Post not found");
    res.render("post.ejs", { post });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).send("Error loading post");
  }
});
