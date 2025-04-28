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

// Function to save posts to JSON file
async function savePosts(posts) {
  await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
}

// Function to save contact form data
async function saveContactForm(data) {
  try {
    // read existing contact data from JSON file if it exists
    const contactData = await fs.readFile('contact.json', 'utf-8');

    // Parse the existing data into an array
    const contacts = JSON.parse(contactData);

    // Add the new contact data to the array
    contacts.push(data);

    // Write the updated array back to the JSON file with proper formatting
    await fs.writeFile('contact.json', JSON.stringify (contacts, null, 2));  
  } catch (error) {
    console.error('Error saving contact form data:', error);

    // If the file doesn't exist, create it with the new data
    await fs.writeFile('contact.json', JSON.stringify([data], null, 2));
    console.log('Contact form data saved.');
  }
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

app.get ('/createPostForm', (req, res) => {
  res.render('createPostForm.ejs');
});

/* Form submission handling */
// Handle POST requests to the `/createPostForm` endpoint
app.post('/createPostForm', async (req, res) => {
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

// Handle POST requests to the `/contact` endpoint
app.post('/contact', (req, res) => {
  // Destructure the contact form data from the request body
  const {name, email, subject, message} = req.body;

  // Create a contact data object with the form fields
  const contactData = {
    name,
    email,
    subject,
    message,
    timestamp: new Date().toISOString(), // Add a timestamp for when the form was submitted
  };

  // Call the saveContactForm function to store the contact data
  saveContactForm(contactData)
    .then(() => {
      // On successful save:
      
      console.log(`Contact form submitted:
        Name: ${name}, 
        Email: ${email}, 
        Subject: ${subject}, 
        Message: ${message}`);

      // Render the thank you page
      res.render('thanks.ejs');
    })
    .catch((error) => {
      // If saving fails:
      console.error('Error saving contact form data:', error);
      res.status(500).send('Error saving your contact form data');
    });
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
