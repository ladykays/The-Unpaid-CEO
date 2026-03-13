import * as userModel from "../models/userModel.js";
import * as postModel from "../models/postModel.js";
import bcrypt from "bcrypt";

// Handle user registration
export async function register(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    // Check if all fields have been entered
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).render("login.ejs", {
        error: "All fields are required",
        formData: {
          ...req.body,
          activeTab: "signup"
        },
        activeTab: "signup",
        currentPage: "login",
        user: null
      });
    };

    // Check if password matches
    if (password !== confirmPassword) {
      return res.status(400).render("login.ejs", {
        error: "Passwords do not match",
        formData: {
          ...req.body,
          activeTab: "signup"
        },
        activeTab: "signup",
        currentPage: "login",
        user: null
      });
    };

    // Check if password is less than 8 characters
    if (password.length < 8) {
      return res.status(400).render("login.ejs", {
        error: "Passwords must be at least 8 characters",
        formData: {
          ...req.body,
          activeTab: "signup",
        },
        activeTab: "signup",
        currentPage: "login",
        user: null
      });
    };

    // Create user
    const newUser = await userModel.createUser({name, email, password});

    // Log the new user in by setting session
    req.session.user = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    };

    res.redirect("/");
  } catch (err) {
    console.error("Registration error: ", err);

    // Handle duplicate email error
    if (err.message === "Email already exists. Please sign in instead!") {
      return res.status(400).render("login.ejs", {
        error: err.message,
        formData: {
          ...req.body,
          activeTab: "signup",
        },
        activeTab: "signup",
        currentPage: "login",
        user: null
      });
    }

    res.status(500).render("login.ejs", {
      error: "Registration failed. Please try again.",
      formData: {
        ...req.body,
        activeTab: "signup",
      },
      activeTab: "signup",
      currentPage: "login",
      user: null
    });
  };
};

// Handle user login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(401).render("login.ejs", {
      error: "Email and password are required",
      formData: {
        ...req.body,
        activeTab: "login",
      },
      activeTab: "login",
      currentPage: "login",
      user: null
    });
  };

  const user = await userModel.getUserByEmail(email);

  // Check if user is found
  if (!user) {
    return res.status(401).render("login", {
      error: "Invalid email or password",
      formData: {
        ...res.body,
        activeTab: "login",
      },
      activeTab: "login",
      currentPage: "login",
      user: null
    });
  };

  // Compare passwords
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).render("login.ejs", {
      error: "Invalid email or password",
      formData: {
        ...req.body,
        activeTab: "login",
      },
      activeTab: "login",
      currentPage: "login",
      user: null
    });
  };

  // Set user session
  req.session.user = {
    id: user.id,
    name: user.name,
    eamil: user.email
  };

  // Redirect to previous page or home
  const redirectTo = req.session.returnTo || "/";
  delete req.session.returnTo;
  res.redirect(redirectTo);

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).render("login.ejs", {
      error: "Login failed. Please try again.",
      formData: {
        ...req.body,
        activeTab: "login",
      },
      activeTab: "login",
      currentPage: "login",
      user: null
    });
  }
}

// Handle user logout
export async function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    };

    res.redirect("/");
  });
};

// Get current user profile
export async function getProfile(req, res) {
  try {
    if(!req.session.user) {
      return res.redirect("/login");
    };

    const user = await userModel.getUserById(req.session.user.id);

    if (!user) {
      req.session.destroy();
      return res.redirect("/login");
    };

    // Get users posts
    const userPosts = await postModel.getPostsByUserId(user.id); 

    res.render("profile.ejs", {
      user: user,
      posts: userPosts,
      currentPage: profile
    });
  } catch (err) {
    console.error("Error loading profile", err);
    res.status(500).render("error.ejs", {
      message: "Error loading profile",
      currentPage: "error",
      user: req.session.user || null 
    });
  };
};


// Middleware to check if user is authenticated
export function requireAuth(req, res, next) {
  if (!req.session.user) {
    req.session.returnTo = req.originalUrl;
    return res.redirect("/login");
  };
  next();
};

// Middleware to check if user is not logged in
export function requireGuest(req, res, next) {
  if (req.session.user) {
    return res.redirect("/");
  };
  next();
};