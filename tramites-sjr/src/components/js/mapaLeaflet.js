document.addEventListener('DOMContentLoaded', () => {
  // Inicializar el mapa con un ID único
  const mapBecas = L.map('mapaBecas', {
    zoomControl: true
  }).setView([20.3860, -99.9961], 16); // Coordenadas de San Juan del Río, Zoom 16

  // Agregar la capa base de OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapBecas);

  // Forzar redibujar el mapa después de que se cargue
  setTimeout(() => {
    mapBecas.invalidateSize();
  }, 100);

  // **Reutilizar la lógica del select para inicializar**
  const initialLat = 20.3860;
  const initialLng = -99.9961;
  const initialPlaceName = "San Juan del Río";

  // Crear marcador inicial y centrar el mapa
  let currentMarkerBecas = L.marker([initialLat, initialLng]).addTo(mapBecas);
  currentMarkerBecas.bindPopup(initialPlaceName, { autoPan: false }).openPopup();

  // Asegurar que el mapa esté completamente centrado después del popup
  setTimeout(() => {
    mapBecas.setView([initialLat, initialLng], 16);
    mapBecas.invalidateSize(); // Forzar el redibujado del mapa
  }, 200);

  // Obtener referencia al select específico del mapa
  const locationSelectBecas = document.getElementById('ubicacion_tramite_beca');

  // Manejar el cambio de selección
  locationSelectBecas.addEventListener('change', (event) => {
    const selectedValue = event.target.value;

    // Validar si el valor es válido
    if (!selectedValue || selectedValue === 'hide') {
      alert('Por favor, selecciona una ubicación válida.');
      return;
    }

    // Obtener las coordenadas y el nombre del lugar
    const [lat, lng] = selectedValue.split(',').map(Number);
    const placeName = event.target.options[event.target.selectedIndex].text; // Nombre del lugar

    // Validar coordenadas
    if (isNaN(lat) || isNaN(lng)) {
      alert('Las coordenadas son inválidas.');
      return;
    }

    // Centrar el mapa en el marcador
    mapBecas.setView([lat, lng], 16); // Zoom nivel 16

    // Eliminar el marcador anterior si existe
    if (currentMarkerBecas) {
      mapBecas.removeLayer(currentMarkerBecas);
    }

    // Crear un nuevo marcador
    currentMarkerBecas = L.marker([lat, lng]).addTo(mapBecas);

    // Vincular un popup al marcador sin modificar la vista del mapa
    currentMarkerBecas.bindPopup(placeName, { autoPan: false });

    // Abrir el popup después de centrar el mapa
    currentMarkerBecas.openPopup();

    // Garantizar que el mapa se mantenga centrado después de abrir el popup
    mapBecas.invalidateSize(); // Redibujar el mapa para asegurarse de que todo se actualice
  });
});
