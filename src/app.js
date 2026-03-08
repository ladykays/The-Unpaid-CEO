import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import env from "dotenv";

env.config();

import viewRoutes from "./routes/viewRoutes.js";
import { PORT } from "./config/constants.js"; 
import { cleanMarkdown } from "./utils/contentUtils.js";
import pg from "pg";
import bcrypt from "bcrypt"; 
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";



const __dirname = path.dirname(fileURLToPath(import.meta.url)); //

// Middleware
export const configureMiddleware = (app) => {
  app.use(express.static(path.join(__dirname, "../public"))); // Serve static files from the public directory
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
  app.set("views", path.join(__dirname, "../views")); // Set the views directory
  app.set("view engine", "ejs"); // Set the view engine to EJS
} 

const app = express();
configureMiddleware(app); // Call the middleware configuration function
app.use('/', viewRoutes); // Use the routes defined in viewRoutes.js

app.locals.cleanMarkdown = cleanMarkdown;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Log the server URL
}); // Start the server and listen on the specified port

export default app;
