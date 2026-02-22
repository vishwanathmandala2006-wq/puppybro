// Authentication and User Management

const API_BASE = '/api';

// Store token in localStorage
function setToken(token) {
    localStorage.setItem('token', token);
}

function getToken() {
    return localStorage.getItem('token');
}

function removeToken() {
    localStorage.removeItem('token');
}

function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function removeUser() {
    localStorage.removeItem('user');
}

// Check authentication status and update UI
function checkAuthStatus() {
    const token = getToken();
    const user = getUser();
    const navAuth = document.getElementById('navAuth');
    const navUser = document.getElementById('navUser');
    const userName = document.getElementById('userName');
    const adminLink = document.getElementById('adminLink');

    if (token && user) {
        if (navAuth) navAuth.style.display = 'none';
        if (navUser) {
            navUser.style.display = 'flex';
            if (userName) {
                const roleLabel = user.role === 'admin' ? ' (Admin)' : user.role === 'ngo' ? ' (NGO)' : '';
                userName.textContent = `Hello, ${user.name}${roleLabel}`;
            }
            // Show admin link for both admin and NGO
            if (adminLink && (user.role === 'admin' || user.role === 'ngo')) {
                adminLink.style.display = 'inline-block';
                adminLink.textContent = user.role === 'admin' ? 'Admin' : 'Dashboard';
            }
        }
    } else {
        if (navAuth) navAuth.style.display = 'flex';
        if (navUser) navUser.style.display = 'none';
    }
}

// Logout function
function logout() {
    removeToken();
    removeUser();
    window.location.href = 'index.html';
}

// Make authenticated API requests
async function apiRequest(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE}${url}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                // Unauthorized - logout user
                logout();
                throw new Error('Session expired. Please login again.');
            }
            throw new Error(data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Register user
async function register(userData) {
    const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });

    setToken(data.token);
    setUser(data.user);
    return data;
}

// Login user
async function login(email, password) {
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });

    setToken(data.token);
    setUser(data.user);
    checkAuthStatus(); // Update UI after login
    return data;
}

// Register as volunteer
async function registerVolunteer(volunteerData) {
    return await apiRequest('/auth/volunteer-register', {
        method: 'POST',
        body: JSON.stringify(volunteerData)
    });
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getToken();
}

// Check if user is admin
function isAdmin() {
    const user = getUser();
    return user && user.role === 'admin';
}

// Check if user is NGO
function isNGO() {
    const user = getUser();
    return user && user.role === 'ngo';
}

// Check if user is admin or NGO
function isAdminOrNGO() {
    const user = getUser();
    return user && (user.role === 'admin' || user.role === 'ngo');
}

// Require authentication - redirect if not logged in
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Require admin - redirect if not admin
function requireAdmin() {
    if (!isAdmin()) {
        alert('Admin access required');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Require admin or NGO - redirect if not admin/NGO
function requireAdminOrNGO() {
    if (!isAdminOrNGO()) {
        alert('Admin or NGO access required');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Initialize auth on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', checkAuthStatus);
}
