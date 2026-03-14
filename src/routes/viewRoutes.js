import express from "express";

import * as postController from "../controllers/postController.js";
import * as viewController from "../controllers/viewController.js";
import * as contactController from "../controllers/contactController.js";
import * as subscriptionController from "../controllers/subscriptionController.js";
import * as authController from "../controllers/authController.js";
//import { cleanMarkdown } from "../utils/contentUtils.js";


const router = express.Router();


// Public View Routes
router.get('/', viewController.home); 
router.get('/about', viewController.about);
router.get('/contact', viewController.contact);  
router.get('/login', authController.requireGuest, viewController.login);
router.get('/register', authController.requireGuest, viewController.register);
router.get('/resources', authController.requireAuth, viewController.resources);


// Post Routes
router.get('/posts', postController.getAllPosts); 
router.get('/', postController.getRecentPosts); 
//router.get('/recent-posts', postController.getRecentPosts); 
router.get('/posts/edit/:id', authController.requireAuth, postController.getEditForm); 
router.get('/posts/search', postController.searchPosts); 
router.get('/posts/category/:category', postController.getPostsByCategory); 
router.get('/posts/title/:title', postController.getPostByTitle); 
router.get('/posts/:id', postController.getPostById); // Specific Post Page

// Protected Routes (requires authentication)
router.get('/createPostForm', authController.requireAuth, viewController.createPostForm); 
//router.get('/resources', authController.requireAuth, viewController.resources);
router.get('/my-posts', authController.requireAuth, postController.getMyPosts);
router.get('/profile', authController.requireAuth, authController.getProfile);
router.get('posts/edit/:id', authController.requireAuth, postController.getEditForm);

// Form Submission Routes
router.post('/signup', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/posts/createPost', authController.requireAuth, postController.createPost); 
router.post('/posts/update/:id', authController.requireAuth, postController.updatePost); 
router.post('/posts/delete/:id', authController.requireAuth, postController.deletePost); // Delete Post
router.post('/contact', contactController.handleContactFormSubmission)
router.post('/subscribe', subscriptionController.handleSubscriberFormSubmission)

export default router;

