// Rescue Reporting Functions

// Share location using Geolocation API
async function shareMyLocation() {
    const statusEl = document.getElementById('locationStatus');
    const areaInput = document.getElementById('location_area');
    
    if (!navigator.geolocation) {
        statusEl.textContent = 'Geolocation is not supported by your browser.';
        statusEl.style.color = '#E74C3C';
        return;
    }
    
    statusEl.textContent = 'Getting location...';
    statusEl.style.color = '#F39C12';
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Store coordinates for form submission
            window._reportLatitude = lat;
            window._reportLongitude = lng;
            
            // Reverse geocode to get address using OpenStreetMap Nominatim (free, no API key)
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                    { headers: { 'Accept-Language': 'en' } }
                );
                const data = await response.json();
                const addr = data.address || {};
                const parts = [
                    addr.road || addr.street,
                    addr.suburb || addr.neighbourhood || addr.village,
                    addr.city_district || addr.town || addr.city
                ].filter(Boolean);
                areaInput.value = parts.length ? parts.join(', ') : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            } catch (e) {
                areaInput.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            }
            
            statusEl.textContent = `Location captured (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
            statusEl.style.color = '#28A745';
        },
        (error) => {
            window._reportLatitude = null;
            window._reportLongitude = null;
            let msg = 'Could not get location. ';
            if (error.code === 1) msg += 'Permission denied.';
            else if (error.code === 2) msg += 'Location unavailable.';
            else msg += 'Please enter location manually.';
            statusEl.textContent = msg;
            statusEl.style.color = '#E74C3C';
        }
    );
}

// Submit rescue report
async function submitRescueReport(formData) {
    const token = getToken();
    if (!token) {
        throw new Error('Please login to submit a report');
    }

    const formDataToSend = new FormData();
    formDataToSend.append('location_area', formData.location_area);
    formDataToSend.append('location_description', formData.location_description || '');
    formDataToSend.append('issue_type', formData.issue_type);
    formDataToSend.append('description', formData.description);
    
    if (formData.latitude != null) formDataToSend.append('latitude', formData.latitude);
    if (formData.longitude != null) formDataToSend.append('longitude', formData.longitude);
    
    if (formData.image) {
        formDataToSend.append('image', formData.image);
    }

    const response = await fetch('/api/rescue/report', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
    });

    const data = await response.json();

    if (!response.ok) {
        if (response.status === 401) {
            logout();
            throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.error || 'Failed to submit report');
    }

    return data;
}

// Get user's rescue reports
async function getMyRescueReports() {
    return await apiRequest('/rescue/my-reports');
}

// Get all rescue reports (Admin)
async function getAllRescueReports() {
    return await apiRequest('/rescue/admin/all');
}

// Get volunteer cases
async function getVolunteerCases() {
    return await apiRequest('/rescue/volunteer/cases');
}

// Assign volunteer to case (Admin)
async function assignVolunteer(reportId, volunteerId) {
    return await apiRequest(`/rescue/${reportId}/assign`, {
        method: 'PUT',
        body: JSON.stringify({ volunteerId })
    });
}

// Update case status
async function updateRescueStatus(reportId, status, adminNotes = null) {
    return await apiRequest(`/rescue/${reportId}/update-status`, {
        method: 'PUT',
        body: JSON.stringify({ status, admin_notes: adminNotes })
    });
}

// Handle rescue report form submission
document.addEventListener('DOMContentLoaded', function() {
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const alertContainer = document.getElementById('alertContainer');
            alertContainer.innerHTML = '';

            const formData = {
                location_area: document.getElementById('location_area').value,
                location_description: document.getElementById('location_description').value,
                issue_type: document.getElementById('issue_type').value,
                description: document.getElementById('description').value,
                image: document.getElementById('image').files[0] || null,
                latitude: window._reportLatitude != null ? window._reportLatitude : null,
                longitude: window._reportLongitude != null ? window._reportLongitude : null
            };

            try {
                const result = await submitRescueReport(formData);
                alertContainer.innerHTML = `
                    <div class="alert alert-success">
                        Report submitted successfully!<br>
                        Case ID: <strong>${result.caseId}</strong><br>
                        <a href="track-status.html">Track your report status</a>
                    </div>
                `;
                reportForm.reset();
                document.getElementById('imagePreview').innerHTML = '';
            } catch (error) {
                alertContainer.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
            }
        });
    }
});
