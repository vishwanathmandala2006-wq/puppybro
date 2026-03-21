-- PuppyBro Database Schema (PostgreSQL)
-- Dog Welfare Management System

-- Users table (General users)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role VARCHAR(50) DEFAULT 'user' CHECK(role IN ('user', 'admin', 'ngo')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    availability TEXT,
    experience TEXT,
    areas_covered TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Rescue Reports table (Stray/Injured/Aggressive dogs)
CREATE TABLE IF NOT EXISTS rescue_reports (
    id SERIAL PRIMARY KEY,
    case_id VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    location_area VARCHAR(255) NOT NULL,
    location_description TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    issue_type VARCHAR(50) NOT NULL CHECK(issue_type IN ('Injured', 'Stray', 'Aggressive')),
    priority VARCHAR(50) DEFAULT 'Normal' CHECK(priority IN ('High', 'Normal')),
    description TEXT NOT NULL,
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'Reported' CHECK(status IN ('Reported', 'Assigned', 'Resolved', 'Closed')),
    assigned_volunteer_id INTEGER,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_volunteer_id) REFERENCES volunteers(id) ON DELETE SET NULL
);

-- Lost Pets table
CREATE TABLE IF NOT EXISTS lost_pets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    pet_name VARCHAR(255),
    breed VARCHAR(100),
    color VARCHAR(100) NOT NULL,
    size VARCHAR(50) CHECK(size IN ('Small', 'Medium', 'Large')),
    location_area VARCHAR(255) NOT NULL,
    location_description TEXT,
    description TEXT,
    image_url TEXT,
    contact_phone VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'Lost' CHECK(status IN ('Lost', 'Found', 'Closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Found Pets table
CREATE TABLE IF NOT EXISTS found_pets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    breed VARCHAR(100),
    color VARCHAR(100) NOT NULL,
    size VARCHAR(50) CHECK(size IN ('Small', 'Medium', 'Large')),
    location_area VARCHAR(255) NOT NULL,
    location_description TEXT,
    description TEXT,
    image_url TEXT,
    contact_phone VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'Found' CHECK(status IN ('Found', 'Claimed', 'Closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Adoption Listings table
CREATE TABLE IF NOT EXISTS adoption_listings (
    id SERIAL PRIMARY KEY,
    dog_name VARCHAR(255) NOT NULL,
    breed VARCHAR(100),
    age VARCHAR(50),
    gender VARCHAR(20) CHECK(gender IN ('Male', 'Female', 'Unknown')),
    color VARCHAR(100),
    size VARCHAR(50) CHECK(size IN ('Small', 'Medium', 'Large')),
    description TEXT,
    health_status TEXT,
    image_url TEXT,
    location_area VARCHAR(255),
    created_by INTEGER,
    status VARCHAR(50) DEFAULT 'Available' CHECK(status IN ('Available', 'Pending', 'Adopted')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Adoption Applications table
CREATE TABLE IF NOT EXISTS adoption_applications (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    applicant_name VARCHAR(255),
    applicant_email VARCHAR(255),
    applicant_phone VARCHAR(20),
    applicant_address TEXT,
    reason TEXT,
    experience TEXT,
    status VARCHAR(50) DEFAULT 'Pending' CHECK(status IN ('Pending', 'Approved', 'Rejected', 'Withdrawn')),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (listing_id) REFERENCES adoption_listings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sterilization Drives table
CREATE TABLE IF NOT EXISTS sterilization_drives (
    id SERIAL PRIMARY KEY,
    location_area VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Scheduled' CHECK(status IN ('Scheduled', 'Completed', 'Cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sterilization Records table
CREATE TABLE IF NOT EXISTS sterilization_records (
    id SERIAL PRIMARY KEY,
    case_id VARCHAR(255) UNIQUE NOT NULL,
    drive_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    dog_description TEXT,
    age_estimate VARCHAR(50),
    gender VARCHAR(20),
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'Scheduled' CHECK(status IN ('Scheduled', 'Completed', 'Failed', 'Pending')),
    veterinarian_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (drive_id) REFERENCES sterilization_drives(id) ON DELETE CASCADE,
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
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Adoption Applications table
CREATE TABLE IF NOT EXISTS adoption_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    applicant_phone TEXT NOT NULL,
    applicant_address TEXT NOT NULL,
    reason TEXT,
    experience TEXT,
    status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Approved', 'Rejected')),
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES adoption_listings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sterilization Reports table
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
CREATE INDEX IF NOT EXISTS idx_rescue_reports_user_id ON rescue_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_rescue_reports_status ON rescue_reports(status);
CREATE INDEX IF NOT EXISTS idx_rescue_reports_case_id ON rescue_reports(case_id);
CREATE INDEX IF NOT EXISTS idx_lost_pets_area ON lost_pets(location_area);
CREATE INDEX IF NOT EXISTS idx_found_pets_area ON found_pets(location_area);
CREATE INDEX IF NOT EXISTS idx_adoption_listings_status ON adoption_listings(status);
CREATE INDEX IF NOT EXISTS idx_adoption_applications_status ON adoption_applications(status);
