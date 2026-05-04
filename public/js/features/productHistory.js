let map;

function initMap() {
    
    const historyData = window.PRODUCT_HISTORY_DATA;
    if (!historyData || historyData.length === 0) return;

    const pathCoords = historyData.map(step => [
        parseFloat(step.latitude), 
        parseFloat(step.longitude)
    ]).filter(coord => !isNaN(coord[0]) && !isNaN(coord[1]));

    if (pathCoords.length === 0) return;

    setTimeout(() => {
        if (!map) {
            // Khởi tạo lần đầu
            map = L.map('map').setView(pathCoords[0], 13);
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }).addTo(map);
        } else {
            map.invalidateSize();
        }

        map.eachLayer((layer) => {
            if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                map.removeLayer(layer);
            }
        });

        // Vẽ Marker & Polyline
        pathCoords.forEach((coord, index) => {
            const step = historyData[index];
            L.marker(coord).addTo(map).bindPopup(`<b>Mốc ${index+1}:</b> ${step.location}`);
        });

        if (pathCoords.length > 1) {
            const polyline = L.polyline(pathCoords, {color: '#198754', weight: 4}).addTo(map);
            map.fitBounds(polyline.getBounds());
        }
        
        map.invalidateSize();
    }, 400); 
}

document.addEventListener('DOMContentLoaded', initMap);