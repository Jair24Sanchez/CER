document.addEventListener('DOMContentLoaded', function() {
    const data = JSON.parse(localStorage.getItem('eventSummary'));
    if (!data) {
        // Si no hay datos, redirigir a report-events
        window.location.href = './report-events.html';
        return;
    }
    
    // Mostrar el título
    document.getElementById('summary-title').textContent = data.title;
    
    // Mostrar la descripción
    document.getElementById('summary-description').textContent = data.description;
    
    // Mostrar fecha y horario en formato DD/MM/YYYY HH:MM-HH:MM
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const startTime = data.startTime || '00:00';
    const endTime = data.endTime || '00:00';
    
    const formattedStartDate = startDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    const formattedEndDate = endDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    let datetimeText = '';
    if (data.startDate === data.endDate) {
        // Mismo día
        datetimeText = `${formattedStartDate} ${startTime}-${endTime}`;
    } else {
        // Diferentes días
        datetimeText = `${formattedStartDate} ${startTime} - ${formattedEndDate} ${endTime}`;
    }
    
    document.getElementById('summary-datetime').textContent = datetimeText;
    
    // Mostrar ubicación como enlace
    const locationElement = document.getElementById('summary-location');
    if (data.location) {
        locationElement.innerHTML = `<a href="${data.location}" target="_blank">${data.location}</a>`;
    } else {
        locationElement.textContent = 'Sin ubicación especificada';
    }
    
    // Agregar funcionalidad al botón Aplicar
    const applyBtn = document.querySelector('.summary-apply-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            // Redirigir al editor de reportes con el id del evento
            window.location.href = `./report-editor.html?id=${encodeURIComponent(data.id)}`;
        });
    }
}); 