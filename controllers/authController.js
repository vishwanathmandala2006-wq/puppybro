const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { JWT_SECRET } = require('../middleware/auth');

// Register new user
const register = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // Check if user already exists
        const existingUser = await db.promisify.get(
            'SELECT id FROM users WHERE email = $1',
            [email.toLowerCase().trim()]
        );

        if (existingUser) {
            console.warn(`Registration attempt: email already exists - ${email}`);
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user with RETURNING to get the new ID
        let result;
        try {
            result = await db.promisify.get(
                'INSERT INTO users (name, email, password, phone, address, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role',
                [name, email.toLowerCase().trim(), hashedPassword, phone || null, address || null, 'user']
            );
        } catch (dbErr) {
            console.error('Database error during registration:', dbErr.message);
            return res.status(500).json({ error: 'Error creating user account' });
        }

        if (!result) {
            console.error('Failed to retrieve inserted user');
            return res.status(500).json({ error: 'Error creating user account' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: result.id, email: result.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log(`New user registered: ${email}`);
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.id,
                name: result.name,
                email: result.email,
                role: result.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user - defensive: ensure db.promisify exists
        if (!db.promisify || !db.promisify.get) {
            console.error('Database promisify not available');
            return res.status(500).json({ error: 'Service temporarily unavailable' });
        }

        const user = await db.promisify.get(
            'SELECT id, name, email, password, role FROM users WHERE email = $1',
            [String(email).trim().toLowerCase()]
        );

        if (!user || !user.password) {
            console.warn(`Login attempt failed: user not found for email ${email}`);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(String(password), user.password);
        if (!isValidPassword) {
            console.warn(`Login attempt failed: invalid password for email ${email}`);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const secret = JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET not configured');
            return res.status(500).json({ error: 'Service configuration error' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            secret,
            { expiresIn: '7d' }
        );

        console.log(`Login successful for user: ${user.email}`);
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error?.message || error);
        res.status(500).json({ error: 'Server error during login' });
    }
};
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error?.message || error);
        res.status(500).json({ error: 'Server error during login' });
    }
};

// Register NGO
const registerNGO = async (req, res) => {
    try {
        const { name, email, password, phone, address, organization_name } = req.body;

        // Validation
        if (!name || !email || !password || !organization_name) {
            return res.status(400).json({ error: 'Name, email, password, and organization name are required' });
        }

        // Check if user already exists
        const existingUser = await db.promisify.get(
            'SELECT id FROM users WHERE email = $1',
            [email.toLowerCase().trim()]
        );

        if (existingUser) {
            console.warn(`NGO registration attempt: email already exists - ${email}`);
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert NGO user with RETURNING
        let result;
        try {
            result = await db.promisify.get(
                'INSERT INTO users (name, email, password, phone, address, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role',
                [name, email.toLowerCase().trim(), hashedPassword, phone || null, address || null, 'ngo']
            );
        } catch (dbErr) {
            console.error('Database error during NGO registration:', dbErr.message);
            return res.status(500).json({ error: 'Error creating NGO account' });
        }

        if (!result) {
            console.error('Failed to retrieve inserted NGO user');
            return res.status(500).json({ error: 'Error creating NGO account' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: result.id, email: result.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log(`New NGO registered: ${email}`);
        res.status(201).json({
            message: 'NGO registered successfully',
            token,
            user: {
                id: result.lastID,
                name,
                email,
                role: 'ngo'
            }
        });
    } catch (error) {
        console.error('NGO registration error:', error);
        res.status(500).json({ error: 'Server error during NGO registration' });
    }
};

// Register as volunteer
const registerVolunteer = async (req, res) => {
    try {
        const userId = req.user.id;
        const { availability, experience, areas_covered } = req.body;

        // Check if already registered as volunteer
        const existingVolunteer = await db.promisify.get(
            'SELECT id FROM volunteers WHERE user_id = ?',
            [userId]
        );

        if (existingVolunteer) {
            return res.status(400).json({ error: 'Already registered as volunteer' });
        }

        // Insert volunteer
        const result = await db.promisify.run(
            'INSERT INTO volunteers (user_id, availability, experience, areas_covered) VALUES (?, ?, ?, ?)',
            [userId, availability || null, experience || null, areas_covered || null]
        );

        res.status(201).json({
            message: 'Volunteer registration successful',
            volunteerId: result.lastID
        });
    } catch (error) {
        console.error('Volunteer registration error:', error);
        res.status(500).json({ error: 'Server error during volunteer registration' });
    }
};

// Get current user profile
const getProfile = async (req, res) => {
    try {
        const user = await db.promisify.get(
            'SELECT id, name, email, phone, address, role, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    register,
    login,
    registerNGO,
    registerVolunteer,
    getProfile
};
