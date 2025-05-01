import fs from "fs/promises";
import {
  POSTS_FILE,
  CONTACT_FILE,
  SUBSCRIPTION_FILE,
} from "../config/constants.js";

export async function readJsonFile(filePath, defaultData = []) {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      // File not found, create it with default data
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    } else {
      throw error; // Rethrow other errors
    }
  }
}

export async function writeJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export const readPosts = () => readJsonFile(POSTS_FILE);
export const writePosts = (posts) => writeJsonFile(POSTS_FILE, posts);
export const readContacts = () => readJsonFile(CONTACT_FILE);
export const writeContacts = (contacts) =>
  writeJsonFile(CONTACT_FILE, contacts);
export const readSubscriptions = () => readJsonFile(SUBSCRIPTION_FILE);
export const writeSubscriptions = (subscriptions) =>
  writeJsonFile(SUBSCRIPTION_FILE, subscriptions);
