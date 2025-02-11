document.addEventListener('DOMContentLoaded', function() {
    const eventTypeSelect = document.getElementById('eventType');
    const secondaryFilter = document.getElementById('secondaryFilter');

    function updateSecondaryFilter() {
        const eventType = eventTypeSelect.value;
        secondaryFilter.innerHTML = '';
        
        if (eventType === 'irl') {
            secondaryFilter.innerHTML = '<option value="">Country</option>';
            window.countriesList.forEach(country => {
                const option = document.createElement('option');
                option.value = country.code.toLowerCase();
                option.textContent = country.name;
                secondaryFilter.appendChild(option);
            });
        } else {
            secondaryFilter.innerHTML = '<option value="">Language</option>';
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

    const toggleToolsBtn = document.getElementById('toggleToolsBtn');
    const toolbarOptions = document.getElementById('toolbarOptions');

    if (toggleToolsBtn && toolbarOptions) {
        toggleToolsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Toggle button clicked');
            this.classList.toggle('active');
            toolbarOptions.classList.toggle('show');
        });
    } else {
        console.error('Elementos de la barra de herramientas no encontrados');
    }
}); 