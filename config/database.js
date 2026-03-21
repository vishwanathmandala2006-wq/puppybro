const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

// Helper to convert SQLite ? placeholders to PostgreSQL $1, $2, etc.
const convertPlaceholders = (sql) => {
    let paramIndex = 1;
    return sql.replace(/\?/g, () => `$${paramIndex++}`);
};

// Promisify methods to maintain compatibility with existing code
pool.promisify = {
    get: async (sql, params = []) => {
        try {
            const pgSql = convertPlaceholders(sql);
            const result = await pool.query(pgSql, params);
            return result.rows[0] || null;
        } catch (err) {
            console.error('Database error in get:', err.message);
            throw err;
        }
    },
    all: async (sql, params = []) => {
        try {
            const pgSql = convertPlaceholders(sql);
            const result = await pool.query(pgSql, params);
            return result.rows;
        } catch (err) {
            console.error('Database error in all:', err.message);
            throw err;
        }
    },
    run: async (sql, params = []) => {
        try {
            const pgSql = convertPlaceholders(sql);
            const result = await pool.query(pgSql, params);
            // For INSERT/UPDATE/DELETE, return rows affected
            return { lastID: null, changes: result.rowCount };
        } catch (err) {
            console.error('Database error in run:', err.message);
            throw err;
        }
    }
};

console.log('PostgreSQL database configured successfully');

module.exports = pool;
