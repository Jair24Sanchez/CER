document.addEventListener('DOMContentLoaded', function() {
    const eventTypeSelect = document.getElementById('eventType');
    const secondaryFilter = document.getElementById('secondaryFilter');
    const eventsGrid = document.querySelector('.events-grid');

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

    // Función para cargar eventos basados en los filtros seleccionados
    async function loadEvents() {
        const eventType = eventTypeSelect.value;
        const filterValue = secondaryFilter.value;
        
        try {
            // Mostrar estado de carga
            showLoadingState();
            
            const events = await fetchEvents(eventType, filterValue);
            displayEvents(events);
        } catch (error) {
            console.error('Error loading events:', error);
            showErrorMessage('No se pudieron cargar los eventos');
        }
    }

    // Función simulada para obtener eventos
    async function fetchEvents(eventType, filterValue) {
        // Aquí iría tu llamada real a la API
        return [
            {
                thumbnail: './event-thumbnail.jpg',
                title: 'Título del Evento',
                organizer: {
                    avatar: './organizer-avatar.jpg',
                    name: 'Nombre del Organizador'
                },
                date: '24 Mar 2024',
                reward: '$50 USD',
                type: eventType,
                country: 'US',
                status: 'declined'
            }
            // Más eventos aquí...
        ];
    }

    // Función para mostrar los eventos en el grid
    function displayEvents(events) {
        // Mantener el botón de reporte libre
        const freeReportBox = document.querySelector('.free-report-box');
        eventsGrid.innerHTML = '';
        eventsGrid.appendChild(freeReportBox);

        if (events.length === 0) {
            showNoEventsMessage();
            return;
        }

        events.forEach(event => {
            const eventElement = createEventElement(event);
            eventsGrid.appendChild(eventElement);
        });
    }

    // Función para crear el elemento HTML de un evento
    function createEventElement(event) {
        const div = document.createElement('div');
        div.className = 'event-box';
        div.innerHTML = `
            <img src="${event.thumbnail || './default-thumbnail.jpg'}" alt="Event thumbnail" class="event-thumbnail">
            <h3 class="event-title">${event.title}</h3>
            <div class="organizer-info">
                <img src="${event.organizer.avatar || './default-avatar.svg'}" alt="Organizer" class="organizer-avatar">
                <span class="organizer-name">${event.organizer.name}</span>
            </div>
            <div class="event-details">
                <span class="event-date">${formatDate(event.date)}</span>
                <span class="event-reward">${formatReward(event.reward)}</span>
                <span class="event-type">${event.type}</span>
                ${event.country ? `<img src="./flags/${event.country.toLowerCase()}.png" alt="${event.country} flag" class="country-flag">` : ''}
            </div>
            <div class="event-status ${event.status.toLowerCase()}">${event.status}</div>
        `;
        return div;
    }

    function showLoadingState() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-state';
        loadingDiv.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Cargando eventos...</p>
        `;
        eventsGrid.appendChild(loadingDiv);
    }

    function showNoEventsMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'no-events-message';
        messageDiv.innerHTML = `
            <p>No hay eventos disponibles para los filtros seleccionados</p>
        `;
        eventsGrid.appendChild(messageDiv);
    }

    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        eventsGrid.appendChild(errorDiv);
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    function formatReward(reward) {
        if (typeof reward === 'number') {
            return `$${reward} USD`;
        }
        return reward; // Para casos como "Voluntary" u otros formatos
    }

    // Event listeners
    eventTypeSelect.addEventListener('change', updateSecondaryFilter);
    secondaryFilter.addEventListener('change', loadEvents);

    // Event listener para el botón de reporte libre
    document.querySelector('.free-report-btn').addEventListener('click', () => {
        // Aquí irá la lógica para iniciar un reporte libre
        console.log('Iniciando reporte libre...');
    });

    // Inicializar filtros
    updateSecondaryFilter();
});

// Listas de países e idiomas (estas podrían estar en archivos separados)
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