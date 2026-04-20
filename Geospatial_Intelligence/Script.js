

const MY_API_KEY = "dePastogvfeCHckeZxW6RPy96jTqAH0X";

let myMap;
let myMarker;

const JAMAICA_CENTER = [18.1096, -77.2975];
const JAMAICA_ZOOM = 10;


window.onload = function() {
    console.log("🇯🇲 Initializing Jamaica Geospatial Dashboard...");
    
    
    L.mapquest.key = MY_API_KEY;
    
   
    myMap = L.mapquest.map('map', {
        center: JAMAICA_CENTER,
        layers: L.mapquest.tileLayer('map'),
        zoom: JAMAICA_ZOOM
    });
    
    
    addMarker(JAMAICA_CENTER, '🇯🇲 Jamaica', '#009933');
    
    console.log("✅ Map initialized successfully!");
    
    
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
    console.log("🔍 Searching for: " + placeName);
    

    showLoading(true);
    
 
    const searchAttempts = [
        placeName + ', Jamaica',
        placeName + ' Jamaica',
        placeName
    ];
    
    for (let searchQuery of searchAttempts) {
        const url = `https://www.mapquestapi.com/geocoding/v1/address?key=${MY_API_KEY}&location=${encodeURIComponent(searchQuery)}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.results?.[0]?.locations?.[0]) {
                const location = data.results[0].locations[0];
                const lat = location.latLng.lat;
                const lng = location.latLng.lng;
                
               
                const displayName = buildDisplayName(location) || placeName;
                
                console.log("✅ Found: " + displayName + " at " + lat + ", " + lng);
                
            
                myMap.flyTo([lat, lng], 13);
                
              
                const isInJamaica = location.adminArea1 === 'JM';
                const markerColor = isInJamaica ? '#009933' : '#dc3545';
                addMarker([lat, lng], displayName, markerColor);
                
               
                updateLocationBadge(displayName);
                showLoading(false);
                
                return; 
            }
        } catch (error) {
            console.log("Error with '" + searchQuery + "':", error);
        }
    }
    
   
    showLoading(false);
    showAlert('Location not found. Try: Kingston, Montego Bay, Ocho Rios, or Negril', 'danger');
    console.log("❌ Could not find: " + placeName);
}


function buildDisplayName(location) {
    const parts = [];
    if (location.street) parts.push(location.street);
    if (location.adminArea5) parts.push(location.adminArea5);
    if (location.adminArea3) parts.push(location.adminArea3);
    return parts.join(', ');
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
            secondaryColor: '#333',
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
    addMarker(JAMAICA_CENTER, '🇯🇲 Jamaica', '#009933');
    updateLocationBadge('Jamaica');
    document.getElementById('searchBox').value = '';
    console.log("🔄 Reset to Jamaica view");
}
