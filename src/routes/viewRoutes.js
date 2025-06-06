import express from 'express';

import * as postController from '../controllers/postController.js';
import * as viewController from '../controllers/viewController.js';
import * as contactController from '../controllers/contactController.js';
import * as subscriptionController from '../controllers/subscriptionController.js';
import { cleanMarkdown } from '../utils/contentUtils.js';


const router = express.Router();


// View Routes
router.get('/', viewController.home); 
router.get('/about', viewController.about);
router.get('/contact', viewController.contact); 
router.get('/resources', viewController.resources); // Resources page
router.get('/createPostForm', viewController.createPostForm); 
router.get('/posts', postController.getAllPosts); 
router.get('/', postController.getRecentPosts); 
router.get('/posts/edit/:id', postController.getEditForm); // Edit Post Form
router.get('/posts/search', postController.searchPosts); //
router.get('/posts/category/:category', postController.getPostsByCategory); // Posts by Category
router.get('/posts/title/:title', postController.getPostByTitle); // Posts by Title
router.get('/posts/:id', postController.getPostById); // Specific Post Page

// Form Submission Routes
router.post('/posts/createPost', postController.createPost); // Create Post
router.post('/posts/update/:id', postController.updatePost); // Update Post
router.post('/posts/delete/:id', postController.deletePost); // Delete Post
router.post('/contact', contactController.handleContactFormSubmission)
router.post('/subscribe', subscriptionController.handleSubscriberFormSubmission)



export default router;

