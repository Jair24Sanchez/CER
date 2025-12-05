// Script básico para verificar que funciona
document.addEventListener('DOMContentLoaded', function() {
    console.log('El script se ha cargado correctamente');
    
    // Botón Stats - navegar a stats.html
    const statsBtn = document.querySelector('.stats-btn');
    if (statsBtn) {
        statsBtn.addEventListener('click', function() {
            // Determinar la ruta relativa según la ubicación actual
            const isInSubfolder = window.location.pathname.includes('/reportajes/') || 
                                  window.location.pathname.includes('/digital-events/') || 
                                  window.location.pathname.includes('/irl-events/');
            const statsPath = isInSubfolder ? '../stats.html' : './stats.html';
            window.location.href = statsPath;
        });
    }
    
    // Inicializar el contador
    const counter = document.getElementById('eventCounter');
    if(counter) {
        counter.textContent = '0';
    }

    // Agregar funcionalidad de búsqueda rápida al select de países
    const countrySelect = document.getElementById('country');
    if(countrySelect) {
        countrySelect.addEventListener('keyup', function(e) {
            const text = e.target.value.toLowerCase();
            const options = countrySelect.options;
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                const optionText = option.text.toLowerCase();
                if (optionText.startsWith(text)) {
                    option.selected = true;
                    break;
                }
            }
        });
    }
}); 