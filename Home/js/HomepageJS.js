document.addEventListener('DOMContentLoaded', function() {
    const eventTypeSelect = document.getElementById('eventType');
    const secondaryFilter = document.getElementById('secondaryFilter');
    const timeFrameSelect = document.getElementById('timeFrame');
    const mainEventsList = document.getElementById('mainEventsList');

    // Función para actualizar el segundo filtro basado en la selección del tipo de evento
    function updateSecondaryFilter() {
        const eventType = eventTypeSelect.value;
        secondaryFilter.innerHTML = ''; // Limpiar opciones actuales
        
        if (eventType === 'irl') {
            // Cambiar a filtro de países
            secondaryFilter.innerHTML = '<option value="">País</option>';
            
            // Cargar lista de países
            window.countriesList.forEach(country => {
                const option = document.createElement('option');
                option.value = country.code.toLowerCase();
                option.textContent = country.name;
                secondaryFilter.appendChild(option);
            });
        } else {
            // Cambiar a filtro de idiomas
            secondaryFilter.innerHTML = '<option value="">Idioma</option>';
            
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
        const timeFrame = timeFrameSelect ? timeFrameSelect.value : null;
        
        // Aquí iría la llamada a tu API para obtener los eventos filtrados
        fetchEvents(eventType, filterValue, timeFrame)
            .then(events => {
                displayEvents(events);
            })
            .catch(error => {
                console.error('Error loading events:', error);
            });
    }

    // Función simulada para obtener eventos
    async function fetchEvents(eventType, filterValue, timeFrame) {
        // Aquí iría tu llamada real a la API
        return [
            {
                title: 'Evento de ejemplo',
                description: 'Descripción del evento',
                date: new Date().toISOString(),
                type: eventType,
                filter: filterValue,
                timeFrame: timeFrame
            }
        ];
    }

    // Función para mostrar los eventos
    function displayEvents(events) {
        if (!mainEventsList) return;

        mainEventsList.innerHTML = '';
        
        if (events.length === 0) {
            const noEvents = document.createElement('p');
            noEvents.textContent = 'No hay eventos disponibles para los filtros seleccionados';
            mainEventsList.appendChild(noEvents);
            return;
        }

        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            eventElement.innerHTML = `
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <p class="event-date">${new Date(event.date).toLocaleDateString()}</p>
            `;
            mainEventsList.appendChild(eventElement);
        });
    }

    // Event listeners
    eventTypeSelect.addEventListener('change', updateSecondaryFilter);
    secondaryFilter.addEventListener('change', loadEvents);
    if (timeFrameSelect) {
        timeFrameSelect.addEventListener('change', loadEvents);
    }

    // Inicializar filtros y cargar eventos iniciales
    updateSecondaryFilter();

    // MODAL CREATE
    const createBtn = document.querySelector('.create-btn');
    const createModal = document.getElementById('createModal');
    const modalContent = document.querySelector('.modal-create-content');

    if (createBtn && createModal) {
        createBtn.addEventListener('click', function() {
            createModal.classList.add('show');
        });

        // Cerrar al hacer clic fuera del contenido
        createModal.addEventListener('mousedown', function(e) {
            if (!modalContent.contains(e.target)) {
                createModal.classList.remove('show');
            }
        });

        // Cerrar con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                createModal.classList.remove('show');
            }
        });
    }
});