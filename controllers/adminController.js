const db = require('../config/database');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        // Get counts for various entities
        const [
            totalUsers,
            totalVolunteers,
            rescueReports,
            lostPets,
            foundPets,
            adoptionListings,
            adoptionApplications,
            sterilizationReports
        ] = await Promise.all([
            db.promisify.get('SELECT COUNT(*) as count FROM users WHERE role = $1', ['user']),
            db.promisify.get('SELECT COUNT(*) as count FROM volunteers WHERE status = $1', ['active']),
            db.promisify.get('SELECT COUNT(*) as count FROM rescue_reports'),
            db.promisify.get('SELECT COUNT(*) as count FROM lost_pets WHERE status = $1', ['Lost']),
            db.promisify.get('SELECT COUNT(*) as count FROM found_pets WHERE status = $1', ['Found']),
            db.promisify.get('SELECT COUNT(*) as count FROM adoption_listings WHERE status = $1', ['Available']),
            db.promisify.get('SELECT COUNT(*) as count FROM adoption_applications WHERE status = $1', ['Pending']),
            db.promisify.get('SELECT COUNT(*) as count FROM sterilization_reports WHERE status = $1', ['Reported'])
        ]);

        res.json({
            totalUsers: totalUsers.count,
            totalVolunteers: totalVolunteers.count,
            rescueReports: rescueReports.count,
            lostPets: lostPets.count,
            foundPets: foundPets.count,
            adoptionListings: adoptionListings.count,
            pendingAdoptions: adoptionApplications.count,
            sterilizationReports: sterilizationReports.count
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ error: 'Server error fetching dashboard statistics' });
    }
};

// Get public homepage statistics (no authentication required)
const getPublicStats = async (req, res) => {
    try {
        // Get counts for homepage display
        const [
            rescueReports,
            adoptions,
            volunteers,
            petReunited
        ] = await Promise.all([
            db.promisify.get('SELECT COUNT(*) as count FROM rescue_reports WHERE status = $1', ['Resolved']),
            db.promisify.get('SELECT COUNT(*) as count FROM adoption_listings WHERE status = $1', ['Adopted']),
            db.promisify.get('SELECT COUNT(*) as count FROM volunteers WHERE status = $1', ['active']),
            db.promisify.get('SELECT COUNT(*) as count FROM lost_pets WHERE status = $1', ['Found'])
        ]);

        res.json({
            rescuesCases: rescueReports.count,
            adoptions: adoptions.count,
            activeVolunteers: volunteers.count,
            petsReunited: petReunited.count
        });
    } catch (error) {
        console.error('Get public stats error:', error);
        res.status(500).json({ error: 'Server error fetching statistics' });
    }
};

// Get all volunteers
const getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await db.promisify.all(
            `SELECT v.*, u.name, u.email, u.phone 
            FROM volunteers v
            LEFT JOIN users u ON v.user_id = u.id
            ORDER BY v.created_at DESC`
        );

        res.json(volunteers);
    } catch (error) {
        console.error('Get all volunteers error:', error);
        res.status(500).json({ error: 'Server error fetching volunteers' });
    }
};

module.exports = {
    getDashboardStats,
    getPublicStats,
    getAllVolunteers
};
