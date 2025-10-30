document.addEventListener('DOMContentLoaded', () => {
    const editorTools = document.querySelector('.editor-tools');
    const blogContent = document.querySelector('.blog-content');
    const submitBtn = document.querySelector('.submit-btn');
    const imageUpload = document.querySelector('.image-upload input');
    const eventTypeSelect = document.getElementById('eventType');
    const secondaryFilter = document.getElementById('secondaryFilter');

    // Función para actualizar el segundo filtro basado en la selección del tipo de evento
    function updateSecondaryFilter() {
        const eventType = eventTypeSelect.value;
        secondaryFilter.innerHTML = ''; // Limpiar opciones actuales
        
        if (eventType === 'irl') {
            // Cambiar a filtro de países
            secondaryFilter.innerHTML = '<option value="">País</option>';
            
            // Cargar lista de países
            window.countriesList.forEach(country => {
                const option = document.createElement('option');
                option.value = country.code.toLowerCase();
                option.textContent = country.name;
                secondaryFilter.appendChild(option);
            });
        } else {
            // Cambiar a filtro de idiomas
            secondaryFilter.innerHTML = '<option value="">Idioma</option>';
            
            // Cargar lista de idiomas
            window.languagesList.forEach(lang => {
                const option = document.createElement('option');
                option.value = lang.code;
                option.textContent = lang.name;
                secondaryFilter.appendChild(option);
            });
        }
    }

    // Event listeners para filtros
    eventTypeSelect.addEventListener('change', () => {
        updateSecondaryFilter();
        updateSelectedTags();
    });
    updateSecondaryFilter();

    // Funcionalidad de las herramientas de edición
    editorTools.addEventListener('click', (e) => {
        const tool = e.target.closest('.tool-btn');
        if (!tool) return;

        const action = tool.dataset.tool;
        
        switch(action) {
            case 'bold':
                document.execCommand('bold', false, null);
                break;
            case 'italic':
                document.execCommand('italic', false, null);
                break;
            case 'underline':
                document.execCommand('underline', false, null);
                break;
            case 'increase-font':
                const currentSize = window.getSelection().anchorNode.parentElement.getAttribute('size') || '1';
                const newSize = Math.min(parseInt(currentSize) + 1, 3);
                document.execCommand('fontSize', false, newSize.toString());
                break;
            case 'decrease-font':
                const currentSize2 = window.getSelection().anchorNode.parentElement.getAttribute('size') || '1';
                const newSize2 = Math.max(parseInt(currentSize2) - 1, 1);
                document.execCommand('fontSize', false, newSize2.toString());
                break;
        }
    });

    // Mostrar badges de etiquetas seleccionadas
    function updateSelectedTags() {
        const typeBadge = document.getElementById('tagTypeLabel');
        const subtypeBadge = document.getElementById('tagSubtypeLabel');
        if (!typeBadge || !subtypeBadge) return;

        const typeLabel = eventTypeSelect.value === 'irl' ? 'IRL Events' : 'Digital Events';
        const subtypeOption = secondaryFilter.options[secondaryFilter.selectedIndex];
        const subtypeLabel = subtypeOption ? subtypeOption.text : '';

        typeBadge.textContent = typeLabel;
        typeBadge.style.display = 'inline-block';
        if (secondaryFilter.value) {
            subtypeBadge.textContent = subtypeLabel;
            subtypeBadge.style.display = 'inline-block';
        } else {
            subtypeBadge.style.display = 'none';
        }
    }

    secondaryFilter.addEventListener('change', updateSelectedTags);
    // Inicializa badges después de poblar opciones
    setTimeout(updateSelectedTags, 0);

    // Manejo de carga de imágenes
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            alert('Solo se permiten archivos JPG y PNG');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.maxWidth = '100%';
            blogContent.focus();
            document.execCommand('insertHTML', false, img.outerHTML);
        };
        reader.readAsDataURL(file);
    });

    // Función para generar URL de confirmación
    function generateConfirmationURL(reportajeId) {
        return `./reportajes/confirmacion.html?id=${reportajeId}`;
    }

    // Función para generar URL de categoría dinámica
    function generateCategoryURL(type, subtype) {
        return `./reportajes/categoria.html?type=${type}&subtype=${subtype}`;
    }

    // Función para guardar reportaje en localStorage
    function saveReportaje(reportaje) {
        const reportajes = JSON.parse(localStorage.getItem('reportajes') || '[]');
        reportajes.push(reportaje);
        localStorage.setItem('reportajes', JSON.stringify(reportajes));
    }

    // Manejo del envío del blog
    submitBtn.addEventListener('click', () => {
        const title = document.querySelector('.blog-title').value;
        const content = blogContent.innerHTML;
        const type = eventTypeSelect.value;
        const subtype = secondaryFilter.value;

        if (!title || !content) {
            alert('Por favor, completa el título y el contenido del reportaje');
            return;
        }

        if (!type || !subtype) {
            alert('Por favor, selecciona el tipo y subtipo');
            return;
        }

        // Crear objeto del reportaje
        const reportaje = {
            id: Date.now().toString(),
            title: title,
            content: content,
            type: type,
            subtype: subtype,
            typeLabel: type === 'irl' ? 'IRL Events' : 'Digital Events',
            subtypeLabel: secondaryFilter.options[secondaryFilter.selectedIndex].text,
            timestamp: new Date().toISOString()
        };

        // Guardar en localStorage
        saveReportaje(reportaje);

        // Generar URL de confirmación
        const confirmationURL = generateConfirmationURL(reportaje.id);
        
        // Redirigir a página de confirmación
        window.location.href = confirmationURL;
    });
}); 