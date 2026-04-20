

const MY_API_KEY = "API_KEY_HERE";

let myMap;
let myMarker;

const JAMAICA_CENTER = [18.1096, -77.2975];
const JAMAICA_ZOOM = 10;

window.onload = function() {
    console.log("🇯🇲 Loading Jamaica map...");
    
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
    
    let searchBox = document.getElementById('searchBox');
    let searchButton = document.getElementById('searchButton');
    
    searchButton.onclick = function() {
        let place = searchBox.value;
        if (place) {
            searchPlace(place);
        } else {
            alert("Please type a place name!");
        }
    };
    
    searchBox.onkeypress = function(event) {
        if (event.key === 'Enter') {
            let place = searchBox.value;
            if (place) {
                searchPlace(place);
            }
        }
    };
};

async function searchPlace(placeName) {
    console.log("🔍 Searching for: " + placeName);
    
    let url = `https://www.mapquestapi.com/geocoding/v1/address?key=${MY_API_KEY}&location=${encodeURIComponent(placeName)}`;
    
    try {
        let response = await fetch(url);
        let data = await response.json();
        
        let location = data.results[0].locations[0];
        let lat = location.latLng.lat;
        let lng = location.latLng.lng;
        let displayName = location.adminArea5 + ', ' + location.adminArea3;
        
        myMap.flyTo([lat, lng], 14);
        
        if (myMarker) {
            myMap.removeLayer(myMarker);
        }
        
        let markerColor = (displayName.includes('Jamaica') || location.adminArea1 === 'JM') ? '#009933' : '#ff0000';
        
        myMarker = L.mapquest.textMarker([lat, lng], {
            text: displayName || placeName,
            position: 'right',
            icon: {
                primaryColor: markerColor,
                secondaryColor: '#333',
                size: 'md'
            }
        }).addTo(myMap);
        
    } catch (error) {
        console.error("❌ Error:", error);
        alert("Location not found. Try again.");
    }
}
