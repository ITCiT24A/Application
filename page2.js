class LeafletMap {

    constructor(containerId, center, zoom) {
        this.map = L.map(containerId).setView(center, zoom);
        this.initTileLayer();
        this.attendanceCountTEP = 0;
        this.attendanceCountCSS = 0;
        this.attendanceCountBA = 0;
        this.attendanceCountGOAT= 0;
        this.attendanceCountKiko= 0;

        this.markerCounts = {};
        this.markers = [];
        this.loggedData = []; 

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

        this.btn.addEventListener('click', () => this.dataTEP());
        this.btn1.addEventListener('click', () => this.dataCSS());
        this.btn2.addEventListener('click', () => this.dataBA());
        this.btn3.addEventListener('click', () => this.dataGOAT());
        this.btn4.addEventListener('click', () => this.dataKiko());
        this.btnclear.addEventListener('click', () => this.clearLogs());

    }
    initTileLayer() {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }

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
    
    updateMarkerPopup(marker, message) {
        const count = this.markerCounts[message];
        marker.bindPopup(`${message}<br>Attendance: ${count}`).openPopup();
    }
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
    
