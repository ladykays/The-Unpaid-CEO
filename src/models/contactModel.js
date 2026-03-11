//import { readContacts, writeContacts } from "../services/fileServices.js";
import db from "../config/db.js";

export async function contact() {
  try {
    const result = await db.query(
      `INSERT INTO contacts (name, email, subject, message)
      VALUES($1, $2, $3, $4) RETURNING *`, [name, email, subject, message]
    );
    return result.rows[0];
  } catch (err) {
    console.log("Error making submission: ", err);
    throw err;
  }
  

}
/* 
// Contact form submission handler
export async function handleContactFormSubmission(contactData) {
  try {
    const contacts = await readContacts();

    // Add timestamp to submission
    const submissionWithTimestamp = {
      ...contactData,
      submittedAt: new Date().toISOString(),
    }
    contacts.unshift(submissionWithTimestamp);
    await writeContacts(contacts);
    console.log("Contact form data saved successfully.");
    console.log({contacts})
  } catch (error) {
    console.error("Error saving contact form data:", error);
  }
  
} */