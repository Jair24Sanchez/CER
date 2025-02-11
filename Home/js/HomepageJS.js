document.addEventListener('DOMContentLoaded', function() {
    const eventTypeSelect = document.getElementById('eventType');
    const secondaryFilter = document.getElementById('secondaryFilter'); // Cambiado para coincidir con el nuevo ID
    const timeFrameSelect = document.getElementById('timeFrame');
    const mainEventsList = document.getElementById('mainEventsList');

    // Función para actualizar el segundo filtro basado en la selección del tipo de evento
    function updateSecondaryFilter() {
        const eventType = eventTypeSelect.value;
        secondaryFilter.innerHTML = ''; // Limpiar opciones actuales
        
        if (eventType === 'irl') {
            // Cambiar a filtro de países
            secondaryFilter.innerHTML = '<option value="">Country</option>';
            
            // Cargar lista de países
            window.countriesList.forEach(country => {
                const option = document.createElement('option');
                option.value = country.code.toLowerCase();
                option.textContent = country.name;
                secondaryFilter.appendChild(option);
            });
        } else {
            // Cambiar a filtro de idiomas
            secondaryFilter.innerHTML = '<option value="">Language</option>';
            
            // Cargar lista de idiomas
            window.languagesList.forEach(lang => {
                const option = document.createElement('option');
                option.value = lang.code;
                option.textContent = lang.name;
                secondaryFilter.appendChild(option);
            });
        }

        // Actualizar eventos mostrados
        loadEvents();
    }

    // Función para cargar eventos basados en los filtros
    function loadEvents() {
        const eventType = eventTypeSelect.value;
        const filterValue = secondaryFilter.value;
        const timeFrame = timeFrameSelect.value;
        
        // Aquí iría la llamada a tu API para obtener los eventos filtrados
        fetchEvents(eventType, filterValue, timeFrame)
            .then(events => {
                displayEvents(events);
            })
            .catch(error => {
                console.error('Error loading events:', error);
            });
    }

    // Event listeners
    eventTypeSelect.addEventListener('change', updateSecondaryFilter);
    secondaryFilter.addEventListener('change', loadEvents);
    timeFrameSelect.addEventListener('change', loadEvents);

    // Inicializar filtros y cargar eventos iniciales
    updateSecondaryFilter();
});

// Asegúrate de que estas listas estén disponibles globalmente
window.countriesList = [
    { code: 'US', name: 'United States' },
    { code: 'ES', name: 'Spain' },
    { code: 'FR', name: 'France' },
    // ... más países
];

window.languagesList = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    // ... más idiomas
];