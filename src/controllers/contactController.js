import * as contactModel from "../models/contactModel.js";

// Function to handle contact form submission
export async function handleContactFormSubmission(req, res) {
  try {
    await contactModel.handleContactFormSubmission(req.body); // Pass form data
    res.render('thanks.ejs');
  } catch (error) {
    console.error("Error saving contact: ", error);
    res.status(500).json({ success: false, message: "Failed to save message"})
  }
}