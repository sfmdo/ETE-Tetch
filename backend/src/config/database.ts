import dotenv from 'dotenv';
import mysql from 'mysql2';
import path from 'path';

// Find .env file starting from this file's directory going up to the backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredVariables: string[] = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

const missingVariables: string[] = requiredVariables.filter(
    (variable: string) => process.env[variable] === undefined
);

if (missingVariables.length > 0) {
    console.error(`CRITICAL ERROR: The following environment variables are missing: ${missingVariables.join(', ')}`);
    console.error('Please make sure to declare them in your .env file.');
    process.exit(1);
}

const pool: mysql.Pool = mysql.createPool({
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to the database pool:", err.message);
    } else {
        console.log("Database pool connection successful");
        connection.release(); 
    }
});

export default pool;