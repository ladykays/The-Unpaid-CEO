import * as subscriptionModel from "../models/subscriptionModel.js";

// Function to handle contact form submission
export async function handleSubscriberFormSubmission(req, res) {
  try {
    await subscriptionModel.handleSubscribeFormSubmission(req.body); // Pass form data
    res.render('thanks.ejs');
  } catch (error) {
    console.error("Error saving subscriber: ", error);
    res.status(500).json({ success: false, message: "Failed to subscribe"})
  }
}