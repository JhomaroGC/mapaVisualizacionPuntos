const CSV_URL = './data.csv';

// 1. Inicializar mapa Leaflet
const map = L.map('map').setView([6.2644838, -75.4945626], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    className: 'map-tiles-dark',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const markersGroup = L.layerGroup().addTo(map);

// 2. Leer y procesar el archivo CSV
function cargarHistorial() {
    const statusElem = document.getElementById('status-api');
    const totalElem = document.getElementById('total-registros');
    const listaElem = document.getElementById('lista-conexiones');

    statusElem.innerText = 'Cargando...';
    statusElem.style.color = '#38bdf8';

    Papa.parse(CSV_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            let historial = results.data;
            // Ordenar descendente: Más actual arriba -> Más antiguo abajo
            historial.sort((a, b) => new Date(b.connectedAt).getTime() - new Date(a.connectedAt).getTime());

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
                // Convertir las coordenadas de string a número decimal
                const lat = parseFloat(item.lat);
                const lng = parseFloat(item.lng);
                const { name, anonId, connectedAt, color } = item;

                const dateConexion = new Date(connectedAt);

                const yearNum = dateConexion.getFullYear();
                const monthNum = dateConexion.getMonth() + 1;
                const dayNum = dateConexion.getDate();
                const hourNum = dateConexion.getHours();
                const minuteNum = dateConexion.getMinutes();
                const secondNum = dateConexion.getSeconds();

                const dateNow = new Date();

                const yearNow = dateNow.getFullYear();
                const monthNow = dateNow.getMonth() + 1;
                const dayNow = dateNow.getDate();
                const hourNow = 23;
                const minuteNow = 59;
                const secondNow = 59;

                // Suma matemática de todos los componentes
                const totalFechaHoraConexion = yearNum + monthNum + dayNum + hourNum + minuteNum + secondNum;
                const totalSumaNow = yearNow + monthNow + dayNow + hourNow + minuteNow + secondNow;

                //Calculo de opacidad
                const opacidad = (totalSumaNow - totalFechaHoraConexion) / 100;

                console.log(`${totalSumaNow}-${totalFechaHoraConexion}`);
                if (!isNaN(lat) && !isNaN(lng)) {
                    const puntoCoords = [lat, lng];
                    bounds.push(puntoCoords);

                    const markerColor = `rgba(${245}, ${49}, ${104}, ${opacidad})`;
                    const marker = L.circleMarker(puntoCoords, {
                        radius: 8,
                        fillColor: markerColor,
                        color: '#ffffff',
                        weight: 2,
                        opacity: opacidad,
                        fillOpacity: opacidad
                    });

                    const fechaFormateada = connectedAt ? new Date(connectedAt).toLocaleString() : 'N/A';

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

                    const listItem = document.createElement('div');
                    listItem.className = 'list-item';
                    listItem.innerHTML = `
                        <div class="item-header">
                            <span class="item-title">
                                <span class="color-badge" style="background-color: ${markerColor}"></span>
                                ${name || 'Dispositivo Anónimo'}
                            </span>
                            
                        </div>
                        <span class="item-time">Conexión: ${connectedAt ? new Date(connectedAt).toLocaleTimeString([], {year: '2-digit',month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''}</span>
                        <div class="item-coords">ID: ${anonId}</div>
                        <div class="item-coords">Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}</div>
                    `;

                    listItem.addEventListener('click', () => {
                        map.flyTo(puntoCoords, 16, { duration: 1.2 });
                        marker.openPopup();
                    });

                    listaElem.appendChild(listItem);
                }
            });

            if (bounds.length > 0) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        },
        error: function (error) {
            console.error('Error al procesar data.csv:', error);
            statusElem.innerText = 'Error';
            statusElem.style.color = '#f87171';
            listaElem.innerHTML = `
                <div style="color: #f87171; text-align: center; padding: 20px; font-size: 0.85rem;">
                    <p style="font-weight: 600; margin-bottom: 6px;">Error al leer data.csv</p>
                    <p style="color: var(--text-muted);">Verifica que el archivo data.csv exista en la raíz.</p>
                </div>
            `;
        }
    });
}

// Cargar datos al iniciar
cargarHistorial();