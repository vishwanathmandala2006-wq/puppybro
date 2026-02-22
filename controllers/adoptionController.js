const db = require('../config/database');

// Get all adoption listings
const getListings = async (req, res) => {
    try {
        const listings = await db.promisify.all(
            `SELECT al.*, u.name as created_by_name 
            FROM adoption_listings al
            LEFT JOIN users u ON al.created_by = u.id
            WHERE al.status = 'Available'
            ORDER BY al.created_at DESC`
        );

        res.json(listings);
    } catch (error) {
        console.error('Get listings error:', error);
        res.status(500).json({ error: 'Server error fetching listings' });
    }
};

// Get all adoption listings (Admin - includes all statuses)
const getAllListings = async (req, res) => {
    try {
        const listings = await db.promisify.all(
            `SELECT al.*, u.name as created_by_name 
            FROM adoption_listings al
            LEFT JOIN users u ON al.created_by = u.id
            ORDER BY al.created_at DESC`
        );

        res.json(listings);
    } catch (error) {
        console.error('Get all listings error:', error);
        res.status(500).json({ error: 'Server error fetching listings' });
    }
};

// Create adoption listing (Admin)
const createListing = async (req, res) => {
    try {
        const userId = req.user.id;
        const { dog_name, breed, age, gender, color, size, description, health_status, location_area } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // Validation
        if (!dog_name) {
            return res.status(400).json({ error: 'Dog name is required' });
        }

        // Insert listing
        const result = await db.promisify.run(
            `INSERT INTO adoption_listings 
            (dog_name, breed, age, gender, color, size, description, health_status, image_url, location_area, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [dog_name, breed || null, age || null, gender || null, color || null, size || null, description || null, health_status || null, imageUrl, location_area || null, userId]
        );

        res.status(201).json({
            message: 'Adoption listing created successfully',
            listingId: result.lastID
        });
    } catch (error) {
        console.error('Create listing error:', error);
        res.status(500).json({ error: 'Server error creating listing' });
    }
};

// Apply for adoption
const applyForAdoption = async (req, res) => {
    try {
        const userId = req.user.id;
        const { listing_id, applicant_name, applicant_email, applicant_phone, applicant_address, reason, experience } = req.body;

        // Validation
        if (!listing_id || !applicant_name || !applicant_email || !applicant_phone || !applicant_address) {
            return res.status(400).json({ error: 'All applicant details are required' });
        }

        // Verify listing exists and is available
        const listing = await db.promisify.get(
            'SELECT id, status FROM adoption_listings WHERE id = ?',
            [listing_id]
        );

        if (!listing) {
            return res.status(404).json({ error: 'Adoption listing not found' });
        }

        if (listing.status !== 'Available') {
            return res.status(400).json({ error: 'This dog is not available for adoption' });
        }

        // Check if user already applied
        const existingApplication = await db.promisify.get(
            'SELECT id FROM adoption_applications WHERE listing_id = ? AND user_id = ?',
            [listing_id, userId]
        );

        if (existingApplication) {
            return res.status(400).json({ error: 'You have already applied for this adoption' });
        }

        // Insert application
        const result = await db.promisify.run(
            `INSERT INTO adoption_applications 
            (listing_id, user_id, applicant_name, applicant_email, applicant_phone, applicant_address, reason, experience) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [listing_id, userId, applicant_name, applicant_email, applicant_phone, applicant_address, reason || null, experience || null]
        );

        res.status(201).json({
            message: 'Adoption application submitted successfully',
            applicationId: result.lastID
        });
    } catch (error) {
        console.error('Apply for adoption error:', error);
        res.status(500).json({ error: 'Server error submitting application' });
    }
};

// Get all adoption applications (Admin)
const getAllApplications = async (req, res) => {
    try {
        const applications = await db.promisify.all(
            `SELECT aa.*, al.dog_name, al.breed, al.image_url as dog_image,
            u.name as applicant_user_name, u.email as applicant_user_email
            FROM adoption_applications aa
            LEFT JOIN adoption_listings al ON aa.listing_id = al.id
            LEFT JOIN users u ON aa.user_id = u.id
            ORDER BY aa.created_at DESC`
        );

        res.json(applications);
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ error: 'Server error fetching applications' });
    }
};

// Get user's own applications
const getMyApplications = async (req, res) => {
    try {
        const userId = req.user.id;
        const applications = await db.promisify.all(
            `SELECT aa.*, al.dog_name, al.breed, al.image_url as dog_image
            FROM adoption_applications aa
            LEFT JOIN adoption_listings al ON aa.listing_id = al.id
            WHERE aa.user_id = ?
            ORDER BY aa.created_at DESC`,
            [userId]
        );

        res.json(applications);
    } catch (error) {
        console.error('Get my applications error:', error);
        res.status(500).json({ error: 'Server error fetching applications' });
    }
};

// Approve or reject application (Admin)
const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status, admin_notes } = req.body;

        const validStatuses = ['Pending', 'Approved', 'Rejected'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Valid status is required' });
        }

        // Get application
        const application = await db.promisify.get(
            'SELECT listing_id FROM adoption_applications WHERE id = ?',
            [applicationId]
        );

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Update application status
        await db.promisify.run(
            'UPDATE adoption_applications SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, admin_notes || null, applicationId]
        );

        // If approved, update listing status to Pending
        if (status === 'Approved') {
            await db.promisify.run(
                'UPDATE adoption_listings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                ['Pending', application.listing_id]
            );
        }

        res.json({ message: 'Application status updated successfully' });
    } catch (error) {
        console.error('Update application status error:', error);
        res.status(500).json({ error: 'Server error updating application status' });
    }
};

// Update listing status (Admin)
const updateListingStatus = async (req, res) => {
    try {
        const { listingId } = req.params;
        const { status } = req.body;

        const validStatuses = ['Available', 'Pending', 'Adopted'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Valid status is required' });
        }

        await db.promisify.run(
            'UPDATE adoption_listings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, listingId]
        );

        res.json({ message: 'Listing status updated successfully' });
    } catch (error) {
        console.error('Update listing status error:', error);
        res.status(500).json({ error: 'Server error updating listing status' });
    }
};

module.exports = {
    getListings,
    getAllListings,
    createListing,
    applyForAdoption,
    getAllApplications,
    getMyApplications,
    updateApplicationStatus,
    updateListingStatus
};
