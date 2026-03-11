import * as subscriptionModel from "../models/subscriptionModel.js";

// Function to handle contact form submission
export async function handleSubscriberFormSubmission(req, res) {
  try {
    const {email} = req.body;

    // Validate email
    if (!email) {
      return res.status(400).render("footer.ejs", {
        subscriptionError: "Email is required",
        currentPage: req.body.currentPage,
        user: req.session.user || null
      });
    }

    await subscriptionModel.subcription(email);

    // Redirect back to the page they are coming from with success message
    res.redirect(`${req.get("referer") || "/"}?subscription=success`)
  } catch (error) {
    console.error("Error saving subscriber: ", error);

    // Handle duplicate email error
    if (error.code === "23505") {
      return res.redirect(`${req.get("referer") || "/"}?subscription=duplicate`);
    }
    
    res.redirect(`${req.get("referer") || "/"}?subscription=error`);
  }
  /* try {
    await subscriptionModel.handleSubscribeFormSubmission(req.body); // Pass form data
    res.render('thanks.ejs');
  } catch (error) {
    console.error("Error saving subscriber: ", error);
    res.status(500).json({ success: false, message: "Failed to subscribe"})
  } */
}