

const MY_API_KEY = "dePastogvfeCHckeZxW6RPy96jTqAH0X";

let myMap;
let myMarker;

const JAMAICA_CENTER = [18.1096, -77.2975];
const JAMAICA_ZOOM = 9;


// Initialize the map when the page loads
window.onload = function() {    
    
    L.mapquest.key = MY_API_KEY;
    
   
    myMap = L.mapquest.map('map', {
        center: JAMAICA_CENTER,
        layers: L.mapquest.tileLayer('map'),
        zoom: JAMAICA_ZOOM
    });
    
    addMarker(JAMAICA_CENTER, 'Jamaica', '#009933');     
    setupEventListeners();
    updateLocationBadge('Jamaica');
};


function setupEventListeners() {
   
    document.getElementById('searchButton').onclick = function() {
        let place = document.getElementById('searchBox').value.trim();
        if (place) {
            searchPlace(place);
        } else {
            showAlert('Please enter a location!', 'warning');
        }
    };
    
   
    document.getElementById('searchBox').onkeypress = function(event) {
        if (event.key === 'Enter') {
            let place = document.getElementById('searchBox').value.trim();
            if (place) {
                searchPlace(place);
            }
        }
    };
    

    document.querySelectorAll('.quick-search').forEach(button => {
        button.onclick = function() {
            let place = this.textContent.trim();
            document.getElementById('searchBox').value = place;
            searchPlace(place);
        };
    });
}


async function searchPlace(placeName) {
    
    showLoading(true);
    
    // Append 'Jamaica' to the primary search to give only local results
    const searchQuery = placeName.toLowerCase().includes('jamaica') ? placeName : `${placeName}, Jamaica`;
    const url = `https://www.mapquestapi.com/geocoding/v1/address?key=${MY_API_KEY}&location=${encodeURIComponent(searchQuery)}`;
        
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        const location = data.results?.[0]?.locations?.[0];

        if (location && location.latLng && (location.latLng.lat !== 0 || location.latLng.lng !== 0)) {
            const lat = location.latLng.lat;
            const lng = location.latLng.lng;
            
            const displayName = buildDisplayName(location) || placeName;
            
            const isInJamaica = location.adminArea1 === 'JM';
            if (!isInJamaica) {
                showLoading(false);
                showAlert('Location found outside of Jamaica. Please search for a local place.', 'warning');
                return;
            }

            myMap.flyTo([lat, lng], 13);
            
            addMarker([lat, lng], placeName, '#009933');
            
            updateLocationBadge(displayName);
            showLoading(false);
            return;
        }
    } catch (error) {
        console.error("Search error:", error);
    }
    
    showLoading(false);
    showAlert('Location not found. Try: Kingston, Montego Bay, Ocho Rios, or Negril', 'danger');
}


function buildDisplayName(location) {
    return [location.street, location.adminArea5, location.adminArea3]
        .filter(part => part && part.trim() !== "")
        .join(', ');
}


function addMarker(coordinates, text, color) {
    if (myMarker) {
        myMap.removeLayer(myMarker);
    }
    
    myMarker = L.mapquest.textMarker(coordinates, {
        text: text,
        position: 'right',
        icon: {
            primaryColor: color,
            secondaryColor: '#333333',
            size: 'md'
        }
    }).addTo(myMap);
}


function updateLocationBadge(locationName) {
    const badge = document.getElementById('locationBadge');
    badge.innerHTML = `<i class="bi bi-geo-alt"></i> ${locationName}`;
}


function showLoading(isLoading) {
    const searchBtn = document.getElementById('searchButton');
    if (isLoading) {
        searchBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Searching...';
        searchBtn.disabled = true;
    } else {
        searchBtn.innerHTML = '<i class="bi bi-search"></i> Search';
        searchBtn.disabled = false;
    }
}


function showAlert(message, type) {
    alert(message); 
}


function resetToJamaica() {
    myMap.flyTo(JAMAICA_CENTER, JAMAICA_ZOOM);
    addMarker(JAMAICA_CENTER, 'Jamaica', '#009933');
    updateLocationBadge('Jamaica');
    document.getElementById('searchBox').value = '';
}
