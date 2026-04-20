

const MY_API_KEY = "dePastogvfeCHckeZxW6RPy96jTqAH0X";

let myMap;
let myMarker;

const JAMAICA_CENTER = [18.1096, -77.2975];
const JAMAICA_ZOOM = 10;

window.onload = function() {
    console.log("🇯🇲 Loading map...");
    
    L.mapquest.key = MY_API_KEY;
    
    myMap = L.mapquest.map('map', {
        center: JAMAICA_CENTER,
        layers: L.mapquest.tileLayer('map'),
        zoom: JAMAICA_ZOOM
    });
    
    myMarker = L.mapquest.textMarker(JAMAICA_CENTER, {
        text: '🇯🇲 Jamaica',
        position: 'right',
        icon: {
            primaryColor: '#ffd700',
            secondaryColor: '#009933',
            size: 'md'
        }
    }).addTo(myMap);
    
    console.log("✅ Map ready!");
    
    document.getElementById('searchButton').onclick = function() {
        let place = document.getElementById('searchBox').value;
        if (place) {
            searchPlace(place);
        }
    };
    
    document.getElementById('searchBox').onkeypress = function(event) {
        if (event.key === 'Enter') {
            let place = document.getElementById('searchBox').value;
            if (place) {
                searchPlace(place);
            }
        }
    };
};

async function searchPlace(placeName) {
    console.log("🔍 Searching for: " + placeName);
    
    // Try different search formats
    let searches = [
        placeName + ', Jamaica',
        placeName + ' Jamaica',
        placeName
    ];
    
    for (let searchQuery of searches) {
        let url = `https://www.mapquestapi.com/geocoding/v1/address?key=${MY_API_KEY}&location=${encodeURIComponent(searchQuery)}`;
        
        try {
            let response = await fetch(url);
            let data = await response.json();
            
            console.log("API Response for '" + searchQuery + "':", data);
            
            // Check if we have valid results
            if (data.results && data.results[0] && data.results[0].locations && data.results[0].locations.length > 0) {
                let location = data.results[0].locations[0];
                
                // Get coordinates
                let lat = location.latLng.lat;
                let lng = location.latLng.lng;
                
                // Build display name
                let parts = [];
                if (location.street) parts.push(location.street);
                if (location.adminArea5) parts.push(location.adminArea5);
                if (location.adminArea3) parts.push(location.adminArea3);
                if (location.adminArea1) parts.push(location.adminArea1);
                
                let displayName = parts.join(', ') || placeName;
                
                console.log("✅ Found: " + lat + ", " + lng + " - " + displayName);
                
                // Fly to location
                myMap.flyTo([lat, lng], 12);
                
                // Update marker
                if (myMarker) {
                    myMap.removeLayer(myMarker);
                }
                
                myMarker = L.mapquest.textMarker([lat, lng], {
                    text: displayName,
                    position: 'right',
                    icon: {
                        primaryColor: '#ff0000',
                        secondaryColor: '#333',
                        size: 'md'
                    }
                }).addTo(myMap);
                
                return; // Success! Exit function
            }
        } catch (error) {
            console.log("Error with search '" + searchQuery + "':", error);
        }
    }
    
    // If we get here, nothing worked
    alert("Could not find: " + placeName + "\n\nTry: Kingston, Montego Bay, Ocho Rios, or Negril");
}
