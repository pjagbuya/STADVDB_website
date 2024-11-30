import { drizzle } from "drizzle-orm/mysql2";  // Use drizzle with mysql2
import mysql from "mysql2/promise";  // Use promise-based MySQL2 connection pool

// Create a MySQL2 connection pool
const pool = mysql.createPool({
  host: "ccscloud.dlsu.edu.ph",
  port: 22152,
  user: "root",
  password: "password",
  database: "gamesdb",
  waitForConnections: true,
  connectionLimit: 10,
});

// Initialize drizzle ORM with the MySQL2 pool
const db = drizzle(pool);

// Now you can use the `db` object to interact with your database
export default db;
