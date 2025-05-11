import express from 'express';
import pageRoutes from './web/pageRoutes.js';
import postRoutes from './web/postRoutes.js';
import contactRoutes from './api/contactRoutes.js';


const router = express.Router(); // Create a new router instance 

// Define the routes for the web pages
router.use('/', pageRoutes); // Use the web routes defined in web/pageRoutes.js
router.use('/posts', postRoutes); // Use the post routes defined in web/postRoutes.js
router.use('/api/contact', contactRoutes); // Use the contact API routes defined in api/contactApi.js

// Export the router to be used in the main app
export default router; // Export the router instance

// This code sets up the main routing for the web application.
// It imports the necessary route modules and uses them to define the routes for the web pages and API endpoints.
// The router instance is then exported to be used in the main app file.
// The webRoutes handle the main web pages, the postRoutes handle blog post-related routes,
// and the contactApiRoutes handle the API endpoints for contact form submissions.
// This modular approach helps keep the code organized and maintainable.