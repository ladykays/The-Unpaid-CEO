import express from 'express';
import fs from 'fs/promises'; //for file operations

const app = express();
const port = 3000;
const POSTS_FILE = 'posts.json'; // File to store posts

// Middleware
app.use(express.static('public')); // Serve static files from the "public" directory
app.use(express.urlencoded({ extended: true })); // To parse form data
app.set('view engine', 'ejs'); // Set EJS as the templating engine

// Helper function to get posts from JSON file
async function getPosts() {
  try {
    const data = await fs.readFile(POSTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading posts file:', error);
    return [];
  }
}

// Helper function to save posts to JSON file
async function savePosts(posts) {
  await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
}

// Routes
app.get('/', async(req, res) => {
  try {
    const posts = await getPosts();
    // Get the most recent posts (or all if less than 3)
    const recentPosts = posts.slice(-3).reverse(); //Can change this to featured posts 
    res.render('index.ejs', { posts: recentPosts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.render('index.ejs', { posts: [] });
  }
});

app.get('/about', (req, res) => {
  res.render('about.ejs');
});

app.get('/contact', (req, res) => {
  res.render('contact.ejs');
});

app.get('/resources', (req, res) => {
  res.render('resources.ejs');
});

app.get ('/form', (req, res) => {
  res.render('form.ejs');
});

// Form submission handling
app.post('/form', async (req, res) => {
  /* console.log(req.body);
  res.send(req.body); */
  const { title, category, image, excerpt, content } = req.body;

  try {
    const posts = await getPosts();
    const newPost = { 
      title, 
      category, 
      image: image || '/images/default.jpg', // Default image if none provided
      excerpt, 
      content,
      createdAt: new Date().toISOString(), // Add a timestamp for sorting
    };
    posts.push(newPost);
    await savePosts(posts);

    res.render('thanks.ejs');
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).send('Error saving your post');
  }
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
