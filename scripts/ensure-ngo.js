/**
 * Ensures NGO user exists (fixes "server error during NGO login" for older DBs)
 * Run: node scripts/ensure-ngo.js
 */

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'puppybro.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
});

db.get('SELECT id FROM users WHERE email = ?', ['ngo@puppybro.com'], (err, row) => {
    if (err) {
        console.error('Error:', err.message);
        db.close();
        process.exit(1);
    }
    if (row) {
        console.log('NGO user already exists.');
        db.close();
        return;
    }

    const hash = bcrypt.hashSync('ngo123', 10);
    db.run(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['NGO Organization', 'ngo@puppybro.com', hash, 'ngo'],
        (err) => {
            if (err) {
                if (err.message.includes('CHECK constraint') || err.message.includes('role')) {
                    console.error('Schema may not allow role=ngo. Run: npm run migrate');
                } else {
                    console.error('Error:', err.message);
                }
            } else {
                console.log('NGO user created: ngo@puppybro.com / ngo123');
            }
            db.close();
        }
    );
});
