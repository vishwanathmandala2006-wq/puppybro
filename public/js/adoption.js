// Adoption Functions

// Load adoption listings
async function loadAdoptionListings() {
    const container = document.getElementById('listingsContainer');
    if (!container) return;

    try {
        const listings = await apiRequest('/adoption/listings');
        displayListings(listings);
    } catch (error) {
        container.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
    }
}

// Display adoption listings
function displayListings(listings) {
    const container = document.getElementById('listingsContainer');
    if (!container) return;

    if (!listings || listings.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🐕</div><p>No dogs available for adoption at the moment. Check back later!</p></div>';
        return;
    }

    let html = '<div class="grid grid-3">';
    listings.forEach(listing => {
        html += `
            <div class="card">
                ${listing.image_url ? `<img src="${listing.image_url}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 5px; margin-bottom: 1rem;">` : ''}
                <h3 class="card-title">${listing.dog_name}</h3>
                <div class="card-body">
                    <p><strong>Breed:</strong> ${listing.breed || 'Unknown'}</p>
                    <p><strong>Age:</strong> ${listing.age || 'Unknown'}</p>
                    <p><strong>Gender:</strong> ${listing.gender || 'Unknown'}</p>
                    <p><strong>Color:</strong> ${listing.color || 'Unknown'}</p>
                    <p><strong>Size:</strong> ${listing.size || 'Unknown'}</p>
                    <p><strong>Location:</strong> ${listing.location_area || 'N/A'}</p>
                    ${listing.description ? `<p><strong>Description:</strong> ${listing.description}</p>` : ''}
                    ${listing.health_status ? `<p><strong>Health:</strong> ${listing.health_status}</p>` : ''}
                    ${isAuthenticated() ? `<button onclick="openApplicationModal(${listing.id})" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Apply for Adoption</button>` : '<p style="color: #666; margin-top: 1rem;"><a href="login.html">Login to apply</a></p>'}
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// Open application modal
function openApplicationModal(listingId) {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const modal = document.getElementById('applicationModal');
    const form = document.getElementById('applicationForm');
    const user = getUser();

    document.getElementById('application_listing_id').value = listingId;
    if (user) {
        document.getElementById('application_name').value = user.name || '';
        document.getElementById('application_email').value = user.email || '';
    }

    modal.style.display = 'block';
}

// Close application modal
function closeApplicationModal() {
    const modal = document.getElementById('applicationModal');
    modal.style.display = 'none';
    document.getElementById('applicationForm').reset();
    document.getElementById('applicationAlert').innerHTML = '';
}

// Submit adoption application
async function submitAdoptionApplication(formData) {
    return await apiRequest('/adoption/apply', {
        method: 'POST',
        body: JSON.stringify(formData)
    });
}

// Handle application form submission
document.addEventListener('DOMContentLoaded', function() {
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const alertContainer = document.getElementById('applicationAlert');
            alertContainer.innerHTML = '';

            const formData = {
                listing_id: parseInt(document.getElementById('application_listing_id').value),
                applicant_name: document.getElementById('application_name').value,
                applicant_email: document.getElementById('application_email').value,
                applicant_phone: document.getElementById('application_phone').value,
                applicant_address: document.getElementById('application_address').value,
                reason: document.getElementById('application_reason').value || null,
                experience: document.getElementById('application_experience').value || null
            };

            try {
                await submitAdoptionApplication(formData);
                alertContainer.innerHTML = '<div class="alert alert-success">Application submitted successfully! You can track its status in the Track Status page.</div>';
                setTimeout(() => {
                    closeApplicationModal();
                    loadAdoptionListings();
                }, 2000);
            } catch (error) {
                alertContainer.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
            }
        });
    }

    // Close modal on outside click
    const modal = document.getElementById('applicationModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeApplicationModal();
            }
        });
    }
});

// Make functions globally available
window.openApplicationModal = openApplicationModal;
window.closeApplicationModal = closeApplicationModal;
