document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('event-image');
    const filePlaceholder = document.querySelector('.custom-file-placeholder');

    if (fileInput && filePlaceholder) {
        fileInput.addEventListener('change', function() {
            if (fileInput.files && fileInput.files.length > 0) {
                filePlaceholder.textContent = fileInput.files[0].name;
            } else {
                filePlaceholder.textContent = 'Agrega una imagen';
            }
        });
    }

    const reportersInput = document.getElementById('reporters-count');
    const btnUp = document.querySelector('.counter-up');
    const btnDown = document.querySelector('.counter-down');
    const rewardType = document.getElementById('reward-type');
    const rewardAmount = document.getElementById('reward-amount');
    const calcX = document.getElementById('calc-x');
    const calcEquals = document.querySelector('.calc-equals');
    const calcTotal = document.getElementById('calc-total');

    btnUp.addEventListener('click', function() {
        reportersInput.value = parseInt(reportersInput.value) + 1;
    });
    btnDown.addEventListener('click', function() {
        if (parseInt(reportersInput.value) > 1) {
            reportersInput.value = parseInt(reportersInput.value) - 1;
        }
    });

    rewardType.addEventListener('change', function() {
        if (rewardType.value === 'recompensa') {
            rewardAmount.style.display = 'inline-block';
            calcX.style.display = 'inline-block';
        } else {
            rewardAmount.style.display = 'none';
            calcX.style.display = 'none';
            rewardAmount.value = '';
            calcTotal.value = '$0';
        }
    });

    rewardAmount.addEventListener('input', function(e) {
        let value = rewardAmount.value.replace(/[^\d]/g, '');
        if (value) {
            value = parseInt(value, 10).toLocaleString('en-US');
            rewardAmount.value = `$${value}`;
        } else {
            rewardAmount.value = '';
        }
    });

    calcEquals.addEventListener('click', function() {
        let total = 0;
        const reporters = parseInt(reportersInput.value) || 1;
        if (rewardType.value === 'recompensa') {
            let amount = rewardAmount.value.replace(/[^\d]/g, '');
            amount = parseInt(amount, 10) || 0;
            total = reporters * amount;
        }
        calcTotal.value = `$${total.toLocaleString('en-US')}`;
    });

    // --- INICIO CAMBIO SUBTIPO SEGÚN TIPO ---
    const eventTypeRadios = document.querySelectorAll('input[name="event-type"]');
    let eventSubtypeInput = document.getElementById('event-subtype');

    function updateSubtypeField() {
        const selectedType = document.querySelector('input[name="event-type"]:checked').value;
        // Limpiar el select
        eventSubtypeInput.innerHTML = '';
        let options = [];
        let placeholder = '';
        if (selectedType === 'irl') {
            options = window.countriesList;
            placeholder = 'País';
        } else {
            options = window.languagesList;
            placeholder = 'Idioma';
        }
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Subtipo';
        eventSubtypeInput.appendChild(defaultOption);
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.code;
            option.textContent = opt.name;
            eventSubtypeInput.appendChild(option);
        });
    }

    eventTypeRadios.forEach(radio => {
        radio.addEventListener('change', updateSubtypeField);
    });
    // Inicializar al cargar
    updateSubtypeField();
    // --- FIN CAMBIO SUBTIPO SEGÚN TIPO ---

    const formLeft = document.querySelector('.organize-form-left');
    const formRight = document.querySelector('.organize-form-right');
    const submitBtn = document.querySelector('.submit-btn-final');
    if (formRight && submitBtn) {
        formRight.addEventListener('submit', function(e) {
            e.preventDefault();
            // Obtener datos del formulario
            const title = document.getElementById('event-title').value;
            const organizer = 'Organizador'; // Aquí puedes poner el nombre del usuario si lo tienes
            const subtype = document.getElementById('event-subtype').value;
            const reporters = document.getElementById('reporters-count').value;
            const rewardType = document.getElementById('reward-type').value;
            const rewardAmount = document.getElementById('reward-amount').value;
            const description = document.getElementById('event-description').value;
            const startDate = document.getElementById('start-date').value;
            const startTime = document.getElementById('start-time').value;
            const endDate = document.getElementById('end-date').value;
            const endTime = document.getElementById('end-time').value;
            const location = document.getElementById('event-location').value;

            // Guardar en localStorage
            localStorage.setItem('eventSummary', JSON.stringify({
                title,
                organizer,
                subtype,
                reporters,
                rewardType,
                rewardAmount,
                description,
                startDate,
                startTime,
                endDate,
                endTime,
                location
            }));
            // Redirigir a la página de resumen
            window.location.href = './event-summary.html';
        });
    }
}); 