import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./src/routes/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url)); //

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, "../public"))); // Serve static files from the public directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.set("views", path.join(__dirname, "../views")); // Set the views directory
app.set("view engine", "ejs"); // Set the view engine to EJS

// Routes
app.use("/", routes); // Use the routes defined in the routes directory

const PORT = process.env.PORT || 3000; // Set the port to listen on
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Log the server URL
}); // Start the server and listen on the specified port

export default app;
