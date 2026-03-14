import pg from "pg";
import env from "dotenv";

env.config();

const { Pool } = pg

const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  connectionTimeoutMillis: 5000,
  max: 20, // Max no of clients in the pool
  idleTimeoutMillis: 3000,
});

db.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Successfully connected to the database');
    release();
  }
});

export default db;