
const MY_API_KEY = "MAPQUEST_API_KEY";

let myMap;
let myMarker;
const JAMAICA_CENTER = [18.1096, -77.2975];
const JAMAICA_ZOOM = 10;

window.onload = function() {
    L.mapquest.key = MY_API_KEY;
    myMap = L.mapquest.map('map', {
        center: JAMAICA_CENTER,
        layers: L.mapquest.tileLayer('map'),
        zoom: JAMAICA_ZOOM
    });
    myMarker = L.mapquest.textMarker(JAMAICA_CENTER, {
        text: '🇯🇲 Jamaica',
        position: 'right',
        icon: { primaryColor: '#ffd700', secondaryColor: '#009933', size: 'md' }
    }).addTo(myMap);
    
    document.getElementById('searchButton').onclick = () => {
        let place = document.getElementById('searchBox').value;
        if (place) searchPlace(place);
    };
};

async function searchPlace(placeName) {
    let url = `https://www.mapquestapi.com/geocoding/v1/address?key=${MY_API_KEY}&location=${encodeURIComponent(placeName)}`;
    try {
        let response = await fetch(url);
        let data = await response.json();
        let loc = data.results[0].locations[0];
        let lat = loc.latLng.lat, lng = loc.latLng.lng;
        myMap.flyTo([lat, lng], 14);
        if (myMarker) myMap.removeLayer(myMarker);
        myMarker = L.mapquest.textMarker([lat, lng], {
            text: loc.adminArea5 + ', ' + loc.adminArea3,
            position: 'right',
            icon: { primaryColor: '#ff0000', secondaryColor: '#333', size: 'md' }
        }).addTo(myMap);
    } catch (e) { alert("Not found"); }
}
