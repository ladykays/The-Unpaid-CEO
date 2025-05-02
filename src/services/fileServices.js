import fs from "fs/promises";
import {
  POSTS_FILE,
  CONTACT_FILE,
  SUBSCRIPTION_FILE,
} from "../config/constants.js";

// Function to read a JSON file and return its content
// Returns the parsed data or default data if the file is created
export async function readJsonFile(filePath, defaultData = []) {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // Create file with default data if file doesn't exist
    if (error.code === "ENOENT") { //ENOENT means "Error NO ENTry" (file not found)
      console.log(`File not found. Creating ${filePath} with default data.`);
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2)); 
      return defaultData;
    } else {
      throw error; // Rethrow other errors
    }
  }
}

// Function to write data to a JSON file
export async function writeJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Read posts from POSTS_FILE
export const readPosts = () => readJsonFile(POSTS_FILE); 

// Write posts to POSTS_FILE
export const writePosts = (posts) => writeJsonFile(POSTS_FILE, posts);

// Read contacts from CONTACT_FILE
export const readContacts = () => readJsonFile(CONTACT_FILE);

// Write contacts to CONTACT_FILE
export const writeContacts = (contacts) =>
  writeJsonFile(CONTACT_FILE, contacts);

// Read subscriptions from SUBSCRIPTION_FILE
export const readSubscriptions = () => readJsonFile(SUBSCRIPTION_FILE);

// Write subscriptions to SUBSCRIPTION_FILE
export const writeSubscriptions = (subscriptions) =>
  writeJsonFile(SUBSCRIPTION_FILE, subscriptions);
