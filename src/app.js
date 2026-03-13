import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import env from "dotenv";
import session from "express-session";

env.config();

import viewRoutes from "./routes/viewRoutes.js";
import { PORT } from "./config/constants.js"; 
import { cleanMarkdown } from "./utils/contentUtils.js";


const __dirname = path.dirname(fileURLToPath(import.meta.url)); //

// Middleware configuration
export const configureMiddleware = (app) => {
  app.use(express.static(path.join(__dirname, "../public"))); // Serve static files from the public directory
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
  app.use(express.json()); // For JSON parsing

  // Session configuration
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 //24 hrs
      }
    })
  );

  // Make session user available to all views
  app.use((req, res,next) => {
    try {
      res.locals.user = req.session?.user || null;
    } catch (err) {
      console.error("Error setting res.locals.user:", err);
      res.locals.user = null;
    }
    next();
  });

  // Set view engine
  app.set("views", path.join(__dirname, "../views")); // Set the views directory
  app.set("view engine", "ejs"); // Set the view engine to EJS
} 

const app = express();
configureMiddleware(app); // Call the middleware configuration function

//Routes
app.use('/', viewRoutes); // Use the routes defined in viewRoutes.js

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).render("error.ejs", {
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err : {},
    user: req.session?.user || null,
    currentPage: "error"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("error.ejs", {
    message: "Page not found",
    error: {},
    user: req.session?.user || null,
    currentPage: "error"
  });
});


app.locals.cleanMarkdown = cleanMarkdown;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Log the server URL
}); // Start the server and listen on the specified port

export default app;
