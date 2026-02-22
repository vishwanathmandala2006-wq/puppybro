const jwt = require('jsonwebtoken');
const db = require('../config/database');

// OWASP: Never hardcode secrets. Use env vars, rotate in production.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
    console.warn('WARNING: JWT_SECRET not set or too short. Set JWT_SECRET in .env (min 32 chars).');
}
const SECRET = JWT_SECRET && JWT_SECRET.length >= 32 ? JWT_SECRET : 'dev-fallback-min32chars-do-not-use-in-prod';

// Middleware to verify JWT token
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, SECRET);
        
        // Verify user still exists
        const user = await db.promisify.get(
            'SELECT id, name, email, role FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Admin access required' });
    }
};

// Middleware to check NGO role
const requireNGO = (req, res, next) => {
    if (req.user && req.user.role === 'ngo') {
        next();
    } else {
        res.status(403).json({ error: 'NGO access required' });
    }
};

// Middleware to check Admin or NGO role
const requireAdminOrNGO = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'ngo')) {
        next();
    } else {
        res.status(403).json({ error: 'Admin or NGO access required' });
    }
};

// Middleware to check volunteer role
const requireVolunteer = async (req, res, next) => {
    try {
        const volunteer = await db.promisify.get(
            'SELECT id FROM volunteers WHERE user_id = ? AND status = ?',
            [req.user.id, 'active']
        );

        if (!volunteer) {
            return res.status(403).json({ error: 'Volunteer access required' });
        }

        req.volunteerId = volunteer.id;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Error checking volunteer status' });
    }
};

module.exports = {
    authenticate,
    requireAdmin,
    requireNGO,
    requireAdminOrNGO,
    requireVolunteer,
    JWT_SECRET: SECRET
};
