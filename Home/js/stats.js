document.addEventListener('DOMContentLoaded', function() {
    // Manejar el cambio en el selector de tiempo
    const timeSelect = document.querySelector('.time-select');
    if (timeSelect) {
        timeSelect.addEventListener('change', function(e) {
            // Aquí puedes agregar la lógica para actualizar los números
            // según el período de tiempo seleccionado
            updateStats(e.target.value);
        });
    }
});

function updateStats(timeFrame) {
    // Esta función se puede implementar más tarde para actualizar
    // las estadísticas basadas en el período de tiempo seleccionado
    console.log('Actualizando estadísticas para:', timeFrame, 'horas');
} 