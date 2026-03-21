-- PuppyBro Database Schema (SQLite for Development)
-- Dog Welfare Management System

-- Users table (General users)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin', 'ngo')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    availability TEXT,
    experience TEXT,
    areas_covered TEXT,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Rescue Reports table
CREATE TABLE IF NOT EXISTS rescue_reports (
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
);

-- Lost Pets table
CREATE TABLE IF NOT EXISTS lost_pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    pet_name TEXT,
    breed TEXT,
    color TEXT NOT NULL,
    size TEXT CHECK(size IN ('Small', 'Medium', 'Large')),
    location_area TEXT NOT NULL,
    location_description TEXT,
    description TEXT,
    image_url TEXT,
    contact_phone TEXT NOT NULL,
    status TEXT DEFAULT 'Lost' CHECK(status IN ('Lost', 'Found', 'Closed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Found Pets table
CREATE TABLE IF NOT EXISTS found_pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    breed TEXT,
    color TEXT NOT NULL,
    size TEXT CHECK(size IN ('Small', 'Medium', 'Large')),
    location_area TEXT NOT NULL,
    location_description TEXT,
    description TEXT,
    image_url TEXT,
    contact_phone TEXT NOT NULL,
    status TEXT DEFAULT 'Found' CHECK(status IN ('Found', 'Claimed', 'Closed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Adoption Listings table
CREATE TABLE IF NOT EXISTS adoption_listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dog_name TEXT NOT NULL,
    breed TEXT,
    age TEXT,
    gender TEXT CHECK(gender IN ('Male', 'Female', 'Unknown')),
    color TEXT,
    size TEXT CHECK(size IN ('Small', 'Medium', 'Large')),
    description TEXT,
    health_status TEXT,
    image_url TEXT,
    location_area TEXT,
    created_by INTEGER,
    status TEXT DEFAULT 'Available' CHECK(status IN ('Available', 'Pending', 'Adopted')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Adoption Applications table
CREATE TABLE IF NOT EXISTS adoption_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    applicant_name TEXT,
    applicant_email TEXT,
    applicant_phone TEXT,
    applicant_address TEXT,
    reason TEXT,
    experience TEXT,
    status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Approved', 'Rejected', 'Withdrawn')),
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    application_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (listing_id) REFERENCES adoption_listings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sterilization Drives table
CREATE TABLE IF NOT EXISTS sterilization_drives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_area TEXT NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Scheduled' CHECK(status IN ('Scheduled', 'Completed', 'Cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sterilization Records table
CREATE TABLE IF NOT EXISTS sterilization_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id TEXT UNIQUE NOT NULL,
    drive_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    dog_description TEXT,
    age_estimate TEXT,
    gender TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'Scheduled' CHECK(status IN ('Scheduled', 'Completed', 'Failed', 'Pending')),
    veterinarian_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (drive_id) REFERENCES sterilization_drives(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Legacy sterilization_reports table for compatibility
CREATE TABLE IF NOT EXISTS sterilization_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    location_area TEXT NOT NULL,
    location_description TEXT,
    dog_count INTEGER,
    description TEXT,
    status TEXT DEFAULT 'Reported' CHECK(status IN ('Reported', 'Noted', 'Planned', 'Completed')),
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_rescue_reports_user ON rescue_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_rescue_reports_status ON rescue_reports(status);
CREATE INDEX IF NOT EXISTS idx_lost_pets_user ON lost_pets(user_id);
CREATE INDEX IF NOT EXISTS idx_found_pets_user ON found_pets(user_id);
CREATE INDEX IF NOT EXISTS idx_adoption_listings_status ON adoption_listings(status);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_user ON adoption_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_sterilization_records_drive ON sterilization_records(drive_id);
