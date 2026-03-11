//import { readSubscriptions, writeSubscriptions } from "../services/fileServices.js";
import db from "../config/db.js";

export async function subcription() {
  try {
    const result = await db.query(
      `INSERT INTO subscriptions (email)
      VALUES ($1) ON CONFLICT (email) DO NOTHING RETRURNING *` [email]
    );
    return result.rows[0];
  } catch(err) {
    console.log("Error creating subscription: ", err);
    throw err;
  }
};

// Contact form submission handler
/* export async function handleSubscribeFormSubmission(subscribeData) {
  try {
    const subscribers = await readSubscriptions();

    // Add timestamp to submission
    const submissionWithTimestamp = {
      ...subscribeData,
      submittedAt: new Date().toISOString(),
    }
    subscribers.unshift(submissionWithTimestamp); // Add to the begining of the array
    await writeSubscriptions(subscribers); // Save updated list
    console.log("Subscriber form data saved successfully.");
    console.log({subscribers})
  } catch (error) {
    throw error;
  }
  
} */