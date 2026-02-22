const db = require('../config/database');

// Report sterilization need
const submitReport = async (req, res) => {
    try {
        const userId = req.user.id;
        const { location_area, location_description, dog_count, description } = req.body;

        // Validation
        if (!location_area) {
            return res.status(400).json({ error: 'Location area is required' });
        }

        // Insert sterilization report
        const result = await db.promisify.run(
            `INSERT INTO sterilization_reports 
            (user_id, location_area, location_description, dog_count, description) 
            VALUES (?, ?, ?, ?, ?)`,
            [userId, location_area, location_description || null, dog_count || null, description || null]
        );

        res.status(201).json({
            message: 'Sterilization report submitted successfully',
            reportId: result.lastID
        });
    } catch (error) {
        console.error('Submit sterilization report error:', error);
        res.status(500).json({ error: 'Server error submitting report' });
    }
};

// Get user's own reports
const getMyReports = async (req, res) => {
    try {
        const userId = req.user.id;
        const reports = await db.promisify.all(
            'SELECT * FROM sterilization_reports WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        res.json(reports);
    } catch (error) {
        console.error('Get my reports error:', error);
        res.status(500).json({ error: 'Server error fetching reports' });
    }
};

// Get all reports (Admin)
const getAllReports = async (req, res) => {
    try {
        const reports = await db.promisify.all(
            `SELECT sr.*, u.name as reporter_name, u.email as reporter_email 
            FROM sterilization_reports sr
            LEFT JOIN users u ON sr.user_id = u.id
            ORDER BY sr.created_at DESC`
        );

        res.json(reports);
    } catch (error) {
        console.error('Get all reports error:', error);
        res.status(500).json({ error: 'Server error fetching reports' });
    }
};

// Update report status (Admin)
const updateStatus = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status, admin_notes } = req.body;

        const validStatuses = ['Reported', 'Noted', 'Planned', 'Completed'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Valid status is required' });
        }

        await db.promisify.run(
            'UPDATE sterilization_reports SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, admin_notes || null, reportId]
        );

        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Server error updating status' });
    }
};

module.exports = {
    submitReport,
    getMyReports,
    getAllReports,
    updateStatus
};
