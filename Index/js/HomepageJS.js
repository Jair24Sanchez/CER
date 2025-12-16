document.addEventListener('DOMContentLoaded', function() {
    const eventTypeSelect = document.getElementById('eventType');
    const secondaryFilter = document.getElementById('secondaryFilter');
    const timeFrameSelect = document.getElementById('timeFrame');
    const mainEventsList = document.getElementById('mainEventsList');
    const goToCategoryBtn = document.getElementById('goToCategory');

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
        
        // Actualizar estado del botón "Ir"
        updateGoButton();
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

    // Función para actualizar el estado del botón "Ir"
    function updateGoButton() {
        const eventType = eventTypeSelect.value;
        const filterValue = secondaryFilter.value;
        
        if (eventType && filterValue) {
            goToCategoryBtn.disabled = false;
        } else {
            goToCategoryBtn.disabled = true;
        }
    }
    
    // Función para navegar a la categoría
    function goToCategory() {
        const eventType = eventTypeSelect.value;
        const filterValue = secondaryFilter.value;
        
        if (eventType && filterValue) {
            const categoryUrl = `./reportajes/categoria.html?type=${eventType}&subtype=${filterValue}`;
            window.location.href = categoryUrl;
        }
    }
    
    // Función para cargar los últimos eventos
    function loadLatestEvents() {
        const reportajes = JSON.parse(localStorage.getItem('reportajes') || '[]');
        const latestEventsList = document.getElementById('latestEventsList');
        
        if (!latestEventsList) return;
        
        // Ordenar por fecha más reciente y tomar los últimos 10
        const latestReportajes = reportajes
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10);
        
        if (latestReportajes.length === 0) {
            latestEventsList.innerHTML = `
                <div class="event-item">
                    <h3>No hay eventos aún</h3>
                    <p>¡Sé el primero en crear un reportaje!</p>
                    <div class="event-meta">
                        <span class="event-date">-</span>
                        <a href="./reporte-por-iniciativa-propia.html" class="event-category">Crear Reportaje</a>
                    </div>
                </div>
            `;
            return;
        }
        
        latestEventsList.innerHTML = latestReportajes.map(reportaje => `
            <div class="event-item" onclick="window.location.href='./reportajes/leer.html?id=${reportaje.id}'">
                <h3>${reportaje.title}</h3>
                <p>${reportaje.content.replace(/<[^>]*>/g, '').substring(0, 100)}${reportaje.content.length > 100 ? '...' : ''}</p>
                <div class="event-meta">
                    <span class="event-date">${new Date(reportaje.timestamp).toLocaleDateString()}</span>
                    <span class="event-category">${reportaje.typeLabel} - ${reportaje.subtypeLabel}</span>
                </div>
            </div>
        `).join('');
    }
    
    // Función para actualizar el contador total de eventos
    function updateTotalEventsCounter() {
        const reportajes = JSON.parse(localStorage.getItem('reportajes') || '[]');
        const totalEventsElement = document.getElementById('totalEvents');
        
        if (totalEventsElement) {
            totalEventsElement.textContent = reportajes.length.toLocaleString();
        }
    }

    // Event listeners
    eventTypeSelect.addEventListener('change', updateSecondaryFilter);
    secondaryFilter.addEventListener('change', () => {
        loadEvents();
        updateGoButton();
    });
    if (timeFrameSelect) {
        timeFrameSelect.addEventListener('change', loadEvents);
    }
    if (goToCategoryBtn) {
        goToCategoryBtn.addEventListener('click', goToCategory);
    }

    // Inicializar filtros y cargar eventos iniciales
    updateSecondaryFilter();
    
    // Cargar últimos eventos y contador
    loadLatestEvents();
    updateTotalEventsCounter();

    // Funcionalidad de búsqueda
    const searchInput = document.getElementById('searchInput');
    const searchIcon = document.getElementById('searchIcon');
    
    function performSearch() {
        const query = searchInput ? searchInput.value.trim() : '';
        if (query === '') {
            alert('Por favor, ingresa un término de búsqueda');
            return;
        }
        // Redirigir a página de resultados
        window.location.href = `./reportajes/busqueda.html?q=${encodeURIComponent(query)}`;
    }
    
    if (searchIcon) {
        searchIcon.addEventListener('click', performSearch);
        // Hacer que el ícono se vea como clickeable
        searchIcon.style.cursor = 'pointer';
        searchIcon.title = 'Buscar';
    }
    
    if (searchInput) {
        // Permitir búsqueda con Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Botón Stats - navegar a stats.html
    const statsBtn = document.querySelector('.stats-btn');
    if (statsBtn) {
        statsBtn.addEventListener('click', function() {
            window.location.href = './stats.html';
        });
    }

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