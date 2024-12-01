import { drizzle } from "drizzle-orm/mysql2";  // Use drizzle with mysql2
import mysql from "mysql2/promise";  // Use promise-based MySQL2 connection pool

// Create a MySQL2 connection pool for db1
const pool1 = mysql.createPool({
  host: "ccscloud.dlsu.edu.ph",
  port: 22132,
  user: "root",
  password: "password",
  database: "gamesdb",
  waitForConnections: true,
  connectionLimit: 10,
});

// Initialize drizzle ORM with the MySQL2 pool for db1
const db1 = drizzle(pool1);

// Create a MySQL2 connection pool for db2
const pool2 = mysql.createPool({
  host: "ccscloud.dlsu.edu.ph",
  port: 22142,
  user: "root",
  password: "password",
  database: "gamesdb",
  waitForConnections: true,
  connectionLimit: 10,
});

// Initialize drizzle ORM with the MySQL2 pool for db2
const db2 = drizzle(pool2);

// Create a MySQL2 connection pool for db3
const pool3 = mysql.createPool({
  host: "ccscloud.dlsu.edu.ph",
  port: 22152,
  user: "root",
  password: "password",
  database: "gamesdb",
  waitForConnections: true,
  connectionLimit: 10,
});

// Initialize drizzle ORM with the MySQL2 pool for db3
const db3 = drizzle(pool3);

// Export all the database connections
export { db1, db2, db3 };
