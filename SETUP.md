# PuppyBro - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize Database

```bash
npm run init-db
```

This will:
- Create the SQLite database file (`database/puppybro.db`)
- Create all required tables
- Create default admin user

### 3. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Default Admin Credentials

After database initialization:
- **Email:** `admin@puppybro.com`
- **Password:** `admin123`

**⚠️ Important:** Change the admin password after first login in production!

## Project Structure

```
puppybro/
├── server.js              # Main Express server
├── config/
│   └── database.js        # Database connection
├── routes/                # API route definitions
├── controllers/           # Business logic
├── middleware/           # Auth & upload middleware
├── database/
│   ├── schema.sql        # Database schema
│   └── puppybro.db       # SQLite database (created after init)
├── scripts/
│   └── init-db.js        # Database initialization script
└── public/               # Frontend files
    ├── index.html
    ├── css/
    ├── js/
    └── uploads/          # Uploaded images
```

## Features Implemented

✅ User Registration & Login  
✅ Rescue Reporting (Stray/Injured Dogs)  
✅ Lost & Found Pet Tracking  
✅ Dog Adoption Management  
✅ Volunteer Registration & Coordination  
✅ Sterilization Need Reporting  
✅ Admin Dashboard  
✅ Case Status Tracking  
✅ Image Upload Support  

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/volunteer-register` - Register as volunteer

### Rescue Reports
- `POST /api/rescue/report` - Submit rescue report
- `GET /api/rescue/my-reports` - Get user's reports
- `GET /api/rescue/admin/all` - Get all reports (Admin)
- `PUT /api/rescue/admin/:id/assign` - Assign volunteer (Admin)
- `PUT /api/rescue/admin/:id/update-status` - Update status (Admin)
- `PUT /api/rescue/volunteer/:id/update-status` - Update status (Volunteer)

### Lost/Found Pets
- `POST /api/lostfound/lost` - Report lost pet
- `POST /api/lostfound/found` - Report found dog
- `GET /api/lostfound/search` - Search lost/found pets

### Adoption
- `GET /api/adoption/listings` - Get adoption listings
- `POST /api/adoption/apply` - Apply for adoption
- `GET /api/adoption/my-applications` - Get user's applications
- `GET /api/adoption/admin/applications` - Get all applications (Admin)

### Sterilization
- `POST /api/sterilization/report` - Report sterilization need
- `GET /api/sterilization/my-reports` - Get user's reports
- `GET /api/sterilization/admin/all` - Get all reports (Admin)

## Testing the Application

1. **Register a new user:**
   - Go to Register page
   - Fill in details and submit

2. **Report a rescue case:**
   - Login
   - Go to "Report Dog" page
   - Fill in details and submit

3. **Search for lost/found pets:**
   - Go to "Lost & Found" page
   - Use search filters

4. **Apply for adoption:**
   - Go to "Adoption" page
   - Browse listings
   - Click "Apply for Adoption"

5. **Register as volunteer:**
   - Login
   - Go to "Volunteer" page
   - Fill in volunteer details

6. **Admin Dashboard:**
   - Login as admin
   - Go to Admin Dashboard
   - Manage all reports, assignments, and applications

## Troubleshooting

### Database Issues
- If database doesn't exist, run `npm run init-db`
- Delete `database/puppybro.db` and run init again to reset

### Port Already in Use
- Change PORT in `.env` file or environment variable
- Default port is 3000

### Image Upload Issues
- Ensure `public/uploads` directory exists
- Check file size (max 5MB)
- Supported formats: JPG, PNG, GIF

## Development Notes

- Uses SQLite for simplicity (can be migrated to PostgreSQL)
- JWT authentication with 7-day token expiry
- File uploads handled by Multer
- CORS enabled for API access
- Static files served from `public/` directory

## Production Deployment

Before deploying to production:

1. Change `JWT_SECRET` in `.env`
2. Change admin password
3. Use a production database (PostgreSQL recommended)
4. Set up proper file storage (AWS S3, etc.)
5. Enable HTTPS
6. Configure proper CORS settings
7. Set up environment variables securely

## Support

For issues or questions, refer to the README.md file or contact your project supervisor.
