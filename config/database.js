const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

// Promisify methods to maintain compatibility with existing code
pool.promisify = {
    get: async (sql, params) => {
        try {
            const pgSql = sql.replace(/\?/g, () => `$${params.length > 0 ? Object.keys(params).length + 1 : 1}`);
            let paramArray = params;
            if (Array.isArray(params)) {
                paramArray = params;
            }
            const result = await pool.query(sql.replace(/\?/g, (_, i) => `$${i + 1}`), paramArray);
            return result.rows[0] || null;
        } catch (err) {
            console.error('Database error in get:', err);
            throw err;
        }
    },
    all: async (sql, params) => {
        try {
            const result = await pool.query(sql.replace(/\?/g, (_, i) => `$${i + 1}`), params || []);
            return result.rows;
        } catch (err) {
            console.error('Database error in all:', err);
            throw err;
        }
    },
    run: async (sql, params) => {
        try {
            const result = await pool.query(sql.replace(/\?/g, (_, i) => `$${i + 1}`), params || []);
            return { lastID: result.rows[0]?.id, changes: result.rowCount };
        } catch (err) {
            console.error('Database error in run:', err);
            throw err;
        }
    }
};

console.log('PostgreSQL database configured successfully');

module.exports = pool;
