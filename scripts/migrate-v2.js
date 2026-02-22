/**
 * Migration V2: Add Aggressive Dogs, Geolocation, Priority
 * Run: node scripts/migrate-v2.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'puppybro.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
});

db.serialize(() => {
    // Check if columns already exist
    db.all("PRAGMA table_info(rescue_reports)", (err, columns) => {
        if (err) {
            console.error('Error:', err);
            db.close();
            return;
        }

        const hasLatitude = columns.some(c => c.name === 'latitude');
        const hasLongitude = columns.some(c => c.name === 'longitude');
        const hasPriority = columns.some(c => c.name === 'priority');

        if (hasLatitude && hasLongitude && hasPriority) {
            console.log('Migration V2 already applied. No changes needed.');
            db.close();
            return;
        }

        // Create new table with updated schema
        db.run(`
            CREATE TABLE IF NOT EXISTS rescue_reports_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                case_id TEXT UNIQUE NOT NULL,
                user_id INTEGER NOT NULL,
                location_area TEXT NOT NULL,
                location_description TEXT,
                latitude REAL,
                longitude REAL,
                issue_type TEXT NOT NULL CHECK(issue_type IN ('Injured', 'Stray', 'Aggressive')),
                priority TEXT DEFAULT 'Normal' CHECK(priority IN ('High', 'Normal')),
                description TEXT NOT NULL,
                image_url TEXT,
                status TEXT DEFAULT 'Reported' CHECK(status IN ('Reported', 'Assigned', 'Resolved', 'Closed')),
                assigned_volunteer_id INTEGER,
                admin_notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (assigned_volunteer_id) REFERENCES volunteers(id) ON DELETE SET NULL
            )
        `, (err) => {
            if (err) {
                console.error('Error creating new table:', err);
                db.close();
                return;
            }

            db.run(`
                INSERT INTO rescue_reports_new 
                (id, case_id, user_id, location_area, location_description, latitude, longitude, issue_type, priority, description, image_url, status, assigned_volunteer_id, admin_notes, created_at, updated_at)
                SELECT id, case_id, user_id, location_area, location_description, NULL, NULL, issue_type, 'Normal', description, image_url, status, assigned_volunteer_id, admin_notes, created_at, updated_at
                FROM rescue_reports
            `, (err) => {
                if (err) {
                    console.error('Error copying data:', err);
                    db.close();
                    return;
                }

                db.run('DROP TABLE rescue_reports', (err) => {
                    if (err) {
                        console.error('Error dropping old table:', err);
                        db.close();
                        return;
                    }

                    db.run('ALTER TABLE rescue_reports_new RENAME TO rescue_reports', (err) => {
                        if (err) {
                            console.error('Error renaming table:', err);
                        } else {
                            console.log('Migration V2 completed successfully.');
                            console.log('- Added: Aggressive Dogs issue type');
                            console.log('- Added: latitude, longitude for geolocation');
                            console.log('- Added: priority (High for Aggressive)');
                        }
                        db.close();
                    });
                });
            });
        });
    });
});
