import * as contactModel from "../models/contactModel.js";

// Function to handle contact form submission
export async function handleContactFormSubmission(req, res) {
  try {
    const {name, email, subject, message} = req.body;

    //Validate required fields
    if(!name || !email || !subject || !message) {
      return res.status(400).render("contact.ejs", {
        error: "All fields are required",
        formData: req.body,
        currentPage: "contact",
        user: req.session.user || null
      });
    }

    await contactModel.contact(name, email, subject, message);
    res.render("thanks.ejs", {
      currentPage: "thanks",
      user: req.session.user || null
    });

  } catch (error) {
    console.error("Error saving contact: ", error);
    res.status(500).render("contact.ejs", { 
      error: "Failed to send message. Please try again",
      formData: req.body,
      currentPage:"contact",
      user: req.session.user || null
    });
  }
  
  /* try {
    await contactModel.handleContactFormSubmission(req.body); // Pass form data
    res.render('thanks.ejs');
  } catch (error) {
    console.error("Error saving contact: ", error);
    res.status(500).json({ success: false, message: "Failed to save message"})
  } */
}