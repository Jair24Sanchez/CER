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
            rewardAmount.required = true;
        } else {
            rewardAmount.style.display = 'none';
            calcX.style.display = 'none';
            rewardAmount.value = '';
            rewardAmount.required = false;
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

    // --- VALIDACIÓN DE FECHAS ---
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');

    function validateDates() {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;

        if (startDate && endDate) {
            const startDateTime = new Date(`${startDate}T${startTime || '00:00'}`);
            const endDateTime = new Date(`${endDate}T${endTime || '00:00'}`);

            if (endDateTime <= startDateTime) {
                endDateInput.setCustomValidity('La fecha de fin debe ser posterior a la fecha de inicio');
                endTimeInput.setCustomValidity('La hora de fin debe ser posterior a la hora de inicio');
            } else {
                endDateInput.setCustomValidity('');
                endTimeInput.setCustomValidity('');
            }
        }
    }

    // Establecer fecha mínima para fecha de fin
    function updateEndDateMin() {
        if (startDateInput.value) {
            endDateInput.min = startDateInput.value;
        }
    }

    startDateInput.addEventListener('change', function() {
        updateEndDateMin();
        validateDates();
    });

    endDateInput.addEventListener('change', validateDates);
    startTimeInput.addEventListener('change', validateDates);
    endTimeInput.addEventListener('change', validateDates);
    // --- FIN VALIDACIÓN DE FECHAS ---

    // --- VALIDACIÓN DE GOOGLE MAPS ---
    const locationInput = document.getElementById('event-location');

    function validateGoogleMapsLink() {
        const url = locationInput.value.trim();
        
        if (url) {
            // Patrones válidos de Google Maps
            const googleMapsPatterns = [
                /^https?:\/\/(www\.)?google\.com\/maps/,
                /^https?:\/\/(www\.)?maps\.google\.com/,
                /^https?:\/\/goo\.gl\/maps/,
                /^https?:\/\/maps\.app\.goo\.gl/
            ];
            
            const isValidGoogleMaps = googleMapsPatterns.some(pattern => pattern.test(url));
            
            if (!isValidGoogleMaps) {
                locationInput.setCustomValidity('Por favor, ingresa únicamente enlaces de Google Maps');
                locationInput.style.borderColor = '#dc3545';
            } else {
                locationInput.setCustomValidity('');
                locationInput.style.borderColor = '';
            }
        } else {
            locationInput.setCustomValidity('');
            locationInput.style.borderColor = '';
        }
    }

    locationInput.addEventListener('input', validateGoogleMapsLink);
    locationInput.addEventListener('blur', validateGoogleMapsLink);
    // --- FIN VALIDACIÓN DE GOOGLE MAPS ---

    // --- EXTRACCIÓN DE DATOS DE GOOGLE MAPS ---
    async function extractGoogleMapsData(url) {
        try {
            // Para URLs de Google Maps, intentamos extraer información básica
            // Nota: En un entorno real, usarías la Google Maps API
            const urlObj = new URL(url);
            
            // Extraer coordenadas si están en la URL
            const coordsMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
            if (coordsMatch) {
                const lat = parseFloat(coordsMatch[1]);
                const lng = parseFloat(coordsMatch[2]);
                
                // Usar reverse geocoding para obtener información de la dirección
                // En un entorno real, usarías la Google Maps Geocoding API
                return {
                    coordinates: { lat, lng },
                    address: await reverseGeocode(lat, lng),
                    isValid: true
                };
            }
            
            // Si no hay coordenadas, intentar extraer información del texto de la URL
            const placeMatch = url.match(/place\/([^\/]+)/);
            if (placeMatch) {
                const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
                return {
                    placeName: placeName,
                    isValid: true
                };
            }
            
            return { isValid: false, error: 'No se pudo extraer información de la URL' };
        } catch (error) {
            return { isValid: false, error: 'Error al procesar la URL' };
        }
    }

    // Función simulada de reverse geocoding
    async function reverseGeocode(lat, lng) {
        // En un entorno real, aquí harías una llamada a la Google Maps Geocoding API
        // Por ahora, simulamos la respuesta
        return {
            street: 'Calle simulada',
            number: '123',
            neighborhood: 'Colonia simulada',
            postalCode: '12345',
            city: 'Ciudad simulada',
            state: 'Estado simulado',
            country: 'País simulado'
        };
    }

    // Función para validar que el país de Google Maps coincida con el seleccionado
    async function validateCountryMatch(googleMapsData, selectedCountry) {
        if (!googleMapsData.isValid) return false;
        
        // Obtener el país del evento seleccionado
        const selectedCountryName = document.getElementById('event-subtype').options[document.getElementById('event-subtype').selectedIndex].text;
        
        // En un entorno real, compararías con los datos reales de Google Maps
        // Por ahora, simulamos la validación
        return true; // Simulamos que siempre coincide
    }

    // Función mejorada de validación de Google Maps
    async function validateGoogleMapsLinkAdvanced() {
        const url = locationInput.value.trim();
        
        if (url) {
            const googleMapsPatterns = [
                /^https?:\/\/(www\.)?google\.com\/maps/,
                /^https?:\/\/(www\.)?maps\.google\.com/,
                /^https?:\/\/goo\.gl\/maps/,
                /^https?:\/\/maps\.app\.goo\.gl/
            ];
            
            const isValidGoogleMaps = googleMapsPatterns.some(pattern => pattern.test(url));
            
            if (!isValidGoogleMaps) {
                locationInput.setCustomValidity('Por favor, ingresa únicamente enlaces de Google Maps');
                locationInput.style.borderColor = '#dc3545';
                return false;
            }
            
            // Extraer datos de Google Maps
            const mapsData = await extractGoogleMapsData(url);
            if (!mapsData.isValid) {
                locationInput.setCustomValidity('No se pudo extraer información válida del enlace de Google Maps');
                locationInput.style.borderColor = '#dc3545';
                return false;
            }
            
            // Validar que el país coincida
            const selectedCountry = document.getElementById('event-subtype').value;
            if (selectedCountry) {
                const countryMatch = await validateCountryMatch(mapsData, selectedCountry);
                if (!countryMatch) {
                    locationInput.setCustomValidity('El país en el enlace de Google Maps no coincide con el país seleccionado');
                    locationInput.style.borderColor = '#dc3545';
                    return false;
                }
            }
            
            locationInput.setCustomValidity('');
            locationInput.style.borderColor = '';
            return true;
        }
        
        locationInput.setCustomValidity('');
        locationInput.style.borderColor = '';
        return true;
    }

    // Actualizar la validación para usar la función avanzada
    locationInput.addEventListener('blur', async function() {
        await validateGoogleMapsLinkAdvanced();
    });
    // --- FIN EXTRACCIÓN DE DATOS DE GOOGLE MAPS ---

    const formLeft = document.querySelector('.organize-form-left');
    const formRight = document.querySelector('.organize-form-right');
    const submitBtn = document.querySelector('.submit-btn-final');
    if (formRight && submitBtn) {
        formRight.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar todos los campos obligatorios
            const title = document.getElementById('event-title').value;
            const image = document.getElementById('event-image').files[0];
            const startDate = document.getElementById('start-date').value;
            const startTime = document.getElementById('start-time').value;
            const endDate = document.getElementById('end-date').value;
            const endTime = document.getElementById('end-time').value;
            const description = document.getElementById('event-description').value;
            const subtype = document.getElementById('event-subtype').value;
            const location = document.getElementById('event-location').value;
            const reporters = document.getElementById('reporters-count').value;
            const rewardType = document.getElementById('reward-type').value;
            const rewardAmount = document.getElementById('reward-amount').value;

            // Validaciones
            let isValid = true;
            let errorMessage = '';

            if (!title.trim()) {
                errorMessage += '• Título es obligatorio\n';
                isValid = false;
            }
            if (!image) {
                errorMessage += '• Imagen es obligatoria\n';
                isValid = false;
            }
            if (!startDate) {
                errorMessage += '• Fecha de inicio es obligatoria\n';
                isValid = false;
            }
            if (!startTime) {
                errorMessage += '• Hora de inicio es obligatoria\n';
                isValid = false;
            }
            if (!endDate) {
                errorMessage += '• Fecha de fin es obligatoria\n';
                isValid = false;
            }
            if (!endTime) {
                errorMessage += '• Hora de fin es obligatoria\n';
                isValid = false;
            }
            if (!description.trim()) {
                errorMessage += '• Descripción es obligatoria\n';
                isValid = false;
            }
            if (!subtype) {
                errorMessage += '• Subtipo es obligatorio\n';
                isValid = false;
            }
            if (!location.trim()) {
                errorMessage += '• Ubicación (Google Maps) es obligatoria\n';
                isValid = false;
            }
            if (rewardType === 'recompensa' && !rewardAmount.trim()) {
                errorMessage += '• Monto de recompensa es obligatorio cuando se selecciona "Recompensa"\n';
                isValid = false;
            }

            if (!isValid) {
                alert('Por favor, completa todos los campos obligatorios:\n\n' + errorMessage);
                return;
            }

            // Validar fechas una vez más
            const startDateTime = new Date(`${startDate}T${startTime}`);
            const endDateTime = new Date(`${endDate}T${endTime}`);
            if (endDateTime <= startDateTime) {
                alert('La fecha y hora de fin deben ser posteriores a la fecha y hora de inicio.');
                return;
            }

            // Validar Google Maps
            const googleMapsPatterns = [
                /^https?:\/\/(www\.)?google\.com\/maps/,
                /^https?:\/\/(www\.)?maps\.google\.com/,
                /^https?:\/\/goo\.gl\/maps/,
                /^https?:\/\/maps\.app\.goo\.gl/
            ];
            const isValidGoogleMaps = googleMapsPatterns.some(pattern => pattern.test(location));
            if (!isValidGoogleMaps) {
                alert('Por favor, ingresa únicamente enlaces de Google Maps.');
                return;
            }

            // Si todo está válido, proceder
            const organizer = 'Organizador'; // Aquí puedes poner el nombre del usuario si lo tienes

            // Crear objeto del evento solicitado
            const eventData = {
                id: Date.now().toString(),
                title,
                organizer,
                type: document.querySelector('input[name="event-type"]:checked').value,
                typeLabel: document.querySelector('input[name="event-type"]:checked').value === 'irl' ? 'IRL Events' : 'Digital Events',
                subtype,
                subtypeLabel: document.getElementById('event-subtype').options[document.getElementById('event-subtype').selectedIndex].text,
                reporters: parseInt(reporters),
                rewardType,
                rewardAmount: rewardAmount ? parseInt(rewardAmount.replace(/[^\d]/g, '')) : 0,
                description,
                startDate,
                startTime,
                endDate,
                endTime,
                location,
                status: 'disponible',
                createdAt: new Date().toISOString(),
                image: image ? image.name : null
            };

            // Guardar evento solicitado en localStorage
            const requestedEvents = JSON.parse(localStorage.getItem('requestedEvents') || '[]');
            requestedEvents.push(eventData);
            localStorage.setItem('requestedEvents', JSON.stringify(requestedEvents));

            // También guardar en eventSummary para compatibilidad
            localStorage.setItem('eventSummary', JSON.stringify(eventData));
            
            // Redirigir a la página de report-events para ver los eventos solicitados
            window.location.href = './report-events.html';
        });
    }
}); 