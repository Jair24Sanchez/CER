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
            // Ordenar de mayor recompensa a menor (voluntario al final)
            filteredEvents.sort((a, b) => {
                const aAmount = a.rewardType === 'voluntario' ? 0 : (a.rewardAmount || 0);
                const bAmount = b.rewardType === 'voluntario' ? 0 : (b.rewardAmount || 0);
                return bAmount - aAmount;
            });
            break;
        case 'menor-recompensa':
            // Ordenar de voluntario a mayor recompensa
            filteredEvents.sort((a, b) => {
                const aAmount = a.rewardType === 'voluntario' ? 0 : (a.rewardAmount || 0);
                const bAmount = b.rewardType === 'voluntario' ? 0 : (b.rewardAmount || 0);
                return aAmount - bAmount;
            });
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
    
    // Obtener imagen del evento (si existe)
    const eventImage = event.image ? `./uploads/${event.image}` : './default-event.jpg';
    
    // Obtener foto del organizador (si existe, sino usar default)
    const organizerPhoto = event.organizerPhoto || './default-avatar.svg';
    const organizerName = event.organizer || 'Organizador';
    
    // Formatear fecha
    const publishDate = event.createdAt ? new Date(event.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    // Obtener bandera del país si es IRL
    let subtypeDisplay = event.subtypeLabel || event.subtype;
    if (event.type === 'irl' && event.subtype && window.countriesList) {
        const country = window.countriesList.find(c => c.code.toLowerCase() === event.subtype.toLowerCase());
        if (country) {
            const flagEmoji = getCountryFlagEmoji(country.code);
            subtypeDisplay = flagEmoji + ' ' + country.name;
        }
    }
    
    // Status con colores
    const statusClass = `status-${event.status}`;
    const statusLabel = getStatusLabel(event.status);
    
    card.innerHTML = `
        <!-- Mitad superior: Foto del evento -->
        <div class="request-thumbnail-container">
            <img src="${eventImage}" alt="${event.title}" class="request-thumbnail" onerror="this.src='./default-event.jpg'">
        </div>
        
        <!-- Título (máximo 22% del cuadro) -->
        <div class="request-title-section">
            <h3 class="request-title">${event.title}</h3>
        </div>
        
        <!-- Último 1/4: Información del organizador y detalles -->
        <div class="request-bottom-section">
            <div class="request-organizer-info">
                <img src="${organizerPhoto}" alt="${organizerName}" class="organizer-photo" onerror="this.src='./default-avatar.svg'">
                <div class="organizer-details">
                    <span class="organizer-name">${organizerName}</span>
                    <span class="request-date">${publishDate}</span>
                </div>
            </div>
            <div class="request-meta-tags">
                <span class="request-reward-tag ${event.rewardType === 'recompensa' ? 'reward-amount' : 'reward-volunteer'}">
                    ${event.rewardType === 'recompensa' ? `$${event.rewardAmount.toLocaleString()}` : 'Voluntario'}
                </span>
                <span class="request-subtype-tag">${subtypeDisplay}</span>
                <span class="request-status-tag ${statusClass}">${statusLabel}</span>
            </div>
        </div>
        
        <!-- Botones de acción -->
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

// Función para obtener emoji de bandera
function getCountryFlagEmoji(countryCode) {
    if (!countryCode || countryCode.length !== 2) return '';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
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
    // Redirigir al editor de reportes con el id del evento solicitado
    window.location.href = `./report-editor.html?id=${encodeURIComponent(eventId)}`;
}

// Función para ver detalles del evento
function viewEventDetails(eventId) {
    const events = JSON.parse(localStorage.getItem('requestedEvents') || '[]');
    const event = events.find(e => e.id === eventId);
    if (event) {
        // Guardar el evento seleccionado para mostrar en event-summary
        localStorage.setItem('eventSummary', JSON.stringify(event));
        // Redirigir a la página de detalles
        window.location.href = './event-summary.html';
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