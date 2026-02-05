import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "mysql",
  user: process.env.DB_USER || "smartuser",
  password: process.env.DB_PASSWORD || "smartpass",
  database: process.env.DB_NAME || "smartcampus",
  port: process.env.DB_PORT || 3306,
});

export default pool;