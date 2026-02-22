const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'database', 'puppybro.db');
const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
    console.log('Connected to SQLite database.');
});

// Read and execute schema
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema, (err) => {
    if (err) {
        console.error('Error executing schema:', err.message);
        db.close();
        process.exit(1);
    }
    console.log('Database schema created successfully.');
    
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
                console.log('Default admin user created:');
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
                        console.log('Default NGO user created:');
                        console.log('  Email: ngo@puppybro.com');
                        console.log('  Password: ngo123');
                    }
                    
                    db.close((err) => {
                        if (err) {
                            console.error('Error closing database:', err.message);
                        } else {
                            console.log('Database initialization completed.');
                        }
                    });
                }
            );
        }
    );
});
