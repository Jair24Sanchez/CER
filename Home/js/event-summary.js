document.addEventListener('DOMContentLoaded', function() {
    const data = JSON.parse(localStorage.getItem('eventSummary'));
    if (!data) {
        // Si no hay datos, redirigir a report-events
        window.location.href = './report-events.html';
        return;
    }
    
    // Mostrar el título
    document.getElementById('summary-title').textContent = data.title;
    
    // Mostrar organizador
    const organizerName = data.organizer || 'Organizador';
    document.getElementById('summary-organizer').textContent = organizerName;
    
    // Mostrar país - si es tipo IRL, usar el subtype como país, si no, buscar otro método
    let countryCode = null;
    let countryName = '';
    if (data.type === 'irl' && data.subtype) {
        countryCode = data.subtype;
        // Buscar el nombre del país en la lista
        if (window.countriesList) {
            const country = window.countriesList.find(c => c.code === countryCode);
            if (country) {
                countryName = country.name;
            }
        }
    }
    
    // Mostrar bandera del país (usando emoji de bandera o imagen)
    const countryFlagElement = document.getElementById('summary-country-flag');
    if (countryCode && countryName) {
        // Usar emoji de bandera basado en el código del país
        const flagEmoji = getCountryFlagEmoji(countryCode);
        countryFlagElement.textContent = flagEmoji + ' ';
        document.getElementById('summary-country').textContent = countryName;
    } else {
        countryFlagElement.textContent = '';
        document.getElementById('summary-country').textContent = 'No especificado';
    }
    
    // Mostrar reporteros
    document.getElementById('summary-reporters').textContent = data.reporters || 1;
    
    // Mostrar recompensa
    const rewardElement = document.getElementById('summary-reward');
    if (data.rewardType === 'voluntario') {
        rewardElement.textContent = 'Voluntario';
    } else if (data.rewardAmount) {
        rewardElement.textContent = `$${data.rewardAmount.toLocaleString()}`;
    } else {
        rewardElement.textContent = 'Voluntario';
    }
    
    // Mostrar tipo y subtipo
    document.getElementById('summary-type').textContent = data.typeLabel || (data.type === 'irl' ? 'IRL Events' : 'Digital Events');
    document.getElementById('summary-subtype').textContent = data.subtypeLabel || data.subtype || 'No especificado';
    
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

// Función para obtener el emoji de bandera de un país basado en su código ISO
function getCountryFlagEmoji(countryCode) {
    if (!countryCode || countryCode.length !== 2) return '';
    // Convertir código de país a emoji de bandera
    // Los emojis de bandera usan Regional Indicator Symbols (🇦-🇿)
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
} 