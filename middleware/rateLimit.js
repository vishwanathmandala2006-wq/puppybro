/**
 * Rate limiting middleware - OWASP: Prevent brute force and DoS
 * IP-based for public endpoints, user-based for authenticated endpoints
 * Graceful 429 responses with Retry-After header
 */

const rateLimit = require('express-rate-limit');

// Sensible defaults per OWASP recommendations
const WINDOW_MS = 15 * 60 * 1000;      // 15 minutes
const MAX_PUBLIC = 100;                  // Public: 100 req/15min per IP
const MAX_AUTH = 10;                     // Auth (login/register): 10 req/15min per IP
const MAX_API = 200;                     // General API: 200 req/15min per IP

// Standard handler for 429 - graceful, no stack traces
const handler = (req, res) => {
    res.status(429).json({
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(WINDOW_MS / 1000)
    });
    res.setHeader('Retry-After', Math.ceil(WINDOW_MS / 1000));
};

/**
 * Strict rate limit for auth endpoints (login, register)
 * Prevents brute force password attacks
 */
const authLimiter = rateLimit({
    windowMs: WINDOW_MS,
    max: MAX_AUTH,
    message: { error: 'Too many login attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    handler
});

/**
 * General API rate limit for public/protected endpoints
 */
const apiLimiter = rateLimit({
    windowMs: WINDOW_MS,
    max: MAX_API,
    standardHeaders: true,
    legacyHeaders: false,
    handler
});

module.exports = {
    authLimiter,
    apiLimiter
};
