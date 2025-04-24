import express from 'express';

const app = express();
const port = 3000;

app.use(express.static('public')); // Serve static files from the "public" directory
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data
app.set('view engine', 'ejs'); // Set EJS as the templating engine

// Routes
app.get('/', (req, res) => {
  res.render('index.ejs');
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
app.post('/form', (req, res) => {
  /* console.log(req.body);
  res.send(req.body); */
  const { title, category, image, excerpt, content } = req.body;
  console.log("Submitted Data:", {title, category, image, excerpt, content});
  res.render('thanks.ejs');
  //res.send('Form submitted successfully!');
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
