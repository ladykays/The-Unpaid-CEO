import express from 'express';
import fs from 'fs/promises'; //for file operations

const app = express();
const port = 3000;
const POSTS_FILE = 'posts.json'; // File to store posts

// Middleware
app.use(express.static('public')); // Serve static files from the "public" directory
app.use(express.urlencoded({ extended: true })); // To parse form data



// Function to get posts from JSON file
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

// Function to save subscription form data
async function saveSubscriptionForm(data) {
  try {
    // read existing subscription data from JSON file if it exists
    const subscriptionData = await fs.readFile('subscriptions.json', 'utf-8');

    // Parse the existing data into an array
    const subscriptions = JSON.parse(subscriptionData);

    // Add the new subscription data to the array
    subscriptions.push(data);

    // Write the updated array back to the JSON file with proper formatting
    await fs.writeFile('subscriptions.json', JSON.stringify (subscriptions, null, 2));  
  } catch (error) {
    console.error('Error saving subscription form data:', error);

    // If the file doesn't exist, create it with the new data
    await fs.writeFile('subscriptions.json', JSON.stringify([data], null, 2));
    console.log('Subscription form data saved.');
  }
}

// Function to calculate reading time in minutes
function calculateReadingTime(content) {
  const WORDS_PER_MINUTE = 200; // Average reading speed

  const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  const wordCount = text.trim().split(/\s+/).length; // Count words
  const readingTime = Math.ceil(wordCount / WORDS_PER_MINUTE); // Calculate reading time in minutes
  return readingTime;
};

// Function to get first 20 words of the post content
/* function getExcerpt(content) {
  const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  const words = text.trim().split(/\s+/); // Split into words
  const excerpt = words.slice(0, 20).join(' ') + '...'; // Get first 20 words and ellipsis
  //return excerpt + '...'; // Add ellipsis
  return excerpt;
} */

  // Function to get first 100 characters from the post content
export function getExcerpt(content, length = 100) {  
  const excerpt = content.length > length ? content.substring(0, length) + '...' : content; // Truncate content to the specified length
  return excerpt;
}

/*  Routes */
  // Get Routes
  app.get('/', async(req, res) => {
    try {
      const posts = await getPosts();
      // Get the most recent posts (or all if less than 3)
      const recentPosts = posts.slice(-3).reverse(); //Can change this to featured posts 
      res.render('index.ejs', { 
        posts: recentPosts,
        showActions: false, // Hide edit/delete buttons
        isHyperlink: false, // Hide hyperlinks
       });
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

  app.get('/posts/edit/:id', async (req, res) => {
    try {
      const posts = await getPosts();
      const post = posts.find(p => p.id === req.params.id);
      if (!post) return res.status(404).send('Post not found');
      res.render('editPostForm.ejs', { 
        postTitle: post.title, 
        postContent: post.content, 
        postId: post.id, 
        postCategory: post.category,
        postImage: post.image,
        
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).send('Error loading edit page');
    }
  });

  app.get('/posts', async (req, res) => {
    //res.render('posts.ejs');
    try {
      const posts = await getPosts();
      /* // Sort posts by createdAt date in descending order
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      // Render the posts page with the sorted posts
      //console.log({posts});
      console.log('Posts with IDs:', posts.map(p => ({id: p.id, title: p.title}))); */

      // Sort posts by the most recent date (either createdAt or updatedAt)
      const sortByUpdateOrPosted = posts.sort((a, b) => {
        const dateA = a.updatedAt ? Math.max(new Date(a.createdAt), new Date(a.updatedAt)) : new Date(a.createdAt);
        const dateB = b.updatedAt ? Math.max(new Date(b.createdAt), new Date(b.updatedAt)) : new Date(b.createdAt);
        return dateB - dateA; // Sort in descending order
      });

      // Render the posts page with the sorted posts
      res.render('posts.ejs', { 
        posts,
        showActions: true, // Show edit/delete buttons
        isHyperlink: true, // Show hyperlinks
       });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.render('posts.ejs', { posts: [] });
    }
  });

  // Render a specific blog post
  app.get('/posts/:id', async (req, res) => {
    try {
      const posts = await getPosts();
      const post = posts.find(p => p.id === req.params.id);
      if (!post) return res.status(404).send('Post not found');
      res.render('blogPost.ejs', { post: post });
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).send('Error loading post');
    }
  });

  app.get ('/createPostForm', (req, res) => {
    res.render('createPostForm.ejs');
  });


  /* Form submission handling - Post Routes */
    // Handle POST requests to the `/createPostForm` endpoint
    app.post('/createPostForm', async (req, res) => {
      /* console.log(req.body);
      res.send(req.body); */
      const { title, category, image, excerpt, content } = req.body;

      try {
        const posts = await getPosts();
        const newPost = { 
          ...req.body, // Spread operator to include all fields from the form
          id: Date.now().toString(), // Unique ID based on timestamp
          category: category || 'Uncategorized', // Default category if none provided
          image: image || '/images/default.jpg', // Default image if none provided
          createdAt: new Date().toISOString(), // Add a timestamp for sorting
          readingTime: calculateReadingTime(content), // Calculate reading time
          excerpt: getExcerpt(content), // Get the excerpt from the content
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

    // Handle POST requests to the `/subscribe` endpoint
    app.post('/subscribe', (req, res) => {
      // Destructure the subscription form data from the request body
      const { email } = req.body;

      // Create a subscription data object with the email field
      const subscriptionData = {
        email,
        timestamp: new Date().toISOString(), // Add a timestamp for when the form was submitted
      };

      // Call the saveSubscriptionForm function to store the subscription data
      saveSubscriptionForm(subscriptionData)
        .then(() => {
          // On successful save:
          console.log(`Subscription form submitted: Email: ${email}`);

          // Render the thank you page
          res.render('thanks.ejs');
          
        })
        .catch((error) => {
          // If saving fails:
          console.error('Error saving subscription form data:', error);
          res.status(500).send('Error saving your subscription form data');
        });
    });

    // Delete Routes
    app.post('/posts/delete/:id', async (req, res) => {
      try {
        const posts = await getPosts();
        
        // Find the index of the post to delete
        // Use the findIndex method to locate the post by its ID
        const index = posts.findIndex(post => post.id === req.params.id);

        if (index === -1) {
          return res.status(404).send('Post not found');
        }

        // Remove the post from the array
        posts.splice(index, 1);   
        await savePosts(posts); // Save the updated posts array back to the file
        res.redirect('/posts'); // Redirect to the posts page after deletion
      } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).send('Error deleting your post');
      }
    });

    // Update Routes
    // Handle POST requests to update a post
    app.post('/posts/update/:id', async (req, res) => {
      try {
        const posts = await getPosts();
        const index = posts.findIndex(p => p.id === req.params.id);
        if (index === -1) return res.status(404).send('Post not found');
        
        // Create a new post object with updated data
        const updatedPost = {
          ...posts[index], // Keep existing post data
          ...req.body, // Update with new data from the form
          readingTime: calculateReadingTime(req.body.content), // Recalculate reading time
          excerpt: getExcerpt(req.body.content), // Update the excerpt
          updatedAt: new Date().toISOString(), // Add a timestamp for when the post was updated
        };

        posts[index] = updatedPost; // Replace the old post with the updated one

        // Remove the old post from the array
        //posts.splice(index, 1); 

        // Add the updated post to the beginning of the array
        //posts.unshift(updatedPost); 


        await savePosts(posts);
        res.redirect('/posts');
      } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).send('Error updating post');
      }
    });


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
