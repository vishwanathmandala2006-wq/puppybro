/**
 * Input validation & sanitization - OWASP: Prevent injection, XSS, oversized payloads
 * Schema-based, type checks, length limits, reject unexpected fields
 */

// Max lengths (OWASP recommendations)
const LIMITS = {
    name: 100,
    email: 254,
    password: 128,
    phone: 20,
    address: 500,
    textShort: 200,
    textLong: 2000,
    url: 500
};

// Simple sanitize: strip script tags, limit length
function sanitize(str, maxLen = LIMITS.textShort) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .slice(0, maxLen)
        .trim();
}

function isEmail(val) {
    if (typeof val !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) && val.length <= LIMITS.email;
}

function isSafeInt(val, min = 0, max = 2147483647) {
    const n = parseInt(val, 10);
    return !isNaN(n) && n >= min && n <= max && String(n) === String(val);
}

// Validation schemas - only allow expected fields
const schemas = {
    login: (body) => {
        const { email, password } = body;
        if (Object.keys(body).length > 2) return { error: 'Unexpected fields' };
        if (!email || !password) return { error: 'Email and password required' };
        if (!isEmail(sanitize(email))) return { error: 'Invalid email format' };
        if (typeof password !== 'string' || password.length < 6 || password.length > LIMITS.password)
            return { error: 'Invalid password' };
        return null;
    },
    register: (body) => {
        const allowed = ['name', 'email', 'password', 'phone', 'address'];
        if (Object.keys(body).some(k => !allowed.includes(k))) return { error: 'Unexpected fields' };
        const name = sanitize(body.name, LIMITS.name);
        const email = sanitize(body.email, LIMITS.email);
        const password = body.password;
        if (!name || !email || !password) return { error: 'Name, email and password required' };
        if (!isEmail(email)) return { error: 'Invalid email format' };
        if (typeof password !== 'string' || password.length < 6 || password.length > LIMITS.password)
            return { error: 'Password must be 6-128 characters' };
        return null;
    },
    registerNGO: (body) => {
        const allowed = ['name', 'email', 'password', 'phone', 'address', 'organization_name'];
        if (Object.keys(body).some(k => !allowed.includes(k))) return { error: 'Unexpected fields' };
        const name = sanitize(body.name, LIMITS.name);
        const email = sanitize(body.email, LIMITS.email);
        const password = body.password;
        const org = sanitize(body.organization_name, LIMITS.name);
        if (!name || !email || !password || !org) return { error: 'Name, email, password and organization name required' };
        if (!isEmail(email)) return { error: 'Invalid email format' };
        if (typeof password !== 'string' || password.length < 6 || password.length > LIMITS.password)
            return { error: 'Password must be 6-128 characters' };
        return null;
    },
    volunteer: (body) => {
        const allowed = ['availability', 'experience', 'areas_covered'];
        if (Object.keys(body).some(k => !allowed.includes(k))) return { error: 'Unexpected fields' };
        return null;
    },
    rescueReport: (body) => {
        const allowed = ['location_area', 'location_description', 'issue_type', 'description', 'latitude', 'longitude'];
        if (Object.keys(body).some(k => !allowed.includes(k))) return { error: 'Unexpected fields' };
        const area = sanitize(body.location_area, LIMITS.textShort);
        const type = body.issue_type;
        const desc = sanitize(body.description, LIMITS.textLong);
        if (!area || !type || !desc) return { error: 'Location area, issue type and description required' };
        if (!['Injured', 'Stray', 'Aggressive'].includes(type)) return { error: 'Invalid issue type' };
        const lat = body.latitude; const lng = body.longitude;
        if (lat != null && (isNaN(parseFloat(lat)) || lat < -90 || lat > 90)) return { error: 'Invalid latitude' };
        if (lng != null && (isNaN(parseFloat(lng)) || lng < -180 || lng > 180)) return { error: 'Invalid longitude' };
        return null;
    },
    adoptionApply: (body) => {
        const allowed = ['listing_id', 'applicant_name', 'applicant_email', 'applicant_phone', 'applicant_address', 'reason', 'experience'];
        if (Object.keys(body).some(k => !allowed.includes(k))) return { error: 'Unexpected fields' };
        const { listing_id, applicant_name, applicant_email, applicant_phone, applicant_address } = body;
        if (!isSafeInt(listing_id, 1) || !applicant_name || !applicant_email || !applicant_phone || !applicant_address)
            return { error: 'All applicant details required' };
        if (!isEmail(sanitize(applicant_email))) return { error: 'Invalid email format' };
        if (sanitize(applicant_name, LIMITS.name).length < 2) return { error: 'Invalid name' };
        return null;
    },
    statusUpdate: (body) => {
        const allowed = ['status', 'admin_notes'];
        if (Object.keys(body).some(k => !allowed.includes(k))) return { error: 'Unexpected fields' };
        const status = body.status;
        if (!status || typeof status !== 'string' || status.length > 50) return { error: 'Valid status required' };
        return null;
    },
    sterilizationReport: (body) => {
        const allowed = ['location_area', 'location_description', 'dog_count', 'description'];
        if (Object.keys(body).some(k => !allowed.includes(k))) return { error: 'Unexpected fields' };
        const area = sanitize(body.location_area, LIMITS.textShort);
        if (!area) return { error: 'Location area required' };
        const count = body.dog_count;
        if (count != null && (!isSafeInt(count, 0, 9999))) return { error: 'Invalid dog count' };
        return null;
    }
};

function validate(schemaName) {
    return (req, res, next) => {
        const schema = schemas[schemaName];
        if (!schema) return next();
        const err = schema(req.body || {});
        if (err) return res.status(400).json({ error: err.error });
        next();
    };
}

module.exports = { sanitize, validate, LIMITS };
