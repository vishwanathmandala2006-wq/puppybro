const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { authLimiter, apiLimiter } = require('./middleware/rateLimit');

// Import routes
const authRoutes = require('./routes/auth');
const rescueRoutes = require('./routes/rescue');
const lostfoundRoutes = require('./routes/lostfound');
const adoptionRoutes = require('./routes/adoption');
const sterilizationRoutes = require('./routes/sterilization');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '100kb' }));   // OWASP: Limit payload size
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Rate limiting - apply to all API routes
app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/register-ngo', authLimiter);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rescue', rescueRoutes);
app.use('/api/lostfound', lostfoundRoutes);
app.use('/api/adoption', adoptionRoutes);
app.use('/api/sterilization', sterilizationRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint (for Render)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware - no stack traces to client (OWASP)
app.use((err, req, res, next) => {
    console.error('Error:', err.message || err);
    const status = err.status || 500;
    const message = status === 500 ? 'Internal server error' : (err.message || 'Error');
    res.status(status).json({ error: message });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 PuppyBro Server running on http://localhost:${PORT}`);
    console.log(`� Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Database: PostgreSQL (${process.env.DATABASE_URL ? 'configured' : 'using default'})`);
    console.log(`\nDefault Admin Credentials:`);
    console.log(`   Email: admin@puppybro.com`);
    console.log(`   Password: admin123\n`);
});
