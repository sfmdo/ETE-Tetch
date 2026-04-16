import path from 'path';
import { pathToFileURL } from 'url';
import { QueryError, RowDataPacket } from 'mysql2';

async function runDatabaseTest() {
    try {
        const rootPath = process.cwd();
        
        const dbConfigPath = path.join(rootPath, 'config', 'database');
        const dbConfigUrl = pathToFileURL(dbConfigPath).href;

        console.log('Starting database connection test...');
        console.log('Using database config from: ' + dbConfigPath);

        const { default: connection } = await import(dbConfigUrl);

        const testQuery = 'SELECT 1 + 1 AS result';

        connection.query(testQuery, (error: QueryError | null, results: unknown) => {
            if (error) {
                console.error('Test failed during query execution:');
                console.error('Error Code: ' + error.code);
                console.error('Message: ' + error.message);
                process.exit(1);
            }

            const rows = results as RowDataPacket[];
            const value = rows[0].result;
            
            if (value === 2) {
                console.log('Database test successful');
                console.log('The database responded correctly to the test query');
            } else {
                console.error('Database test returned unexpected data');
            }

            connection.end((err: QueryError | null) => {
                if (err) {
                    console.error('Error closing the connection: ' + err.message);
                } else {
                    console.log('Connection closed successfully');
                }
            });
        });
    } catch (err) {
        console.error('Failed to initialize test:', err);
        process.exit(1);
    }
}

// 2. Execute the function
runDatabaseTest();