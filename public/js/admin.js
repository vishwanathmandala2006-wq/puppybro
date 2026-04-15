// Admin Dashboard Functions

let currentTab = 'rescue';

// Load dashboard statistics
async function loadDashboard() {
    try {
        const stats = await apiRequest('/admin/dashboard/stats');
        displayStats(stats);
        loadTabContent('rescue');
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Display dashboard statistics
function displayStats(stats) {
    const container = document.getElementById('dashboardStats');
    container.innerHTML = `
        <div class="dashboard-stat-card">
            <div class="dashboard-stat-number">${stats.totalUsers}</div>
            <div class="dashboard-stat-label">Total Users</div>
        </div>
        <div class="dashboard-stat-card">
            <div class="dashboard-stat-number">${stats.totalVolunteers}</div>
            <div class="dashboard-stat-label">Active Volunteers</div>
        </div>
        <div class="dashboard-stat-card">
            <div class="dashboard-stat-number">${stats.rescueReports}</div>
            <div class="dashboard-stat-label">Rescue Reports</div>
        </div>
        <div class="dashboard-stat-card">
            <div class="dashboard-stat-number">${stats.adoptionListings}</div>
            <div class="dashboard-stat-label">Available Adoptions</div>
        </div>
        <div class="dashboard-stat-card">
            <div class="dashboard-stat-number">${stats.pendingAdoptions}</div>
            <div class="dashboard-stat-label">Pending Adoptions</div>
        </div>
        <div class="dashboard-stat-card">
            <div class="dashboard-stat-number">${stats.sterilizationReports}</div>
            <div class="dashboard-stat-label">Sterilization Reports</div>
        </div>
    `;
}

// Show tab
function showTab(tabName) {
    currentTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('[id^="tab-"]').forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
    });
    const activeBtn = document.getElementById(`tab-${tabName}`);
    if (activeBtn) {
        activeBtn.classList.remove('btn-outline');
        activeBtn.classList.add('btn-primary');
    }
    
    loadTabContent(tabName);
}

// Load tab content
async function loadTabContent(tabName) {
    const container = document.getElementById('tabContent');
    container.innerHTML = '<div class="spinner"></div>';

    try {
        switch(tabName) {
            case 'rescue':
                await loadRescueReports();
                break;
            case 'adoption':
                await loadAdoptionManagement();
                break;
            case 'lostfound':
                await loadLostFound();
                break;
            case 'sterilization':
                await loadSterilization();
                break;
            case 'volunteers':
                await loadVolunteers();
                break;
        }
    } catch (error) {
        container.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
    }
}

// Load rescue reports
async function loadRescueReports() {
    const container = document.getElementById('tabContent');
    const reports = await apiRequest('/rescue/admin/all');
    const user = getUser();
    const isAdminUser = user && user.role === 'admin';
    
    let html = '<h3>Rescue Reports</h3>';
    html += '<div class="table-container"><table><thead><tr><th>Case ID</th><th>Type</th><th>Priority</th><th>Location</th><th>Reporter</th><th>Status</th><th>Volunteer</th><th>Actions</th></tr></thead><tbody>';

    // Only admin can assign volunteers, NGO can only update status
    let volunteers = [];
    if (isAdminUser) {
        try {
            volunteers = await apiRequest('/admin/volunteers');
        } catch (error) {
            console.error('Error loading volunteers:', error);
        }
    }

    reports.forEach(report => {
        const isHighPriority = (report.priority === 'High' || report.issue_type === 'Aggressive');
        html += `
            <tr style="${isHighPriority ? 'background-color: #fff3cd;' : ''}">
                <td>${report.case_id}</td>
                <td>${report.issue_type}</td>
                <td>${isHighPriority ? '<span class="badge" style="background:#E74C3C;color:white;">HIGH PRIORITY</span>' : 'Normal'}</td>
                <td>${report.location_area}${report.latitude && report.longitude ? ` <small>(${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)})</small>` : ''}</td>
                <td>${report.reporter_name}</td>
                <td><span class="badge badge-${report.status.toLowerCase()}">${report.status}</span></td>
                <td>${report.volunteer_name || 'Not Assigned'}</td>
                <td>
                    ${isAdminUser && report.status === 'Reported' ? `
                        <select id="volunteer_${report.id}" style="margin-right: 0.5rem;">
                            <option value="">Select Volunteer</option>
                            ${volunteers.map(v => `<option value="${v.id}">${v.name}</option>`).join('')}
                        </select>
                        <button onclick="assignVolunteer(${report.id})" class="btn btn-primary btn-sm">Assign</button>
                    ` : ''}
                    <select id="status_${report.id}" style="margin-left: 0.5rem;">
                        <option value="Reported" ${report.status === 'Reported' ? 'selected' : ''}>Reported</option>
                        <option value="Assigned" ${report.status === 'Assigned' ? 'selected' : ''}>Assigned</option>
                        <option value="Resolved" ${report.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                        <option value="Closed" ${report.status === 'Closed' ? 'selected' : ''}>Closed</option>
                    </select>
                    <button onclick="updateRescueStatus(${report.id})" class="btn btn-primary btn-sm">Update</button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// Load adoption management
async function loadAdoptionManagement() {
    const container = document.getElementById('tabContent');
    const listings = await apiRequest('/adoption/admin/listings');
    const applications = await apiRequest('/adoption/admin/applications');

    let html = '<h3>Adoption Listings</h3>';
    html += '<button onclick="showAddListingForm()" class="btn btn-primary" style="margin-bottom: 1rem;">Add New Listing</button>';
    html += '<div class="grid grid-2">';
    listings.forEach(listing => {
        html += `
            <div class="card">
                <h4>${listing.dog_name}</h4>
                ${listing.image_url ? `<img src="${listing.image_url}" style="max-width: 100%; border-radius: 5px; margin-bottom: 1rem;">` : ''}
                <p><strong>Status:</strong> <span class="badge badge-${listing.status.toLowerCase()}">${listing.status}</span></p>
                <select id="listing_status_${listing.id}">
                    <option value="Available" ${listing.status === 'Available' ? 'selected' : ''}>Available</option>
                    <option value="Pending" ${listing.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Adopted" ${listing.status === 'Adopted' ? 'selected' : ''}>Adopted</option>
                </select>
                <button onclick="updateListingStatus(${listing.id})" class="btn btn-primary btn-sm">Update</button>
            </div>
        `;
    });
    html += '</div>';

    html += '<h3 style="margin-top: 2rem;">Adoption Applications</h3>';
    html += '<div class="table-container"><table><thead><tr><th>Dog</th><th>Applicant</th><th>Contact</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    applications.forEach(app => {
        html += `
            <tr>
                <td>${app.dog_name}</td>
                <td>${app.applicant_name}</td>
                <td>${app.applicant_phone}</td>
                <td><span class="badge badge-${app.status.toLowerCase()}">${app.status}</span></td>
                <td>
                    ${app.status === 'Pending' ? `
                        <button onclick="updateApplicationStatus(${app.id}, 'Approved')" class="btn btn-success btn-sm">Approve</button>
                        <button onclick="updateApplicationStatus(${app.id}, 'Rejected')" class="btn btn-danger btn-sm">Reject</button>
                    ` : ''}
                </td>
            </tr>
        `;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// Load lost & found with status update controls
async function loadLostFound() {
    const container = document.getElementById('tabContent');
    const lost = await apiRequest('/lostfound/admin/lost');
    const found = await apiRequest('/lostfound/admin/found');

    let html = '<h3>Lost Pets</h3>';
    html += '<div class="table-container"><table><thead><tr><th>Pet</th><th>Location</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    lost.forEach(pet => {
        html += `
            <tr>
                <td>${escapeHtml(pet.pet_name || 'Unknown')}</td>
                <td>${escapeHtml(pet.location_area)}</td>
                <td><span class="badge badge-${(pet.status || '').toLowerCase()}">${escapeHtml(pet.status)}</span></td>
                <td>
                    <select id="lost_status_${pet.id}">
                        <option value="Lost" ${pet.status === 'Lost' ? 'selected' : ''}>Lost</option>
                        <option value="Found" ${pet.status === 'Found' ? 'selected' : ''}>Found</option>
                        <option value="Closed" ${pet.status === 'Closed' ? 'selected' : ''}>Closed</option>
                    </select>
                    <button onclick="updateLostPetStatus(${pet.id})" class="btn btn-primary btn-sm">Update</button>
                </td>
            </tr>
        `;
    });
    html += '</tbody></table></div>';

    html += '<h3 style="margin-top: 2rem;">Found Dogs</h3>';
    html += '<div class="table-container"><table><thead><tr><th>Location</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    found.forEach(pet => {
        html += `
            <tr>
                <td>${escapeHtml(pet.location_area)}</td>
                <td><span class="badge badge-${(pet.status || '').toLowerCase()}">${escapeHtml(pet.status)}</span></td>
                <td>
                    <select id="found_status_${pet.id}">
                        <option value="Found" ${pet.status === 'Found' ? 'selected' : ''}>Found</option>
                        <option value="Claimed" ${pet.status === 'Claimed' ? 'selected' : ''}>Claimed</option>
                        <option value="Closed" ${pet.status === 'Closed' ? 'selected' : ''}>Closed</option>
                    </select>
                    <button onclick="updateFoundPetStatus(${pet.id})" class="btn btn-primary btn-sm">Update</button>
                </td>
            </tr>
        `;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function escapeHtml(s) {
    if (s == null) return '';
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
}

async function updateLostPetStatus(petId) {
    const status = document.getElementById(`lost_status_${petId}`)?.value;
    if (!status) return;
    try {
        await apiRequest(`/lostfound/lost/${petId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        alert('Status updated');
        loadTabContent('lostfound');
    } catch (e) {
        alert('Error: ' + (e.message || 'Failed'));
    }
}

async function updateFoundPetStatus(petId) {
    const status = document.getElementById(`found_status_${petId}`)?.value;
    if (!status) return;
    try {
        await apiRequest(`/lostfound/found/${petId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        alert('Status updated');
        loadTabContent('lostfound');
    } catch (e) {
        alert('Error: ' + (e.message || 'Failed'));
    }
}

// Load sterilization reports
async function loadSterilization() {
    const container = document.getElementById('tabContent');
    const reports = await apiRequest('/sterilization/admin/all');

    let html = '<h3>Sterilization Reports</h3>';
    html += '<div class="table-container"><table><thead><tr><th>Location</th><th>Dog Count</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    reports.forEach(report => {
        html += `
            <tr>
                <td>${report.location_area}</td>
                <td>${report.dog_count || 'N/A'}</td>
                <td><span class="badge badge-${report.status.toLowerCase()}">${report.status}</span></td>
                <td>
                    <select id="ster_status_${report.id}">
                        <option value="Reported" ${report.status === 'Reported' ? 'selected' : ''}>Reported</option>
                        <option value="Noted" ${report.status === 'Noted' ? 'selected' : ''}>Noted</option>
                        <option value="Planned" ${report.status === 'Planned' ? 'selected' : ''}>Planned</option>
                        <option value="Completed" ${report.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    </select>
                    <button onclick="updateSterilizationStatus(${report.id})" class="btn btn-primary btn-sm">Update</button>
                </td>
            </tr>
        `;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// Load volunteers (Admin only)
async function loadVolunteers() {
    const container = document.getElementById('tabContent');
    const user = getUser();
    
    // Only admin can view volunteers
    if (!user || user.role !== 'admin') {
        container.innerHTML = '<div class="alert alert-error">Only admin can view volunteers.</div>';
        return;
    }
    
    const volunteers = await apiRequest('/admin/volunteers');

    let html = '<h3>Volunteers</h3>';
    html += '<div class="table-container"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Areas Covered</th><th>Status</th></tr></thead><tbody>';
    volunteers.forEach(vol => {
        html += `
            <tr>
                <td>${vol.name}</td>
                <td>${vol.email}</td>
                <td>${vol.phone || 'N/A'}</td>
                <td>${vol.areas_covered || 'N/A'}</td>
                <td><span class="badge badge-${vol.status}">${vol.status}</span></td>
            </tr>
        `;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// Assign volunteer to rescue case
async function assignVolunteer(reportId) {
    const volunteerId = document.getElementById(`volunteer_${reportId}`).value;
    if (!volunteerId) {
        alert('Please select a volunteer');
        return;
    }

    try {
        await apiRequest(`/rescue/admin/${reportId}/assign`, {
            method: 'PUT',
            body: JSON.stringify({ volunteerId: parseInt(volunteerId) })
        });
        alert('Volunteer assigned successfully');
        loadTabContent('rescue');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Update rescue status
async function updateRescueStatus(reportId) {
    const status = document.getElementById(`status_${reportId}`).value;
    try {
        await apiRequest(`/rescue/admin/${reportId}/update-status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        alert('Status updated successfully');
        loadTabContent('rescue');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Update application status
async function updateApplicationStatus(applicationId, status) {
    try {
        await apiRequest(`/adoption/admin/application/${applicationId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        alert('Application status updated');
        loadTabContent('adoption');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Update listing status
async function updateListingStatus(listingId) {
    const status = document.getElementById(`listing_status_${listingId}`).value;
    try {
        await apiRequest(`/adoption/admin/listing/${listingId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        alert('Listing status updated');
        loadTabContent('adoption');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Update sterilization status
async function updateSterilizationStatus(reportId) {
    const status = document.getElementById(`ster_status_${reportId}`).value;
    try {
        await apiRequest(`/sterilization/${reportId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        alert('Status updated successfully');
        loadTabContent('sterilization');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Add Listing Modal
function showAddListingForm() {
    document.getElementById('addListingModal').style.display = 'block';
    document.getElementById('addListingForm').reset();
    document.getElementById('addListingAlert').innerHTML = '';
}

function closeAddListingModal() {
    document.getElementById('addListingModal').style.display = 'none';
}

// Submit Add Listing form
async function submitAddListing(e) {
    e.preventDefault();
    const alertEl = document.getElementById('addListingAlert');
    alertEl.innerHTML = '';

    const token = getToken();
    const user = getUser();

    console.log('[FORM-SUBMIT] Form submission started');
    console.log('[FORM-SUBMIT] User:', { id: user?.id, role: user?.role });
    console.log('[FORM-SUBMIT] Token exists:', !!token);

    const formData = new FormData();
    const fields = {
        dog_name: document.getElementById('al_dog_name').value,
        breed: document.getElementById('al_breed').value || '',
        age: document.getElementById('al_age').value || '',
        gender: document.getElementById('al_gender').value || '',
        color: document.getElementById('al_color').value || '',
        size: document.getElementById('al_size').value || '',
        description: document.getElementById('al_description').value || '',
        health_status: document.getElementById('al_health_status').value || '',
        location_area: document.getElementById('al_location_area').value || ''
    };

    // Log field extraction
    console.log('[FORM-SUBMIT] Fields:', {
        dog_name: !!fields.dog_name,
        location_area: !!fields.location_area,
        fieldsCount: Object.values(fields).filter(v => v).length
    });

    // Append all fields
    Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
        console.log(`[FORM-SUBMIT] Appended: ${key} = ${value ? value.substring(0, 20) : '(empty)'}`);
    });

    const img = document.getElementById('al_image').files[0];
    if (img) {
        formData.append('image', img);
        console.log('[FORM-SUBMIT] Image file:', { name: img.name, size: img.size, type: img.type });
    } else {
        console.log('[FORM-SUBMIT] No image file selected');
    }

    try {
        alertEl.innerHTML = '<div class="alert" style="background: #e3f2fd; color: #1976d2;">Submitting adoption listing...</div>';

        console.log('[FETCH] Preparing request:', {
            method: 'POST',
            url: '/api/adoption/admin/listing',
            tokenLength: token?.length,
            isAdmin: user?.role === 'admin' || user?.role === 'ngo'
        });

        const response = await fetch('/api/adoption/admin/listing', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        console.log('[FETCH] Response received:', {
            status: response.status,
            statusText: response.statusText,
            contentType: response.headers.get('content-type')
        });
        
        const data = await response.json();
        
        console.log('[FETCH] Response data:', data);
        
        if (!response.ok) {
            const errorMsg = data.error || data.details || `HTTP ${response.status}`;
            console.error('[FETCH] ✗ Request failed:', { status: response.status, error: data });
            throw new Error(errorMsg);
        }
        
        console.log('[FETCH] ✓ Success:', data);
        alertEl.innerHTML = '<div class="alert alert-success">Listing added successfully!</div>';
        setTimeout(() => {
            closeAddListingModal();
            loadTabContent('adoption');
        }, 1500);
    } catch (err) {
        console.error('[FORM-SUBMIT] ✗ Error:', {
            message: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString()
        });
        alertEl.innerHTML = `<div class="alert alert-error"><strong>Error:</strong> ${err.message}</div>`;
    }
}

// Attach form handler
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addListingForm');
    if (form) form.addEventListener('submit', submitAddListing);
    
    const modal = document.getElementById('addListingModal');
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeAddListingModal(); });
});

// Make functions globally available
window.showTab = showTab;
window.showAddListingForm = showAddListingForm;
window.closeAddListingModal = closeAddListingModal;
window.assignVolunteer = assignVolunteer;
window.updateRescueStatus = updateRescueStatus;
window.updateApplicationStatus = updateApplicationStatus;
window.updateListingStatus = updateListingStatus;
window.updateSterilizationStatus = updateSterilizationStatus;
window.updateLostPetStatus = updateLostPetStatus;
window.updateFoundPetStatus = updateFoundPetStatus;
