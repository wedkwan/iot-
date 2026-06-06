import mysql from "mysql2/promise";
import dotenv from "dotenv";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "smartuser",
  password: process.env.DB_PASSWORD || "smartpass",
  database: process.env.DB_NAME || "smartcampus",
  port: process.env.DB_PORT || 3308,
  timezone: '-03:00', // ← resolve para todos os repositories
  connectionLimit: 10
});

export default pool;