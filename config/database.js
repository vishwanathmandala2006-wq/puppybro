const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let db;
let isPostgres = false;

// Determine which database to use
if (process.env.DATABASE_URL) {
    // Use PostgreSQL in production/Render
    isPostgres = true;
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
    });

    db = pool;
    console.log('✅ PostgreSQL database configured');
} else {
    // Use SQLite for local development
    isPostgres = false;
    const dbDir = path.join(__dirname, '..', 'database');
    
    // Ensure database directory exists
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    const dbPath = path.join(dbDir, 'puppybro.db');
    const schemaPath = path.join(dbDir, 'sqlite-schema.sql');
    
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error connecting to SQLite database:', err.message);
            process.exit(1);
        }
        
        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON');
        
        // Initialize schema synchronously using exec
        try {
            const schema = fs.readFileSync(schemaPath, 'utf8');
            db.exec(schema, (err) => {
                if (err) {
                    console.error('Error executing schema:', err.message);
                } else {
                    console.log('✅ SQLite schema initialized');
                }
            });
        } catch (err) {
            console.error('Error reading schema file:', err.message);
        }
    });
}

// Helper to convert SQLite ? placeholders to PostgreSQL $1, $2, etc.
const convertPlaceholders = (sql) => {
    if (!isPostgres) return sql; // SQLite uses ?
    let paramIndex = 1;
    return sql.replace(/\?/g, () => `$${paramIndex++}`);
};

// Unified database interface
db.promisify = {
    get: async (sql, params = []) => {
        try {
            if (isPostgres) {
                const pgSql = convertPlaceholders(sql);
                const result = await db.query(pgSql, params);
                return result.rows[0] || null;
            } else {
                // SQLite
                return new Promise((resolve, reject) => {
                    db.get(sql, params, (err, row) => {
                        if (err) {
                            console.error('Database error in get:', err.message);
                            reject(err);
                        } else {
                            resolve(row || null);
                        }
                    });
                });
            }
        } catch (err) {
            console.error('Database error in get:', err.message);
            throw err;
        }
    },
    all: async (sql, params = []) => {
        try {
            if (isPostgres) {
                const pgSql = convertPlaceholders(sql);
                const result = await db.query(pgSql, params);
                return result.rows;
            } else {
                // SQLite
                return new Promise((resolve, reject) => {
                    db.all(sql, params, (err, rows) => {
                        if (err) {
                            console.error('Database error in all:', err.message);
                            reject(err);
                        } else {
                            resolve(rows || []);
                        }
                    });
                });
            }
        } catch (err) {
            console.error('Database error in all:', err.message);
            throw err;
        }
    },
    run: async (sql, params = []) => {
        try {
            if (isPostgres) {
                const pgSql = convertPlaceholders(sql);
                const result = await db.query(pgSql, params);
                return { lastID: result.rows[0]?.id, changes: result.rowCount };
            } else {
                // SQLite
                return new Promise((resolve, reject) => {
                    db.run(sql, params, function(err) {
                        if (err) {
                            console.error('Database error in run:', err.message);
                            reject(err);
                        } else {
                            resolve({ lastID: this.lastID, changes: this.changes });
                        }
                    });
                });
            }
        } catch (err) {
            console.error('Database error in run:', err.message);
            throw err;
        }
    }
};

module.exports = db;
