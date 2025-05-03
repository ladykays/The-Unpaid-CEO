import { readContacts, writeContacts } from "../services/fileServices.js";

// Contact form submission handler
export async function handleContactFormSubmission(contactData) {
  try {
    const contacts = await readContacts();

    // Add timestamp to submission
    const submissionWithTimestamp = {
      ...contactData,
      submittedAt: new Date().toISOString(),
    }
    contacts.push(submissionWithTimestamp);
    await writeContacts(contacts);
    console.log("Contact form data saved successfully.");
    console.log({contacts})
  } catch (error) {
    console.error("Error saving contact form data:", error);
  }
  
}