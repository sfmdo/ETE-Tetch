import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();

const requiredVariables: string[] = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

const missingVariables: string[] = requiredVariables.filter(
    (variable: string) => !process.env[variable]
);

if (missingVariables.length > 0) {
    console.error(`CRITICAL ERROR: The following environment variables are missing: ${missingVariables.join(', ')}`);
    console.error('Please make sure to declare them in your .env file.');
    process.exit(1);
}

const connection: mysql.Connection = mysql.createConnection({
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string
});

connection.connect((err: mysql.QueryError | null) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
    } else {
        console.log("Database connection successful");
    }
});

export default connection;