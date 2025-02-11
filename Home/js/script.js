// Script básico para verificar que funciona
document.addEventListener('DOMContentLoaded', function() {
    console.log('El script se ha cargado correctamente');
    
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