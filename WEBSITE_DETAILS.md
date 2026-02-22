# 🐕 PuppyBro - Website Details & Documentation

**Version:** 1.0.0  
**Status:** Production Ready  
**Last Updated:** February 22, 2026

---

## 📋 Overview

**PuppyBro** is a comprehensive **Dog Welfare Management System** designed for the B.Tech IV Semester Real-Time Project. The platform connects users, volunteers, and NGOs to coordinate dog rescue, adoption, lost/found services, and sterilization programs.

**Key Tagline:** "Caring for Every Paw"  
**Server Location:** http://localhost:3001

---

## 🎨 Website Features

### 1. **Professional Splash Screen**
- **Animated Dog Icon:** 🐕 bounces in at page load
- **Brand Text:** "Puppy Bro" displays with typewriter animation
- **Visual Elements:**
  - Modern gradient background (Red #FF6B6B → Dark Navy #1A1A2E)
  - Animated floating orbs with radial gradients
  - Glowing red cursor effect with box-shadow
  - Text shadows with brand colors for depth
  - Responsive design for mobile & desktop
  - Smooth 600ms fade-out transition

### 2. **Homepage Dashboard**
- **Hero Section:** Welcome message with CTAs
- **Features Showcase:** 5 main service cards (Rescue, Lost & Found, Adoption, Volunteer, Sterilization)
- **Real-Time Statistics:**
  - Rescue Cases (from resolved rescue_reports)
  - Adoptions (from adopted adoption_listings)
  - Active Volunteers (count of active volunteers)
  - Pets Reunited (from found lost_pets)
  - **Auto-refreshes from database** via `/api/admin/stats` endpoint

### 3. **Responsive Design**
- Mobile breakpoint: 768px
- Desktop optimized layouts
- Touch-friendly buttons and navigation
- Optimized font sizes for all devices

---

## 🏗️ Project Architecture

### **Technology Stack**
```
Frontend:
- HTML5, CSS3 (with animations & gradients)
- Vanilla JavaScript (no frameworks)
- Responsive design

Backend:
- Node.js with Express.js
- SQLite3 database
- JWT authentication
- bcryptjs for password hashing
- Multer for file uploads

Security:
- Role-based access control (RBAC)
- Rate limiting middleware
- Input validation
- CORS enabled
```

### **Color Palette**
- **Primary Red:** #FF6B6B (action buttons, brand color)
- **Secondary Teal:** #4ECDC4 (accents, highlights)
- **Dark Navy:** #1A1A2E (backgrounds, text)
- **Light Background:** #F8F9FA (cards, sections)

---

## 📑 Website Pages

| Page | URL | Type | Authentication | Purpose |
|------|-----|------|-----------------|---------|
| Homepage | `/` or `/index.html` | Public | Optional | Landing page with stats & features |
| Lost & Found | `/lost-found.html` | Public | Optional | Search lost/found dogs |
| Adopt Dogs | `/adoption.html` | Public | Optional | Browse adoption listings |
| Report Dog | `/report-dog.html` | Protected | Required | Submit rescue reports |
| Volunteer | `/volunteer.html` | Protected | Required | Join volunteer program |
| Sterilization | `/sterilization.html` | Protected | Required | Report sterilization needs |
| Track Status | `/track-status.html` | Protected | Required | Track report status |
| User Login | `/login.html` | Public | - | Standard user login |
| User Register | `/register.html` | Public | - | New user registration |
| Admin Login | `/admin-login.html` | Public | - | Admin panel access |
| NGO Login | `/ngo-login.html` | Public | - | NGO dashboard access |
| Admin Dashboard | `/admin-dashboard.html` | Protected | Admin | Full admin controls |

---

## 🔐 Authentication System

### **User Roles & Permissions**

#### 👤 **Regular User**
- Can report rescue cases
- Can report lost/found pets
- Can apply for adoption
- Can report sterilization needs
- Can volunteer
- View public listings

#### 🤝 **Volunteer**
- All user permissions +
- Get assigned rescue cases
- Update case status
- View case details

#### 🏢 **NGO**
- All user permissions +
- Manage adoption listings
- Approve adoption applications
- Update report statuses
- View all reports
- Manage their organization

#### 👮 **Admin**
- Full system access
- Manage users and volunteers
- Assign volunteers to cases
- Approve/reject applications
- Update all statuses
- View all statistics
- Dashboard management

### **Login Credentials** (For Testing)

```
User Account:
Email: user@puppybro.com
Password: user123

Admin Account:
Email: admin@puppybro.com
Password: admin123

NGO Account:
Email: ngo@puppybro.com
Password: ngo123
```

---

## 🛣️ API Routes & Endpoints

### **Authentication Routes** (`/api/auth`)
```
POST   /register              - User registration
POST   /login                 - User login
POST   /register-ngo          - NGO registration
POST   /volunteer-register    - Volunteer registration
GET    /profile               - Get user profile (Auth required)
```

### **Rescue Reports** (`/api/rescue`)
```
POST   /report                - Submit rescue report (Auth required)
GET    /my-reports            - Get user's reports (Auth required)
GET    /volunteer/cases       - Get volunteer cases (Volunteer only)
GET    /admin/all             - Get all reports (Admin/NGO)
PUT    /:reportId/assign      - Assign volunteer (Admin)
PUT    /:reportId/update-status - Update status (Volunteer/Admin/NGO)
```

### **Lost & Found** (`/api/lostfound`)
```
POST   /lost                  - Report lost pet (Auth required)
POST   /found                 - Report found pet (Auth required)
GET    /search                - Search pets (PUBLIC - No auth)
GET    /admin/lost            - View lost pets (Admin/NGO)
GET    /admin/found           - View found pets (Admin/NGO)
PUT    /lost/:petId/status    - Update lost status (Admin/NGO)
PUT    /found/:petId/status   - Update found status (Admin/NGO)
```

### **Adoption** (`/api/adoption`)
```
GET    /listings              - Get listings (PUBLIC - No auth)
POST   /apply                 - Apply for adoption (Auth required)
GET    /my-applications       - User's applications (Auth required)
POST   /admin/listing         - Create listing (Admin/NGO)
GET    /admin/listings        - View all listings (Admin/NGO)
PUT    /admin/listing/:id/status     - Update listing status (Admin/NGO)
GET    /admin/applications    - View applications (Admin/NGO)
PUT    /admin/application/:id/status - Update app status (Admin/NGO)
```

### **Sterilization** (`/api/sterilization`)
```
POST   /report                - Submit report (Auth required)
GET    /my-reports            - User's reports (Auth required)
GET    /admin/all             - All reports (Admin/NGO)
PUT    /:reportId/status      - Update status (Admin/NGO)
```

### **Admin** (`/api/admin`)
```
GET    /stats                 - Get homepage stats (PUBLIC - No auth)
GET    /dashboard/stats       - Get admin stats (Admin/NGO)
GET    /volunteers            - Get volunteers list (Admin/NGO)
```

---

## 📊 Database Schema

### **Tables:**

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **users** | User accounts | id, name, email, password, phone, role |
| **volunteers** | Volunteer program | id, user_id, availability, experience, status |
| **rescue_reports** | Rescue cases | id, case_id, location, issue_type, status, assigned_volunteer_id |
| **lost_pets** | Lost dog reports | id, user_id, pet_name, breed, color, status |
| **found_pets** | Found dog reports | id, user_id, breed, color, size, status |
| **adoption_listings** | Dogs for adoption | id, dog_name, breed, age, gender, status |
| **adoption_applications** | Adoption requests | id, listing_id, user_id, applicant_info, status |
| **sterilization_reports** | Sterilization needs | id, user_id, location, dog_count, status |

---

## 🎯 Key Features

### ✅ **Public Features (No Login Required)**
- Browse lost & found dogs with search filters
- View adoption listings
- Search and filter dogs by breed, size, location
- View homepage statistics
- Contact dog owners via phone link
- Read about platform features

### ✅ **User Features (Login Required)**
- Report rescue cases with photo upload
- Report lost pets with details and images
- Report found dogs to help reunite families
- Apply for dog adoption
- Join volunteer program
- Report sterilization program needs
- Track status of their submissions
- View notifications

### ✅ **Admin/NGO Features**
- Dashboard with complete statistics
- Manage adoption listings and applications
- Update rescue case statuses
- Assign volunteers to cases
- View all reports and submissions
- Approve/reject adoption applications
- Update pet statuses
- View volunteer information

---

## 🎨 UI/UX Elements

### **Animations**
- Splash screen fade-out (600ms)
- Button hover effects with scale
- Floating orbs animation (6-8s infinite)
- Card slide-in animations
- Typewriter text animation
- Pulse animations on active elements
- Shimmer effects on loading states
- Smooth transitions on all interactive elements

### **CSS Features**
- CSS Grid for layouts
- Flexbox for alignment
- Linear & radial gradients
- Box shadows for depth
- Backdrop filters
- Keyframe animations
- Media queries for responsiveness
- CSS variables for theming

### **Interactive Elements**
- Responsive navbar with toggle menu
- Hover tooltips on buttons
- Form validation with error messages
- Auto-load functionality on pages
- Search filters with real-time results
- Modal popups for forms
- Alert notifications

---

## 🚀 Deployment & Running

### **Prerequisites**
```bash
- Node.js 14+ installed
- npm 6+ installed
- SQLite3 support
```

### **Installation**
```bash
# Navigate to project directory
cd c:\Users\vishw\.cursor

# Install dependencies
npm install

# Initialize database
npm run init-db
```

### **Running the Server**
```bash
# Start server
npm start

# Or with auto-reload in development
npm run dev

# Server runs on http://localhost:3001
```

### **Initialize Data**
```bash
# Create default NGO account
npm run ensure-ngo

# Run migrations if needed
npm run migrate
```

---

## 📈 Statistics Dashboard

The homepage displays **real-time statistics** automatically fetched from the database:

- **Rescue Cases:** Count of resolved rescue_reports
- **Adoptions:** Count of adopted adoption_listings
- **Active Volunteers:** Count of active volunteers
- **Pets Reunited:** Count of found lost_pets

**API Endpoint:** `GET /api/admin/stats` (Public, no authentication required)

**Response:**
```json
{
  "rescuesCases": 12,
  "adoptions": 8,
  "activeVolunteers": 25,
  "petsReunited": 5
}
```

---

## 🔍 Search & Filter Features

### **Lost & Found Search**
- Search by breed
- Filter by color
- Filter by size (Small, Medium, Large)
- Filter by location area
- Real-time filtering
- Public access (no login required)

### **Adoption Search**
- Browse all available dogs
- Filter by breed
- Filter by age
- Filter by size
- Filter by gender
- View detailed dog information
- Public access (no login required)

---

## 📱 Responsive Features

### **Mobile Optimization**
- Viewport meta tags for proper scaling
- Mobile-first CSS design
- Touch-friendly buttons (min 44px)
- Hamburger menu for navigation
- Optimized font sizes
- Stack layouts on small screens
- Full-width forms and inputs

### **Desktop Experience**
- Grid-based layouts
- Multi-column displays
- Horizontal navigation
- Hover effects and transitions
- Optimized image sizes

---

## 🛡️ Security Features

✅ **Password Security**
- Bcryptjs hashing with salt rounds
- Minimum password requirements
- Secure session tokens (JWT)

✅ **API Security**
- JWT authentication on protected routes
- Rate limiting middleware
- CORS enabled for origins
- Input validation on all endpoints

✅ **Data Protection**
- Role-based access control
- User data isolation
- Secure file uploads (size & type validation)
- SQL injection prevention via parameterized queries

✅ **Authorization**
- Role-based route protection
- User context verification
- Admin-only operations secured
- NGO-specific data visibility

---

## 📝 File Upload Features

### **Supported Types**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)

### **Upload Locations**
- Rescue report images: `/public/uploads/rescue/`
- Lost pet images: `/public/uploads/lost/`
- Found pet images: `/public/uploads/found/`
- Adoption images: `/public/uploads/adoption/`

### **Limitations**
- Max file size: 5MB
- Automatic file validation
- Secure filename generation

---

## 🐛 Error Handling

The application includes comprehensive error handling:
- Form validation with user-friendly messages
- API error responses with status codes
- Console logging for debugging
- Fallback UI when APIs fail
- Session expiration handling
- Network error recovery

---

## 📞 Contact & Support

- **Email:** puppybro.org@example.com
- **Platform:** Dog Welfare Management System
- **Purpose:** Unite communities around dog welfare
- **Copyright:** © 2026 PuppyBro

---

## 🎓 Academic Project Info

**Project Name:** PuppyBro - Dog Welfare Management System  
**Course:** B.Tech IV Semester Real-Time Project  
**Project Type:** Full-stack web application  
**Team:** Developed as an academic project  

**Key Highlights:**
- Complete CRUD operations
- User authentication & authorization
- Database design with proper schema
- RESTful API architecture
- Responsive frontend design
- Modern animations & transitions
- Production-ready code structure

---

## 📚 Documentation

- **README.md** - Project overview & quick start
- **SETUP.md** - Detailed setup instructions
- **PROJECT_SUMMARY.md** - Project summary for presentations
- **USAGE_GUIDE.md** - How to use the application
- **NGO_ADMIN_GUIDE.md** - NGO & Admin features guide
- **WEBSITE_DETAILS.md** - This comprehensive guide

---

## ✨ Latest Updates (Feb 22, 2026)

✅ Splash screen updated with "Puppy Bro" branding  
✅ Animated dog icon (bouncing) on page load  
✅ Modern gradient background with brand colors  
✅ Animated floating orbs symbolizing movement  
✅ Glowing cursor effect matching brand colors  
✅ Text shadows with brand color for depth  
✅ Responsive mobile/desktop design  
✅ Smooth fade-out transition  
✅ **Real-time statistics auto-loading from database**  
✅ Public stats endpoint for homepage stats  

---

## 🚀 Next Steps

1. ✅ Server running on http://localhost:3001
2. ✅ Database initialized with all tables
3. ✅ Authentication system operational
4. ✅ All pages functional with styling
5. ✅ Real-time stats displaying
6. Ready for user testing and deployment

---

**Thank you for using PuppyBro! 🐕**

*Together, we're making a difference for every paw.*
