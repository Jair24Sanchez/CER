document.addEventListener('DOMContentLoaded', function() {
    // Obtener el país de la URL
    const countryCode = window.location.pathname.split('/').pop().replace('.html', '');
    
    // Cargar datos específicos del país
    loadCountryData(countryCode);
    
    // Configurar los filtros
    setupFilters();
    
    // Actualizar eventos en tiempo real
    setInterval(updateLatestEvents, 60000); // Cada minuto

    // Modal functionality
    const createBtn = document.querySelector('.create-btn');
    const modal = document.getElementById('createModal');

    createBtn.addEventListener('click', () => {
        modal.classList.add('show');
    });

    // Cerrar el modal cuando se hace clic fuera de él
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Manejar los botones del modal
    const modalButtons = document.querySelectorAll('.modal-btn');
    modalButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aquí puedes agregar la lógica para cada botón
            console.log(`Clicked: ${button.textContent}`);
            modal.classList.remove('show');
        });
    });
});

function loadCountryData(countryCode) {
    // Aquí irá la lógica para cargar los datos específicos del país
    // Como estadísticas, idiomas disponibles, etc.
}

function setupFilters() {
    const filters = document.querySelectorAll('.filter-select');
    filters.forEach(filter => {
        filter.addEventListener('change', updateEvents);
    });
}

function updateEvents() {
    // Aquí irá la lógica para actualizar la lista de eventos
    // basada en los filtros seleccionados
}

function updateLatestEvents() {
    // Aquí irá la lógica para actualizar la lista de eventos recientes
}

window.countriesList = [
    { code: 'US', name: 'United States' },
    { code: 'ES', name: 'Spain' },
    { code: 'FR', name: 'France' },
    // ... lista completa de países ...
]; 