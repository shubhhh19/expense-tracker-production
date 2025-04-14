const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Create a connection pool
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432
});

async function runSql() {
    try {
        // Read the SQL file
        const sqlPath = path.join(__dirname, 'remove_verification_columns.sql');
        const sql = fs.readFileSync(sqlPath, 'utf-8');

        // Execute the SQL
        const client = await pool.connect();
        await client.query(sql);

        client.release();
    } catch (error) {
        // Error handling
        process.exit(1);
    } finally {
        pool.end();
    }
}

runSql();