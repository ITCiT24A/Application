class LeafletMap {

    constructor(containerId, center, zoom) {
        this.map = L.map(containerId).setView(center, zoom);
        this.initTileLayer();
        this.attendanceCountTEP = 0;
        this.attendanceCountCSS = 0;
        this.attendanceCountBA = 0;
        this.attendanceCountGOAT = 0;
        this.attendanceCountKiko = 0;

        this.markerCounts = {};
        this.markers = [];
        this.loggedData = [];

        // Elements for Buttons and Displaying Counts
        this.btn = document.getElementById('btn');
        this.btn1 = document.getElementById('btn1');
        this.btn2 = document.getElementById('btn2');
        this.btn3 = document.getElementById('btn3');
        this.btn4 = document.getElementById('btn4');
        this.btnclear = document.getElementById('btnclear');
        this.logCountElement = document.getElementById('logCountTEP');
        this.logCount1Element = document.getElementById('logCountCCS');
        this.logCount2Element = document.getElementById('logCountBA');
        this.logCount3Element = document.getElementById('logCountGOAT');
        this.logCount4Element = document.getElementById('logCountKkiko');
        this.idContainer = document.getElementById('logContainer');

        // Event Listeners for Button Clicks
        this.btn.addEventListener('click', () => this.dataTEP());
        this.btn1.addEventListener('click', () => this.dataCSS());
        this.btn2.addEventListener('click', () => this.dataBA());
        this.btn3.addEventListener('click', () => this.dataGOAT());
        this.btn4.addEventListener('click', () => this.dataKiko());
        this.btnclear.addEventListener('click', () => this.clearLogs());

    }

    // Initialize the Tile Layer for the Map
    initTileLayer() {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }

    // Add Marker to the Map
    addMarker(lat, long, message) {
        const marker = L.marker([lat, long]).addTo(this.map);
        this.markerCounts[message] = (this.markerCounts[message] || 0) + 1;
        this.updateMarkerPopup(marker, message);

        marker.on('click', () => {
            this.markerCounts[message]++;
            this.updateMarkerPopup(marker, message);
        });

        this.markers.push(marker);
    }

    // Update the Marker Popup with Attendance Count
    updateMarkerPopup(marker, message) {
        const count = this.markerCounts[message];
        marker.bindPopup(`${message}<br>Attendance: ${count}`).openPopup();
    }

    // Load Markers from JSON file
    loadMarkersFromJson(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.forEach(marker => {
                    this.addMarker(marker.latitude, marker.longitude, marker.message);
                });
            })
            .catch(error => console.error("Error loading servers:", error));
    }

    // Clear Logs and Reset Counts
    clearLogs() {
        this.attendanceCountTEP = 0;
        this.attendanceCountCSS = 0;
        this.attendanceCountBA = 0;
        this.attendanceCountGOAT = 0;
        this.attendanceCountKiko = 0;

        this.loggedData = [];
        this.markerCounts = {};
        this.markers.forEach(marker => {
            const message = marker.getPopup().getContent().split('<br>')[0];
            this.markerCounts[message] = 0;
            this.updateMarkerPopup(marker, message);
        });
        this.updateLogDisplay();
    }

    // Display Attendance Log Count
    displayLogCount() {
        this.logCountElement.innerHTML = `American Pygmy Goats: ${this.attendanceCountTEP}`;
        this.logCount1Element.innerHTML = `Nubian Goats : ${this.attendanceCountCSS}`;
        this.logCount2Element.innerHTML = `Alpine Grazing : ${this.attendanceCountBA}`;
        this.logCount3Element.innerHTML = `Tennessee Goats : ${this.attendanceCountGOAT}`;
        this.logCount4Element.innerHTML = `Kiko Goats : ${this.attendanceCountKiko}`;
    }

    // Functions for Each Pillar (Goat Types)
    dataTEP() {
        this.addMarker(8.3601987, 124.8594032, 'American Pygmy');
        this.attendanceCountTEP++;
        this.updateLogDisplay();
    }
    

    dataCSS() {
        this.addMarker(8.351333, 124.8743938, 'Nubian');
        this.attendanceCountCSS++;
        this.updateLogDisplay();
    }

    dataBA() {
        this.addMarker(8.3732710, 124.8666358, 'Alpine Grazing');
        this.attendanceCountBA++;
        this.updateLogDisplay();
    }

    dataGOAT() {
        this.addMarker(8.3548458, 124.8644220, 'Tennessee Goats');
        this.attendanceCountGOAT++;
        this.updateLogDisplay();
    }

    dataKiko() {
        this.addMarker(8.3578238, 124.8666672, 'Kiko Goat');
        this.attendanceCountKiko++;
        this.updateLogDisplay();
    }

    // Update and Display Log Data
    updateLogDisplay() {
        this.idContainer.innerHTML = '';
        this.loggedData.forEach(data => {
            const logItem = document.createElement('div');
            logItem.className = 'log-item';
            logItem.textContent = data;
            this.idContainer.appendChild(logItem);
        });
        this.displayLogCount();
    }
}

// Initialize the Map
const Mymap = new LeafletMap('map', [8.359735, 124.869206], 18);

// Load Markers from a JSON file
Mymap.loadMarkersFromJson('page2.json');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    Mymap.displayLogCount();
});
