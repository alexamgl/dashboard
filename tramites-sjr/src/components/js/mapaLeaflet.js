document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el mapa
    const map = L.map('map', {
      zoomControl: true
    }).setView([20.3860, -99.9961], 16); // Coordenadas de San Juan del Río, Zoom 16
  
    // Agregar la capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    // Forzar redibujar el mapa después de que se cargue
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  
    // **Reutilizar la lógica del select para inicializar**
    const initialLat = 20.3860;
    const initialLng = -99.9961;
    const initialPlaceName = "San Juan del Río";
  
    // Crear marcador inicial y centrar el mapa
    let currentMarker = L.marker([initialLat, initialLng]).addTo(map);
    currentMarker.bindPopup(initialPlaceName, { autoPan: false }).openPopup();
  
    // Asegurar que el mapa esté completamente centrado después del popup
    setTimeout(() => {
      map.setView([initialLat, initialLng], 16);
      map.invalidateSize(); // Forzar el redibujado del mapa
    }, 200);
  
    // Obtener referencia al select
    const locationSelect = document.getElementById('locationSelect');
  
    // Manejar el cambio de selección
    locationSelect.addEventListener('change', (event) => {
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
      map.setView([lat, lng], 16); // Zoom nivel 16
  
      // Eliminar el marcador anterior si existe
      if (currentMarker) {
        map.removeLayer(currentMarker);
      }
  
      // Crear un nuevo marcador
      currentMarker = L.marker([lat, lng]).addTo(map);
  
      // Vincular un popup al marcador sin modificar la vista del mapa
      currentMarker.bindPopup(placeName, { autoPan: false });
  
      // Abrir el popup después de centrar el mapa
      currentMarker.openPopup();
  
      // Garantizar que el mapa se mantenga centrado después de abrir el popup
      map.invalidateSize(); // Redibujar el mapa para asegurarse de que todo se actualice
    });
  });
  