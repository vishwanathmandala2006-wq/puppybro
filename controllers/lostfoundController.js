const db = require('../config/database');

// Report lost pet
const reportLostPet = async (req, res) => {
    try {
        const userId = req.user.id;
        const { pet_name, breed, color, size, location_area, location_description, description, contact_phone } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // Validation
        if (!color || !location_area || !contact_phone) {
            return res.status(400).json({ error: 'Color, location area, and contact phone are required' });
        }

        // Insert lost pet report
        const result = await db.promisify.run(
            `INSERT INTO lost_pets 
            (user_id, pet_name, breed, color, size, location_area, location_description, description, image_url, contact_phone) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
            [userId, pet_name || null, breed || null, color, size || null, location_area, location_description || null, description || null, imageUrl, contact_phone]
        );

        res.status(201).json({
            message: 'Lost pet report submitted successfully',
            reportId: result.lastID
        });
    } catch (error) {
        console.error('Report lost pet error:', error);
        res.status(500).json({ error: 'Server error submitting lost pet report' });
    }
};

// Report found dog
const reportFoundDog = async (req, res) => {
    try {
        const userId = req.user.id;
        const { breed, color, size, location_area, location_description, description, contact_phone } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // Validation
        if (!color || !location_area || !contact_phone) {
            return res.status(400).json({ error: 'Color, location area, and contact phone are required' });
        }

        // Insert found pet report
        const result = await db.promisify.run(
            `INSERT INTO found_pets 
            (user_id, breed, color, size, location_area, location_description, description, image_url, contact_phone) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
            [userId, breed || null, color, size || null, location_area, location_description || null, description || null, imageUrl, contact_phone]
        );

        res.status(201).json({
            message: 'Found dog report submitted successfully',
            reportId: result.lastID
        });
    } catch (error) {
        console.error('Report found dog error:', error);
        res.status(500).json({ error: 'Server error submitting found dog report' });
    }
};

// Search lost and found pets
const searchPets = async (req, res) => {
    try {
        const { area, color, breed, type } = req.query; // type: 'lost' or 'found'

        let lostPets = [];
        let foundPets = [];

        // Build query conditions
        let conditions = [];
        let params = [];

        if (area) {
            conditions.push(`location_area LIKE $${params.length + 1}`);
            params.push(`%${area}%`);
        }
        if (color) {
            conditions.push(`color LIKE $${params.length + 1}`);
            params.push(`%${color}%`);
        }
        if (breed) {
            conditions.push(`breed LIKE $${params.length + 1}`);
            params.push(`%${breed}%`);
        }

        const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

        // Get lost pets
        if (!type || type === 'lost') {
            lostPets = await db.promisify.all(
                `SELECT lp.*, u.name as reporter_name 
                FROM lost_pets lp
                LEFT JOIN users u ON lp.user_id = u.id
                ${whereClause} AND lp.status = 'Lost'
                ORDER BY lp.created_at DESC`,
                params
            );
        }

        // Get found pets
        if (!type || type === 'found') {
            foundPets = await db.promisify.all(
                `SELECT fp.*, u.name as reporter_name 
                FROM found_pets fp
                LEFT JOIN users u ON fp.user_id = u.id
                ${whereClause} AND fp.status = 'Found'
                ORDER BY fp.created_at DESC`,
                params
            );
        }

        res.json({
            lost: lostPets,
            found: foundPets
        });
    } catch (error) {
        console.error('Search pets error:', error);
        res.status(500).json({ error: 'Server error searching pets' });
    }
};

// Get all lost pets (Admin)
const getAllLostPets = async (req, res) => {
    try {
        const pets = await db.promisify.all(
            `SELECT lp.*, u.name as reporter_name, u.email as reporter_email 
            FROM lost_pets lp
            LEFT JOIN users u ON lp.user_id = u.id
            ORDER BY lp.created_at DESC`
        );

        res.json(pets);
    } catch (error) {
        console.error('Get all lost pets error:', error);
        res.status(500).json({ error: 'Server error fetching lost pets' });
    }
};

// Get all found pets (Admin)
const getAllFoundPets = async (req, res) => {
    try {
        const pets = await db.promisify.all(
            `SELECT fp.*, u.name as reporter_name, u.email as reporter_email 
            FROM found_pets fp
            LEFT JOIN users u ON fp.user_id = u.id
            ORDER BY fp.created_at DESC`
        );

        res.json(pets);
    } catch (error) {
        console.error('Get all found pets error:', error);
        res.status(500).json({ error: 'Server error fetching found pets' });
    }
};

// Update lost pet status
const updateLostPetStatus = async (req, res) => {
    try {
        const { petId } = req.params;
        const { status } = req.body;

        const validStatuses = ['Lost', 'Found', 'Closed'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Valid status is required' });
        }

        await db.promisify.run(
            'UPDATE lost_pets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [status, petId]
        );

        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Update lost pet status error:', error);
        res.status(500).json({ error: 'Server error updating status' });
    }
};

// Update found pet status
const updateFoundPetStatus = async (req, res) => {
    try {
        const { petId } = req.params;
        const { status } = req.body;

        const validStatuses = ['Found', 'Claimed', 'Closed'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Valid status is required' });
        }

        await db.promisify.run(
            'UPDATE found_pets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [status, petId]
        );

        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Update found pet status error:', error);
        res.status(500).json({ error: 'Server error updating status' });
    }
};

module.exports = {
    reportLostPet,
    reportFoundDog,
    searchPets,
    getAllLostPets,
    getAllFoundPets,
    updateLostPetStatus,
    updateFoundPetStatus
};
