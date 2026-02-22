# PuppyBro - Complete Usage Guide

## 🚀 Getting Started

### Step 1: Install Dependencies

Open your terminal/command prompt in the project folder and run:

```bash
npm install
```

This will install all required packages (Express, SQLite, JWT, etc.)

### Step 2: Initialize Database

Create the database and tables:

```bash
```

npm run init-db
This creates:
- SQLite database file (`database/puppybro.db`)
- All required tables
- Default admin account

### Step 3: Start the Server

```bash
npm start
```

Or for development (auto-restart on changes):

```bash
npm run dev
```

You should see:
```
🚀 PuppyBro Server running on http://localhost:3000
📁 Database: database/puppybro.db

Default Admin Credentials:
   Email: admin@puppybro.com
   Password: admin123
```

### Step 4: Open in Browser

Open your web browser and go to:
```
http://localhost:3000
```

---

## 👤 For General Users

### 1. Create an Account

1. Click **"Register"** button (top right)
2. Fill in the form:
   - Full Name (required)
   - Email Address (required)
   - Password (required, min 6 characters)
   - Phone Number (optional)
   - Address (optional)
3. Click **"Register"**
4. You'll be automatically logged in

### 2. Report a Stray/Injured Dog

1. Login to your account
2. Click **"Report Dog"** in navigation
3. Fill in the form:
   - **Location Area** (e.g., "Downtown", "Park Street") - Required
   - **Location Description** (more specific details) - Optional
   - **Issue Type** - Select "Injured" or "Stray" - Required
   - **Description** - Describe the situation - Required
   - **Upload Image** - Optional (max 5MB, JPG/PNG/GIF)
4. Click **"Submit Report"**
5. Note your **Case ID** (e.g., RESCUE-XXXXX-XXXX)
6. You can track this report in "Track Status" page

### 3. Report Lost Pet

1. Go to **"Lost & Found"** page
2. In the **"Report Lost Pet"** section:
   - Pet Name (optional)
   - Breed (optional)
   - **Color** (required)
   - Size (Small/Medium/Large)
   - **Location Area** (required)
   - Description (optional)
   - **Contact Phone** (required)
   - Upload photo (optional)
3. Click **"Submit"**

### 4. Report Found Dog

1. Go to **"Lost & Found"** page
2. In the **"Report Found Dog"** section:
   - Breed (optional)
   - **Color** (required)
   - Size (Small/Medium/Large)
   - **Location Area** (required)
   - Description (optional)
   - **Contact Phone** (required)
   - Upload photo (optional)
3. Click **"Submit"**

### 5. Search Lost & Found Pets

1. Go to **"Lost & Found"** page
2. Scroll to **"Search Lost & Found"** section
3. Enter search criteria:
   - Area (optional)
   - Color (optional)
   - Breed (optional)
4. Click **"Search"**
5. Browse matching results

### 6. Apply for Adoption

1. Go to **"Adoption"** page
2. Browse available dogs
3. Click **"Apply for Adoption"** on a dog you like
4. Fill in the application form:
   - Applicant Name (auto-filled from your profile)
   - Email (auto-filled)
   - **Phone** (required)
   - **Address** (required)
   - Reason for Adoption (optional)
   - Previous Experience (optional)
5. Click **"Submit Application"**
6. Track your application status in **"Track Status"** page

### 7. Report Sterilization Need

1. Go to **"Sterilization"** page (or click in navigation)
2. Fill in the form:
   - **Location Area** (required)
   - Location Description (optional)
   - Estimated Dog Count (optional)
   - Description (optional)
3. Click **"Submit Report"**
4. Track status in **"Track Status"** page

### 8. Track Your Reports

1. Go to **"Track Status"** page
2. View all your submitted reports:
   - Rescue Reports (with Case IDs)
   - Adoption Applications
   - Sterilization Reports
3. See current status of each report
4. View admin notes if available

---

## 🤝 For Volunteers

### 1. Register as Volunteer

1. **First, create a user account** (if you haven't)
2. Login to your account
3. Go to **"Volunteer"** page
4. Fill in volunteer form:
   - **Availability** (e.g., "Weekends", "Evenings")
   - **Experience** (previous experience with dogs)
   - **Areas You Can Cover** (e.g., "Downtown, Park Street")
5. Click **"Register as Volunteer"**
6. Wait for admin to assign cases to you

### 2. View Assigned Cases

1. After admin assigns cases, go to **"Volunteer"** page
2. Scroll to **"My Assigned Cases"** section
3. View all cases assigned to you
4. Each case shows:
   - Case ID
   - Issue Type (Injured/Stray)
   - Location
   - Reporter contact details
   - Current status

### 3. Update Case Status

1. In **"My Assigned Cases"** section
2. Select new status from dropdown:
   - **Assigned** - Case is assigned but work in progress
   - **Resolved** - Case has been resolved
   - **Closed** - Case is closed
3. Click **"Update Status"**
4. Status is updated immediately

---

## 👨‍💼 For Admin/NGO

### 1. Login as Admin

1. Go to **"Login"** page
2. Use admin credentials:
   - **Email:** `admin@puppybro.com`
   - **Password:** `admin123`
3. Click **"Login"**
4. You'll see **"Admin"** link in navigation

### 2. Access Admin Dashboard

1. Click **"Admin"** in navigation (or go to `admin-dashboard.html`)
2. View dashboard statistics:
   - Total Users
   - Active Volunteers
   - Rescue Reports
   - Available Adoptions
   - Pending Adoptions
   - Sterilization Reports

### 3. Manage Rescue Reports

1. In Admin Dashboard, click **"Rescue Reports"** tab
2. View all rescue reports in a table
3. **Assign Volunteer:**
   - Select a volunteer from dropdown
   - Click **"Assign"** button
   - Case status changes to "Assigned"
4. **Update Status:**
   - Select status from dropdown
   - Click **"Update"** button
   - Statuses: Reported → Assigned → Resolved → Closed

### 4. Manage Adoptions

1. Click **"Adoptions"** tab in Admin Dashboard
2. **Add New Listing:**
   - Click **"Add New Listing"** button
   - Fill in dog details:
     - Dog Name (required)
     - Breed, Age, Gender
     - Color, Size
     - Description
     - Health Status
     - Location Area
     - Upload photo (optional)
   - Click **"Create Listing"**
3. **Update Listing Status:**
   - Select status: Available → Pending → Adopted
   - Click **"Update"**
4. **Review Applications:**
   - Scroll to "Adoption Applications" section
   - View all applications
   - **Approve:** Click **"Approve"** button
   - **Reject:** Click **"Reject"** button
   - Listing status automatically changes when approved

### 5. Manage Lost & Found

1. Click **"Lost & Found"** tab
2. View all lost pet reports
3. View all found dog reports
4. Update statuses as needed

### 6. Manage Sterilization Reports

1. Click **"Sterilization"** tab
2. View all sterilization reports
3. Update status:
   - **Reported** - Initial report
   - **Noted** - Admin has noted the report
   - **Planned** - Sterilization program planned
   - **Completed** - Program completed
4. Select status and click **"Update"**

### 7. View Volunteers

1. Click **"Volunteers"** tab
2. View all registered volunteers
3. See their:
   - Contact information
   - Areas covered
   - Availability
   - Status (Active/Inactive)

---

## 📱 Navigation Guide

### Main Navigation Links:

- **Home** - Landing page with overview
- **Report Dog** - Submit rescue reports
- **Lost & Found** - Report/search lost/found pets
- **Adoption** - Browse and apply for adoption
- **Volunteer** - Register as volunteer
- **Sterilization** - Report sterilization needs
- **Track Status** - View your reports status
- **Admin** - Admin dashboard (only visible to admins)

### User Menu (After Login):

- Shows your name: "Hello, [Your Name]"
- **Admin** link (only for admin users)
- **Logout** button

---

## 🔍 Common Workflows

### Workflow 1: Report and Resolve a Stray Dog

1. **User reports:**
   - User logs in → Report Dog → Fills form → Submits
   - Gets Case ID: RESCUE-XXXXX-XXXX

2. **Admin assigns:**
   - Admin logs in → Admin Dashboard → Rescue Reports
   - Selects volunteer → Clicks Assign

3. **Volunteer responds:**
   - Volunteer logs in → Volunteer page
   - Sees assigned case → Updates status to "Resolved"

4. **User tracks:**
   - User → Track Status → Sees updated status

### Workflow 2: Adoption Process

1. **Admin adds listing:**
   - Admin → Admin Dashboard → Adoptions → Add New Listing
   - Fills dog details → Creates listing

2. **User applies:**
   - User → Adoption page → Browses → Clicks Apply
   - Fills application → Submits

3. **Admin reviews:**
   - Admin → Admin Dashboard → Adoptions
   - Views application → Approves/Rejects

4. **User tracks:**
   - User → Track Status → Sees application status

### Workflow 3: Lost Pet Reunion

1. **Owner reports lost:**
   - User → Lost & Found → Report Lost Pet
   - Fills details → Submits

2. **Someone finds dog:**
   - User → Lost & Found → Report Found Dog
   - Fills details → Submits

3. **Search and match:**
   - Anyone → Lost & Found → Search
   - Filters by area/color/breed
   - Finds matches → Contacts owner

---

## ⚠️ Important Notes

### File Uploads:
- Maximum file size: **5MB**
- Supported formats: **JPG, PNG, GIF**
- Images are stored in `public/uploads/` folder

### Authentication:
- Login tokens expire after **7 days**
- You'll need to login again after expiration
- Logout clears your session

### Status Meanings:

**Rescue Reports:**
- **Reported** - Just submitted, waiting for assignment
- **Assigned** - Volunteer assigned, work in progress
- **Resolved** - Case resolved successfully
- **Closed** - Case closed

**Adoption Applications:**
- **Pending** - Waiting for admin review
- **Approved** - Application approved
- **Rejected** - Application rejected

**Sterilization Reports:**
- **Reported** - Initial report submitted
- **Noted** - Admin has noted it
- **Planned** - Program planned
- **Completed** - Program completed

---

## 🐛 Troubleshooting

### Server won't start:
- Check if port 3000 is already in use
- Change PORT in `.env` file if needed
- Make sure Node.js is installed

### Database errors:
- Run `npm run init-db` again
- Delete `database/puppybro.db` and reinitialize

### Can't login:
- Check if email/password is correct
- Make sure you've registered first
- Try clearing browser cache

### Images not uploading:
- Check file size (max 5MB)
- Check file format (JPG/PNG/GIF only)
- Ensure `public/uploads/` folder exists

### Can't see Admin link:
- Make sure you're logged in as admin
- Check user role in database
- Logout and login again

---

## 📞 Quick Reference

### Default Admin Login:
```
Email: admin@puppybro.com
Password: admin123
```

### Server URL:
```
http://localhost:3000
```

### Database Location:
```
database/puppybro.db
```

### Upload Directory:
```
public/uploads/
```

---

## 🎯 Tips for Best Experience

1. **Use clear descriptions** when reporting - helps volunteers/admin understand the situation
2. **Upload photos** whenever possible - makes identification easier
3. **Provide accurate location** - helps volunteers find the location quickly
4. **Check Track Status regularly** - stay updated on your reports
5. **Complete volunteer profile** - helps admin assign appropriate cases
6. **Use search filters** - narrow down lost/found pet searches

---

## 📚 Additional Resources

- **README.md** - Project overview and technical details
- **SETUP.md** - Detailed setup instructions
- **PROJECT_SUMMARY.md** - Complete project summary for viva

---

**Happy Using PuppyBro! 🐕❤️**
