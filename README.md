# PuppyBro - Dog Welfare Management System

A complete web-based application for managing dog welfare activities including rescue operations, lost pet tracking, adoption management, and volunteer coordination.

## Project Overview

**Project Name:** PuppyBro  
**Purpose:** B.Tech IV Semester Real-Time Project  
**Domain:** Dog Welfare Management System

## Features

### For General Users
- Register/Login
- Report stray or injured dogs
- Report lost pets
- Report found dogs
- View adoption listings
- Apply for adoption
- Report sterilization needs
- Track status of submitted reports

### For Volunteers
- Register as volunteer
- View assigned rescue cases
- Update case status

### For Admin/NGO
- View all reports (rescue, lost pets, sterilization)
- Assign volunteers to rescue cases
- Update case status
- Manage adoption listings
- Approve/reject adoption applications

## Tech Stack

- **Backend:** Node.js + Express.js
- **Database:** SQLite3
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer

## Project Structure

```
puppybro/
├── server.js              # Main server file
├── config/
│   └── database.js        # Database configuration
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── rescue.js          # Rescue reporting routes
│   ├── lostfound.js       # Lost/Found pet routes
│   ├── adoption.js        # Adoption routes
│   ├── volunteer.js       # Volunteer routes
│   ├── sterilization.js   # Sterilization routes
│   └── admin.js           # Admin routes
├── controllers/
│   ├── authController.js
│   ├── rescueController.js
│   ├── lostfoundController.js
│   ├── adoptionController.js
│   ├── volunteerController.js
│   ├── sterilizationController.js
│   └── adminController.js
├── middleware/
│   ├── auth.js            # JWT authentication middleware
│   └── upload.js          # File upload middleware
├── scripts/
│   └── init-db.js         # Database initialization script
├── public/
│   ├── index.html         # Home page
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   ├── js/
│   │   ├── auth.js        # Authentication logic
│   │   ├── rescue.js      # Rescue reporting logic
│   │   ├── lostfound.js   # Lost/Found logic
│   │   ├── adoption.js    # Adoption logic
│   │   └── admin.js       # Admin dashboard logic
│   └── uploads/           # Uploaded images directory
└── database/
    └── schema.sql         # Database schema

```

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Initialize Database**
   ```bash
   npm run init-db
   ```

3. **Create .env file** (optional, defaults provided)
   ```env
   PORT=3000
   JWT_SECRET=your-secret-key-change-in-production
   ```

4. **Start Server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

5. **Access Application**
   - Open browser: `http://localhost:3000`

## Default Admin Credentials

After database initialization:
- Email: `admin@puppybro.com`
- Password: `admin123`

**Note:** Change admin password after first login in production!

## Database Schema

The system uses the following main tables:
- `users` - User accounts
- `volunteers` - Volunteer information
- `rescue_reports` - Stray/injured dog reports
- `lost_pets` - Lost pet reports
- `found_pets` - Found dog reports
- `adoption_listings` - Dogs available for adoption
- `adoption_applications` - Adoption requests
- `sterilization_reports` - Sterilization need reports

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/volunteer-register` - Volunteer registration

### Rescue Reports
- `POST /api/rescue/report` - Submit rescue report
- `GET /api/rescue/my-reports` - Get user's reports
- `GET /api/rescue/all` - Get all reports (Admin)
- `PUT /api/rescue/:id/assign` - Assign volunteer (Admin)
- `PUT /api/rescue/:id/update-status` - Update status

### Lost/Found Pets
- `POST /api/lostfound/lost` - Report lost pet
- `POST /api/lostfound/found` - Report found dog
- `GET /api/lostfound/search` - Search lost/found pets

### Adoption
- `GET /api/adoption/listings` - Get adoption listings
- `POST /api/adoption/apply` - Apply for adoption
- `GET /api/adoption/applications` - Get applications (Admin)
- `PUT /api/adoption/:id/approve` - Approve application (Admin)

### Sterilization
- `POST /api/sterilization/report` - Report sterilization need
- `GET /api/sterilization/all` - Get all reports (Admin)

## Development Notes

- This is a college-level academic project
- Focus is on functionality and clarity, not enterprise features
- SQLite database for simplicity (can be migrated to PostgreSQL)
- No payment integration, live chat, or AI/ML features
- Simple authentication without OAuth

## License

Academic Project - For Educational Purposes
