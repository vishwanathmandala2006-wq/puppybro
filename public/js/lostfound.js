// Lost & Found Functions

// Report lost pet
async function reportLostPet(formData) {
    const token = getToken();
    if (!token) {
        throw new Error('Please login to submit a report');
    }

    const formDataToSend = new FormData();
    formDataToSend.append('pet_name', formData.pet_name || '');
    formDataToSend.append('breed', formData.breed || '');
    formDataToSend.append('color', formData.color);
    formDataToSend.append('size', formData.size || '');
    formDataToSend.append('location_area', formData.location_area);
    formDataToSend.append('location_description', formData.location_description || '');
    formDataToSend.append('description', formData.description || '');
    formDataToSend.append('contact_phone', formData.contact_phone);
    
    if (formData.image) {
        formDataToSend.append('image', formData.image);
    }

    const response = await fetch('/api/lostfound/lost', {
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

// Report found dog
async function reportFoundDog(formData) {
    const token = getToken();
    if (!token) {
        throw new Error('Please login to submit a report');
    }

    const formDataToSend = new FormData();
    formDataToSend.append('breed', formData.breed || '');
    formDataToSend.append('color', formData.color);
    formDataToSend.append('size', formData.size || '');
    formDataToSend.append('location_area', formData.location_area);
    formDataToSend.append('location_description', formData.location_description || '');
    formDataToSend.append('description', formData.description || '');
    formDataToSend.append('contact_phone', formData.contact_phone);
    
    if (formData.image) {
        formDataToSend.append('image', formData.image);
    }

    const response = await fetch('/api/lostfound/found', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
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

// Display search results
function displaySearchResults(results) {
    const container = document.getElementById('searchResults');
    if (!container) return;

    // Handle undefined results
    if (!results) {
        container.innerHTML = '<div class="alert alert-error">Error loading results. Please try again.</div>';
        return;
    }

    let html = '';

    if (results.lost && results.lost.length > 0) {
        html += '<h3 style="margin-bottom: 1rem;">Lost Pets</h3>';
        html += '<div class="grid grid-2">';
        results.lost.forEach(pet => {
            html += `
                <div class="card">
                    <div class="card-header">
                        <strong>${pet.pet_name || 'Unknown'}</strong>
                        <span class="badge badge-reported">Lost</span>
                    </div>
                    <div class="card-body">
                        ${pet.image_url ? `<img src="${pet.image_url}" style="max-width: 100%; border-radius: 5px; margin-bottom: 1rem;">` : ''}
                        <p><strong>Breed:</strong> ${pet.breed || 'Unknown'}</p>
                        <p><strong>Color:</strong> ${pet.color}</p>
                        <p><strong>Size:</strong> ${pet.size || 'Unknown'}</p>
                        <p><strong>Location:</strong> ${pet.location_area}</p>
                        <p><strong>Contact:</strong> ${pet.contact_phone ? `<a href="tel:${pet.contact_phone}">${pet.contact_phone}</a> <a class="btn btn-outline" href="tel:${pet.contact_phone}" style="margin-left:8px;">Contact Owner</a>` : 'Not provided'}</p>
                        <p><a class="btn btn-primary" href="#" onclick="handleReportFound('${encodeURIComponent(pet.breed||'')}','${encodeURIComponent(pet.color||'')}','${encodeURIComponent(pet.size||'')}','${encodeURIComponent(pet.location_area||'')}', '${pet.id}'); return false;">Report if Found</a></p>
                        ${pet.description ? `<p><strong>Description:</strong> ${pet.description}</p>` : ''}
                        <p><small>Reported: ${new Date(pet.created_at).toLocaleDateString()}</small></p>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }

    if (results.found && results.found.length > 0) {
        html += '<h3 style="margin-top: 2rem; margin-bottom: 1rem;">Found Dogs</h3>';
        html += '<div class="grid grid-2">';
        results.found.forEach(pet => {
            html += `
                <div class="card">
                    <div class="card-header">
                        <strong>Found Dog</strong>
                        <span class="badge badge-approved">Found</span>
                    </div>
                    <div class="card-body">
                        ${pet.image_url ? `<img src="${pet.image_url}" style="max-width: 100%; border-radius: 5px; margin-bottom: 1rem;">` : ''}
                        <p><strong>Breed:</strong> ${pet.breed || 'Unknown'}</p>
                        <p><strong>Color:</strong> ${pet.color}</p>
                        <p><strong>Size:</strong> ${pet.size || 'Unknown'}</p>
                        <p><strong>Location:</strong> ${pet.location_area}</p>
                        <p><strong>Contact:</strong> ${pet.contact_phone ? `<a href="tel:${pet.contact_phone}">${pet.contact_phone}</a> <a class="btn btn-outline" href="tel:${pet.contact_phone}" style="margin-left:8px;">Contact Owner</a>` : 'Not provided'}</p>
                        ${pet.description ? `<p><strong>Description:</strong> ${pet.description}</p>` : ''}
                        <p><small>Reported: ${new Date(pet.created_at).toLocaleDateString()}</small></p>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }

    if (!results.lost?.length && !results.found?.length) {
        html = '<div class="empty-state"><div class="empty-state-icon">🔍</div><p>No matching pets found. Try different search criteria.</p></div>';
    }

    container.innerHTML = html;
}

// Handle form submissions
document.addEventListener('DOMContentLoaded', function() {
    const lostForm = document.getElementById('lostForm');
    if (lostForm) {
        lostForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const alertContainer = document.getElementById('lostAlert');
            alertContainer.innerHTML = '';

            const formData = {
                pet_name: document.getElementById('lost_pet_name').value,
                breed: document.getElementById('lost_breed').value,
                color: document.getElementById('lost_color').value,
                size: document.getElementById('lost_size').value,
                location_area: document.getElementById('lost_area').value,
                description: document.getElementById('lost_description').value,
                contact_phone: document.getElementById('lost_phone').value,
                image: document.getElementById('lost_image').files[0] || null
            };

            try {
                await reportLostPet(formData);
                alertContainer.innerHTML = '<div class="alert alert-success">Lost pet report submitted successfully!</div>';
                lostForm.reset();
            } catch (error) {
                alertContainer.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
            }
        });
    }

    const foundForm = document.getElementById('foundForm');
    if (foundForm) {
        foundForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const alertContainer = document.getElementById('foundAlert');
            alertContainer.innerHTML = '';

            const formData = {
                breed: document.getElementById('found_breed').value,
                color: document.getElementById('found_color').value,
                size: document.getElementById('found_size').value,
                location_area: document.getElementById('found_area').value,
                description: document.getElementById('found_description').value,
                contact_phone: document.getElementById('found_phone').value,
                image: document.getElementById('found_image').files[0] || null
            };

            try {
                await reportFoundDog(formData);
                alertContainer.innerHTML = '<div class="alert alert-success">Found dog report submitted successfully!</div>';
                foundForm.reset();
            } catch (error) {
                alertContainer.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
            }
        });
    }

    // Prefill found form when coming from a 'Report if Found' button
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('report_found')) {
        const breed = urlParams.get('breed') || '';
        const color = urlParams.get('color') || '';
        const size = urlParams.get('size') || '';
        const location_area = urlParams.get('location_area') || '';
        const ref_id = urlParams.get('ref_id') || '';

        if (document.getElementById('found_breed')) document.getElementById('found_breed').value = decodeURIComponent(breed);
        if (document.getElementById('found_color')) document.getElementById('found_color').value = decodeURIComponent(color);
        if (document.getElementById('found_size')) document.getElementById('found_size').value = decodeURIComponent(size);
        if (document.getElementById('found_area')) document.getElementById('found_area').value = decodeURIComponent(location_area);

        // Add a hidden field to link found report to the original lost report
        if (ref_id) {
            const hidden = document.createElement('input');
            hidden.type = 'hidden';
            hidden.name = 'reported_for_id';
            hidden.id = 'reported_for_id';
            hidden.value = ref_id;
            foundForm.appendChild(hidden);
        }
    }

    // Handler to check auth before redirecting to found form
    window.handleReportFound = function(breed, color, size, location_area, ref_id) {
        const token = getToken();
        const params = `report_found=1&breed=${breed}&color=${color}&size=${size}&location_area=${location_area}&ref_id=${ref_id}`;
        if (!token) {
            // Redirect to login with next param so user can return
            const next = encodeURIComponent(`lost-found.html?${params}`);
            window.location.href = `login.html?next=${next}`;
            return;
        }
        window.location.href = `lost-found.html?${params}`;
    };
});

// Global search function
window.searchPets = async function() {
    const searchParams = {
        area: document.getElementById('search_area')?.value || '',
        color: document.getElementById('search_color')?.value || '',
        breed: document.getElementById('search_breed')?.value || ''
    };

    try {
        const results = await searchPetsData(searchParams);
        displaySearchResults(results);
    } catch (error) {
        const container = document.getElementById('searchResults');
        if (container) {
            container.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
        }
    }
};

// Search pets (renamed from searchPets to avoid naming conflicts)
async function searchPetsData(searchParams = {}) {
    const token = getToken();
    const params = new URLSearchParams();
    
    if (searchParams.area) params.append('area', searchParams.area);
    if (searchParams.color) params.append('color', searchParams.color);
    if (searchParams.breed) params.append('breed', searchParams.breed);
    if (searchParams.type) params.append('type', searchParams.type);

    const url = `/api/lostfound/search?${params.toString()}`;
    
    const response = await fetch(url, {
        headers: token ? {
            'Authorization': `Bearer ${token}`
        } : {}
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Search failed');
    }

    return data;
}
