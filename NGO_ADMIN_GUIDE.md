# NGO & Admin Login Guide

## Overview

PuppyBro now supports separate login systems for **Admin** and **NGO** users. Both roles have access to view all reports, manage adoptions, and update complaint statuses.

## Key Features

### ✅ What Both Admin & NGO Can Do:
- View all rescue reports
- View all lost & found pets
- View all sterilization reports
- Add dogs for adoption
- Update adoption listing status
- Approve/reject adoption applications
- Update rescue report status
- Update sterilization report status
- View dashboard statistics

### 🔑 Admin Only Features:
- Assign volunteers to rescue cases
- View volunteers list

### 🏢 NGO Only Features:
- Register new NGO accounts
- Manage their own organization's activities

---

## Login Pages

### 1. Admin Login
**URL:** `admin-login.html`

**Default Credentials:**
- Email: `admin@puppybro.com`
- Password: `admin123`

**Features:**
- Full access to all management features
- Can assign volunteers to cases
- Can view volunteers list

### 2. NGO Login
**URL:** `ngo-login.html`

**Default Credentials:**
- Email: `ngo@puppybro.com`
- Password: `ngo123`

**Features:**
- Can view all reports
- Can manage adoptions
- Can update statuses
- Cannot assign volunteers (Admin only)

### 3. Regular User Login
**URL:** `login.html`

**Features:**
- For general users
- Can submit reports
- Can apply for adoptions
- Can track their own reports

---

## NGO Registration

### How to Register as NGO:

1. Go to **NGO Registration** page (`ngo-register.html`)
2. Fill in the form:
   - **Organization Name** (required)
   - **Contact Person Name** (required)
   - **Email Address** (required)
   - **Password** (required, min 6 characters)
   - **Phone Number** (optional)
   - **Organization Address** (optional)
3. Click **"Register NGO"**
4. You'll be automatically logged in and redirected to Dashboard

---

## Dashboard Access

### For Admin:
- Login at `admin-login.html`
- Redirected to `admin-dashboard.html`
- Full access to all tabs including Volunteers

### For NGO:
- Login at `ngo-login.html` OR Register at `ngo-register.html`
- Redirected to `admin-dashboard.html`
- Access to all tabs except Volunteers (hidden)

---

## Managing Reports

### View All Reports:
1. Login as Admin or NGO
2. Go to Dashboard
3. Click on respective tabs:
   - **Rescue Reports** - View all rescue cases
   - **Lost & Found** - View all lost/found pets
   - **Sterilization** - View all sterilization reports

### Update Report Status:

#### Rescue Reports:
1. Go to **Rescue Reports** tab
2. Find the report you want to update
3. Select new status from dropdown:
   - Reported
   - Assigned
   - Resolved
   - Closed
4. Click **"Update"** button

**Note:** Only Admin can assign volunteers. NGO can only update status.

#### Sterilization Reports:
1. Go to **Sterilization** tab
2. Find the report
3. Select status:
   - Reported
   - Noted
   - Planned
   - Completed
4. Click **"Update"** button

---

## Managing Adoptions

### Add Dog for Adoption:

1. Login as Admin or NGO
2. Go to Dashboard → **Adoptions** tab
3. Click **"Add New Listing"** button
4. Fill in dog details:
   - Dog Name (required)
   - Breed, Age, Gender
   - Color, Size
   - Description
   - Health Status
   - Location Area
   - Upload photo (optional)
5. Click **"Create Listing"**

### Approve/Reject Applications:

1. Go to **Adoptions** tab
2. Scroll to **"Adoption Applications"** section
3. View all pending applications
4. Click **"Approve"** or **"Reject"** button
5. Status updates automatically

### Update Listing Status:

1. In **Adoptions** tab
2. Find the listing
3. Select status:
   - Available
   - Pending
   - Adopted
4. Click **"Update"** button

---

## User Tracking

When Admin/NGO updates a report status, users can track it:

1. User logs in
2. Goes to **"Track Status"** page
3. Views all their submitted reports
4. Sees updated status and admin notes

---

## Quick Reference

### Login URLs:
- Admin: `http://localhost:3000/admin-login.html`
- NGO: `http://localhost:3000/ngo-login.html`
- User: `http://localhost:3000/login.html`
- NGO Register: `http://localhost:3000/ngo-register.html`

### Default Credentials:

**Admin:**
- Email: `admin@puppybro.com`
- Password: `admin123`

**NGO:**
- Email: `ngo@puppybro.com`
- Password: `ngo123`

---

## Important Notes

1. **Role-Based Access:** System automatically restricts features based on role
2. **Volunteer Assignment:** Only Admin can assign volunteers to cases
3. **Status Updates:** Both Admin and NGO can update report statuses
4. **Adoption Management:** Both can add listings and approve applications
5. **User Tracking:** Users can see status updates in real-time

---

## Troubleshooting

### Can't login as Admin/NGO:
- Check email and password
- Make sure you're using the correct login page
- Verify role in database if needed

### Can't see certain features:
- Check your role (Admin vs NGO)
- Some features are Admin-only (volunteer assignment)
- Refresh the page after login

### Users can't see status updates:
- Make sure Admin/NGO updated the status
- User should check "Track Status" page
- Status updates are immediate

---

**For more details, refer to USAGE_GUIDE.md**
