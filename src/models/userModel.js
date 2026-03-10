import db from "../config/db";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// Fetch all users (admin only)
export async function getAllUsers() {
  try {
    const result = await db.query(
      `SELECT id, name, email, created_at, updated_at 
      FROM users
      ORDER BY COALESCE (updated_at, created_at) DESC 
      `
    );
    if (!result) return null;

    return result.rows.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }));
  } catch (err) {
    console.log("Error fetching all users: ", err);
    throw err;
  }
};

// Fetch user by id
export async function getUserById(id) {
  try {
    const result = await db.query(
      `SELECT id, name, email, created_at, updated_at
      FROM users
      WHERE id = $1`, [id]
    );
    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }
  } catch (err) {
    console.log("Error fetching user by id: ", err);
    throw err;
  }
};

// Fetch user by email
export async function getUserByEmail(email) {
  try {
    const result = await db.query(
      `SELECT * FROM users
      WHERE email = $1`, [email]
    );
    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password, // for authentication
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  } catch (err) {
    console.log("Error fetching user by email: ", err);
    throw err;
  }
}

// Create a new user (registration)
export async function createUser(userData) {
  try {
    const { name, email, password } = userData;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await db.query(
      `INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3) RETURNING *`, [name, email, hashedPassword]
    );

    const user = result.rows[0];
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at
    };

  } catch (err) {
    // Check for unique violation (duplicate email)
    if (err.code === "23505") { //Postgres unique violation code
      throw new Error("Email already exists. Please sign in instead!")
    }
    console.log("Error creating user: ", err);
    throw err;
  }
}