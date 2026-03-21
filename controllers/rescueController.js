const db = require('../config/database');
const path = require('path');

// Generate unique case ID
const generateCaseId = () => {
    const prefix = 'RESCUE';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
};

// Submit rescue report
const submitReport = async (req, res) => {
    try {
        const userId = req.user.id;
        const { location_area, location_description, issue_type, description, latitude, longitude } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // Validation
        if (!location_area || !issue_type || !description) {
            return res.status(400).json({ error: 'Location area, issue type, and description are required' });
        }

        if (!['Injured', 'Stray', 'Aggressive'].includes(issue_type)) {
            return res.status(400).json({ error: 'Invalid issue type' });
        }

        // Aggressive dogs = High priority for admin
        const priority = issue_type === 'Aggressive' ? 'High' : 'Normal';

        const caseId = generateCaseId();

        // Insert report (support both old schema without lat/lng/priority and new schema)
        const result = await db.promisify.get(
            `INSERT INTO rescue_reports 
            (case_id, user_id, location_area, location_description, latitude, longitude, issue_type, priority, description, image_url) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
            [caseId, userId, location_area, location_description || null, latitude || null, longitude || null, issue_type, priority, description, imageUrl]
        );

        res.status(201).json({
            message: 'Rescue report submitted successfully',
            caseId,
            reportId: result.lastID
        });
    } catch (error) {
        console.error('Submit report error:', error);
        res.status(500).json({ error: 'Server error submitting report' });
    }
};

// Get user's own reports
const getMyReports = async (req, res) => {
    try {
        const userId = req.user.id;
        const reports = await db.promisify.all(
            `SELECT r.*, v.user_id as volunteer_user_id 
            FROM rescue_reports r 
            LEFT JOIN volunteers v ON r.assigned_volunteer_id = v.id 
            WHERE r.user_id = $1 
            ORDER BY r.created_at DESC`,
            [userId]
        );

        res.json(reports);
    } catch (error) {
        console.error('Get my reports error:', error);
        res.status(500).json({ error: 'Server error fetching reports' });
    }
};

// Get all reports (Admin/NGO) - Aggressive/High priority first
const getAllReports = async (req, res) => {
    try {
        let reports = await db.promisify.all(
            `SELECT r.*, u.name as reporter_name, u.email as reporter_email,
            v.user_id as volunteer_user_id,
            vu.name as volunteer_name
            FROM rescue_reports r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN volunteers v ON r.assigned_volunteer_id = v.id
            LEFT JOIN users vu ON v.user_id = vu.id
            ORDER BY r.created_at DESC`
        );

        // Sort: High priority (Aggressive) first, then by date
        reports.sort((a, b) => {
            const prio = { High: 0, Normal: 1 };
            const pa = (a.priority || (a.issue_type === 'Aggressive' ? 'High' : 'Normal'));
            const pb = (b.priority || (b.issue_type === 'Aggressive' ? 'High' : 'Normal'));
            if (prio[pa] !== prio[pb]) return prio[pa] - prio[pb];
            return new Date(b.created_at) - new Date(a.created_at);
        });

        res.json(reports);
    } catch (error) {
        console.error('Get all reports error:', error);
        res.status(500).json({ error: 'Server error fetching reports' });
    }
};

// Get volunteer's assigned cases
const getVolunteerCases = async (req, res) => {
    try {
        const volunteerId = req.volunteerId;
        const reports = await db.promisify.all(
            `SELECT r.*, u.name as reporter_name, u.email as reporter_email, u.phone as reporter_phone
            FROM rescue_reports r
            LEFT JOIN users u ON r.user_id = u.id
            WHERE r.assigned_volunteer_id = $1
            ORDER BY r.created_at DESC`,
            [volunteerId]
        );

        res.json(reports);
    } catch (error) {
        console.error('Get volunteer cases error:', error);
        res.status(500).json({ error: 'Server error fetching cases' });
    }
};

// Assign volunteer to case (Admin)
const assignVolunteer = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { volunteerId } = req.body;

        if (!volunteerId) {
            return res.status(400).json({ error: 'Volunteer ID is required' });
        }

        // Verify volunteer exists
        const volunteer = await db.promisify.get(
            'SELECT id FROM volunteers WHERE id = $1 AND status = $2',
            [volunteerId, 'active']
        );

        if (!volunteer) {
            return res.status(404).json({ error: 'Volunteer not found or inactive' });
        }

        // Update report
        await db.promisify.run(
            'UPDATE rescue_reports SET assigned_volunteer_id = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
            [volunteerId, 'Assigned', reportId]
        );

        res.json({ message: 'Volunteer assigned successfully' });
    } catch (error) {
        console.error('Assign volunteer error:', error);
        res.status(500).json({ error: 'Server error assigning volunteer' });
    }
};

// Update case status
const updateStatus = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status, admin_notes } = req.body;

        const validStatuses = ['Reported', 'Assigned', 'Resolved', 'Closed'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Valid status is required' });
        }

        // Check if user has permission
        const report = await db.promisify.get(
            'SELECT * FROM rescue_reports WHERE id = $1',
            [reportId]
        );

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Admin can update any report, volunteer can only update assigned cases
        if (req.user.role !== 'admin') {
            if (report.assigned_volunteer_id !== req.volunteerId) {
                return res.status(403).json({ error: 'Permission denied' });
            }
        }

        // Update status
        await db.promisify.run(
            'UPDATE rescue_reports SET status = $1, admin_notes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
            [status, admin_notes || report.admin_notes, reportId]
        );

        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Server error updating status' });
    }
};

// Get single report by ID
const getReportById = async (req, res) => {
    try {
        const { reportId } = req.params;
        const report = await db.promisify.get(
            `SELECT r.*, u.name as reporter_name, u.email as reporter_email,
            v.user_id as volunteer_user_id, vu.name as volunteer_name
            FROM rescue_reports r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN volunteers v ON r.assigned_volunteer_id = v.id
            LEFT JOIN users vu ON v.user_id = vu.id
            WHERE r.id = ?`,
            [reportId]
        );

        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        res.json(report);
    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({ error: 'Server error fetching report' });
    }
};

module.exports = {
    submitReport,
    getMyReports,
    getAllReports,
    getVolunteerCases,
    assignVolunteer,
    updateStatus,
    getReportById
};
