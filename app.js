/*
// Ruta al archivo JSON local
const JSON_URL = './data.json';

// 1. Inicializar mapa Leaflet centrado en Antioquia
const map = L.map('map').setView([6.2644838, -75.4945626], 12);

// Capa de mapa libre (OpenStreetMap con filtro oscuro CSS)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    className: 'map-tiles-dark',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Grupo de capas para los marcadores
const markersGroup = L.layerGroup().addTo(map);

// 2. Función para leer el archivo data.json local y renderizar
async function cargarHistorial() {
    const statusElem = document.getElementById('status-api');
    const totalElem = document.getElementById('total-registros');
    const listaElem = document.getElementById('lista-conexiones');

    statusElem.innerText = 'Cargando...';
    statusElem.style.color = '#38bdf8';

    try {
        const response = await fetch(JSON_URL);

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        const historial = data.historialConexiones || [];

        // Limpiar capas y lista previa
        markersGroup.clearLayers();
        listaElem.innerHTML = '';

        totalElem.innerText = historial.length;
        statusElem.innerText = 'Carga Exitosa!';
        statusElem.style.color = '#4ade80';

        if (historial.length === 0) {
            listaElem.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">No hay registros disponibles</p>';
            return;
        }

        const bounds = [];

        historial.forEach((item) => {
            const { lat, lng, name, anonId, connectedAt, color } = item;

            if (lat && lng) {
                const puntoCoords = [lat, lng];
                bounds.push(puntoCoords);

                // Marcador circular con color dinámico del JSON
                const markerColor = color || '#38bdf8';
                const marker = L.circleMarker(puntoCoords, {
                    radius: 9,
                    fillColor: markerColor,
                    color: '#ffffff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.85
                });

                const fechaFormateada = new Date(connectedAt).toLocaleString();

                // Contenido del Popup
                const popupContent = `
                    <div class="popup-info">
                        <h3 style="margin-bottom: 6px; font-size: 1rem; color: #f8fafc;">${name || 'Dispositivo'}</h3>
                        <p style="margin: 3px 0;"><strong>ID:</strong> ${anonId || 'N/A'}</p>
                        <p style="margin: 3px 0;"><strong>Conexión:</strong> ${fechaFormateada}</p>
                        <p style="margin: 3px 0;"><strong>Coordenadas:</strong> ${lat.toFixed(5)}, ${lng.toFixed(5)}</p>
                    </div>
                `;

                marker.bindPopup(popupContent);
                markersGroup.addLayer(marker);

                // Crear tarjeta en la lista lateral
                const listItem = document.createElement('div');
                listItem.className = 'list-item';
                listItem.innerHTML = `
                    <div class="item-header">
                        <span class="item-title">
                            <span class="color-badge" style="background-color: ${markerColor}"></span>
                            ${name || 'Dispositivo Anónimo'}
                        </span>                        
                        
                    </div>
                    <span class="item-time">Conexión: ${new Date(connectedAt).toLocaleString([], {day:'2-digit',month:'2-digit',year:'numeric', hour: '2-digit', minute:'2-digit'})}</span>
                    <div class="item-coords">ID: ${anonId}</div>
                    <div class="item-coords">Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}</div>
                `;

                // Vuelo interactivo hacia las coordenadas
                listItem.addEventListener('click', () => {
                    map.flyTo(puntoCoords, 16, { duration: 1.2 });
                    marker.openPopup();
                });

                listaElem.appendChild(listItem);
            }
        });

        // Reencuadrar mapa si hay marcadores
        if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }

    } catch (error) {
        console.error('Error al consultar data.json:', error);
        statusElem.innerText = 'Error';
        statusElem.style.color = '#f87171';
        listaElem.innerHTML = `
            <div style="color: #f87171; text-align: center; padding: 20px; font-size: 0.85rem;">
                <p style="font-weight: 600; margin-bottom: 6px;">Error al leer data.json</p>
                <p style="color: var(--text-muted);">Asegúrate de que el archivo data.json esté subido en la raíz del proyecto.</p>
            </div>
        `;
    }
}

// Cargar datos automáticamente al iniciar
cargarHistorial();

*/