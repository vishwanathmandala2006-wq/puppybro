const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Check environment
const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL;
const schemaType = isProduction ? 'schema.sql' : 'sqlite-schema.sql';
const schemaPath = path.join(__dirname, '..', 'database', schemaType);

console.log(`🔍 Environment: ${isProduction ? 'PRODUCTION (PostgreSQL)' : 'DEVELOPMENT (SQLite)'}`);
console.log(`📄 Using schema: ${schemaType}`);

if (isProduction) {
    // Production: PostgreSQL on Render
    const { Pool } = require('pg');
    const pool = new Pool();

    pool.connect((err, client, release) => {
        if (err) {
            console.error('❌ Error connecting to PostgreSQL:', err.message);
            process.exit(1);
        }
        console.log('✅ Connected to PostgreSQL database.');

        // Read and execute schema
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Split schema into statements and execute
        const statements = schema.split(';').filter(s => s.trim());
        let executed = 0;
        
        const executeNext = () => {
            if (executed >= statements.length) {
                console.log('✅ Database schema created successfully.');
                createUsers(client, release);
                return;
            }
            
            const statement = statements[executed].trim() + ';';
            executed++;
            
            client.query(statement, (err) => {
                if (err) {
                    console.error('Error executing schema statement:', err.message);
                    // Continue anyway
                }
                executeNext();
            });
        };
        
        executeNext();
        
        function createUsers(client, release) {
            // Create default admin user
            const adminPassword = bcrypt.hashSync('admin123', 10);
            const adminEmail = 'admin@puppybro.com';
            
            client.query(
                `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING`,
                ['Admin User', adminEmail, adminPassword, 'admin'],
                (err) => {
                    if (err) {
                        console.error('Error creating admin user:', err.message);
                    } else {
                        console.log('✅ Default admin user created:');
                        console.log('  Email: admin@puppybro.com');
                        console.log('  Password: admin123');
                    }
                    
                    // Create default NGO user
                    const ngoPassword = bcrypt.hashSync('ngo123', 10);
                    const ngoEmail = 'ngo@puppybro.com';
                    
                    client.query(
                        `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING`,
                        ['NGO Organization', ngoEmail, ngoPassword, 'ngo'],
                        (err) => {
                            if (err) {
                                console.error('Error creating NGO user:', err.message);
                            } else {
                                console.log('✅ Default NGO user created:');
                                console.log('  Email: ngo@puppybro.com');
                                console.log('  Password: ngo123');
                            }
                            
                            release();
                            pool.end(() => console.log('✅ Database initialization completed.'));
                        }
                    );
                }
            );
        }
    });
} else {
    // Development: SQLite
    const sqlite3 = require('sqlite3').verbose();
    const dbPath = path.join(__dirname, '..', 'database', 'puppybro.db');
    
    // Ensure database directory exists
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
    
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('❌ Error opening database:', err.message);
            process.exit(1);
        }
        console.log('✅ Connected to SQLite database.');
    });
    
    // Read and execute schema
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema, (err) => {
        if (err) {
            console.error('❌ Error executing schema:', err.message);
            db.close();
            process.exit(1);
        }
        console.log('✅ Database schema created successfully.');
        
        // Create default admin user
        const adminPassword = bcrypt.hashSync('admin123', 10);
        const adminEmail = 'admin@puppybro.com';
        
        db.run(
            `INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
            ['Admin User', adminEmail, adminPassword, 'admin'],
            function(err) {
                if (err) {
                    console.error('Error creating admin user:', err.message);
                } else {
                    console.log('✅ Default admin user created:');
                    console.log('  Email: admin@puppybro.com');
                    console.log('  Password: admin123');
                }
                
                // Create default NGO user
                const ngoPassword = bcrypt.hashSync('ngo123', 10);
                const ngoEmail = 'ngo@puppybro.com';
                
                db.run(
                    `INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
                    ['NGO Organization', ngoEmail, ngoPassword, 'ngo'],
                    function(err) {
                        if (err) {
                            console.error('Error creating NGO user:', err.message);
                        } else {
                            console.log('✅ Default NGO user created:');
                            console.log('  Email: ngo@puppybro.com');
                            console.log('  Password: ngo123');
                        }
                        
                        db.close((err) => {
                            if (err) {
                                console.error('Error closing database:', err.message);
                            } else {
                                console.log('✅ Database initialization completed.');
                            }
                        });
                    }
                );
            }
        );
    });
}
