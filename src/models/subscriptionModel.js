import { readSubscriptions, writeSubscriptions } from "../services/fileServices.js";

// Contact form submission handler
export async function handleSubscribeFormSubmission(subscribeData) {
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
  
}