document.addEventListener('DOMContentLoaded', function() {
    const eventTypeSelect = document.getElementById('eventType');
    const secondaryFilter = document.getElementById('secondaryFilter');

    function updateSecondaryFilter() {
        const eventType = eventTypeSelect.value;
        secondaryFilter.innerHTML = '';
        if (eventType === 'irl') {
            secondaryFilter.innerHTML = '<option value="">País</option>';
            window.countriesList.forEach(country => {
                const option = document.createElement('option');
                option.value = country.code.toLowerCase();
                option.textContent = country.name;
                secondaryFilter.appendChild(option);
            });
        } else {
            secondaryFilter.innerHTML = '<option value="">Idioma</option>';
            window.languagesList.forEach(lang => {
                const option = document.createElement('option');
                option.value = lang.code;
                option.textContent = lang.name;
                secondaryFilter.appendChild(option);
            });
        }
    }

    eventTypeSelect.addEventListener('change', updateSecondaryFilter);
    updateSecondaryFilter();
    
    // Event listeners para filtros
    const secondaryFilter = document.getElementById('secondaryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const orderFilter = document.getElementById('orderFilter');
    
    if (secondaryFilter) {
        secondaryFilter.addEventListener('change', loadRequestedEvents);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', loadRequestedEvents);
    }
    if (orderFilter) {
        orderFilter.addEventListener('change', loadRequestedEvents);
    }
    
    // Cargar eventos solicitados
    loadRequestedEvents();
    updateEventCounter();
});

// Función para cargar eventos solicitados
function loadRequestedEvents() {
    const requestsGrid = document.getElementById('requestsGrid');
    const eventTypeSelect = document.getElementById('eventType');
    const secondaryFilter = document.getElementById('secondaryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const orderFilter = document.getElementById('orderFilter');
    
    if (!requestsGrid) return;
    
    // Obtener eventos solicitados del localStorage
    const requestedEvents = JSON.parse(localStorage.getItem('requestedEvents') || '[]');
    
    // Filtrar eventos según los filtros seleccionados
    let filteredEvents = [...requestedEvents];
    
    // Filtrar por tipo
    const eventType = eventTypeSelect.value;
    if (eventType) {
        filteredEvents = filteredEvents.filter(event => event.type === eventType);
    }
    
    // Filtrar por subtipo
    const subtype = secondaryFilter.value;
    if (subtype) {
        filteredEvents = filteredEvents.filter(event => event.subtype === subtype);
    }
    
    // Filtrar por status
    const status = statusFilter.value;
    if (status) {
        filteredEvents = filteredEvents.filter(event => event.status === status);
    }
    
    // Ordenar eventos
    const order = orderFilter.value;
    switch (order) {
        case 'mayor-recompensa':
            filteredEvents.sort((a, b) => (b.rewardAmount || 0) - (a.rewardAmount || 0));
            break;
        case 'menor-recompensa':
            filteredEvents.sort((a, b) => (a.rewardAmount || 0) - (b.rewardAmount || 0));
            break;
        case 'relevancia':
        default:
            filteredEvents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }
    
    // Limpiar grid (mantener el botón de "own report")
    const ownReportBtn = document.getElementById('ownReportBtn');
    requestsGrid.innerHTML = '';
    if (ownReportBtn) {
        requestsGrid.appendChild(ownReportBtn);
    }
    
    // Agregar eventos filtrados
    filteredEvents.forEach(event => {
        const eventCard = createEventCard(event);
        requestsGrid.appendChild(eventCard);
    });
}

// Función para crear una tarjeta de evento
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'request-card';
    card.innerHTML = `
        <div class="request-header">
            <h3 class="request-title">${event.title}</h3>
            <span class="request-status status-${event.status}">${getStatusLabel(event.status)}</span>
        </div>
        <div class="request-meta">
            <span class="request-type">${event.typeLabel}</span>
            <span class="request-subtype">${event.subtypeLabel}</span>
            <span class="request-date">${new Date(event.startDate).toLocaleDateString()}</span>
        </div>
        <div class="request-description">
            ${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}
        </div>
        <div class="request-footer">
            <div class="request-reward">
                ${event.rewardType === 'recompensa' ? 
                    `<span class="reward-amount">$${event.rewardAmount}</span>` : 
                    '<span class="reward-volunteer">Voluntario</span>'
                }
            </div>
            <div class="request-reporters">
                ${event.reporters} reportero${event.reporters > 1 ? 's' : ''}
            </div>
        </div>
        <div class="request-actions">
            <button class="btn-apply" onclick="applyToEvent('${event.id}')">
                Aplicar
            </button>
            <button class="btn-view" onclick="viewEventDetails('${event.id}')">
                Ver detalles
            </button>
        </div>
    `;
    return card;
}

// Función para obtener etiqueta de status
function getStatusLabel(status) {
    const labels = {
        'disponible': 'Disponible',
        'espera': 'En espera',
        'comienza': 'Comienza',
        'edicion': 'En edición',
        'declinado': 'Declinado',
        'publicado': 'Publicado'
    };
    return labels[status] || status;
}

// Función para aplicar a un evento
function applyToEvent(eventId) {
    alert(`Aplicando al evento ${eventId}. Esta funcionalidad se implementará próximamente.`);
}

// Función para ver detalles del evento
function viewEventDetails(eventId) {
    const events = JSON.parse(localStorage.getItem('requestedEvents') || '[]');
    const event = events.find(e => e.id === eventId);
    if (event) {
        // Aquí podrías abrir un modal o redirigir a una página de detalles
        alert(`Detalles del evento: ${event.title}\n\nDescripción: ${event.description}\n\nUbicación: ${event.location}`);
    }
}

// Función para actualizar contador de eventos
function updateEventCounter() {
    const counter = document.getElementById('eventCounter');
    if (counter) {
        const requestedEvents = JSON.parse(localStorage.getItem('requestedEvents') || '[]');
        const span = counter.querySelector('span');
        if (span) {
            span.textContent = requestedEvents.length;
        }
    }
} 