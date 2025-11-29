import mysql from 'mysql2/promise';
export const pool = mysql.createPool({
    host: 'localhost',       // seu host
    user: 'root',            // usuário MySQL
    password: '01010111',    // senha MySQL
    database: 'smartcampus', // nome do banco
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});