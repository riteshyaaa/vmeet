import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool, Client } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER || "postgres"}:${encodeURIComponent(process.env.DB_PASSWORD || "")}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || "vmeet_db"}`;

let pool;

export const initDB = async () => {
  // Try connecting to target DB, or create DB if it doesn't exist
  const dbName = process.env.DB_NAME || "vmeet_db";
  const user = process.env.DB_USER || "postgres";
  const password = process.env.DB_PASSWORD || "";
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || 5432;

  // Check if DB exists by connecting to default 'postgres' database
  if (!process.env.DATABASE_URL) {
    const adminClient = new Client({
      user,
      password,
      host,
      port,
      database: "postgres",
    });

    try {
      await adminClient.connect();
      const res = await adminClient.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [dbName]
      );
      if (res.rowCount === 0) {
        console.log(`Database '${dbName}' not found. Creating database...`);
        await adminClient.query(`CREATE DATABASE "${dbName}"`);
        console.log(`Database '${dbName}' created successfully.`);
      }
      await adminClient.end();
    } catch (err) {
      console.warn("Could not auto-create database (admin check failed):", err.message);
      try {
        await adminClient.end();
      } catch {}
    }
  }

  // Initialize main pool
  pool = new Pool(
    process.env.DATABASE_URL
      ? { connectionString: process.env.DATABASE_URL }
      : { user, password, host, port, database: dbName }
  );

  // Test pool connection
  const client = await pool.connect();
  console.log(`Connected to PostgreSQL database: ${dbName}`);

  // Create tables if they do not exist
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      token VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS meetings (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255),
      meeting_code VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("PostgreSQL tables verified/initialized.");
  client.release();
  return pool;
};

export const query = (text, params) => {
  if (!pool) {
    throw new Error("Database pool is not initialized. Call initDB() first.");
  }
  return pool.query(text, params);
};

export default { query, initDB };
