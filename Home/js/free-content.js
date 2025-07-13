document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado');
    
    // Editor toolbar functionality
    const toggleToolsBtn = document.querySelector('.toggle-tools');
    const toolbarOptions = document.querySelector('.toolbar-options');
    const imageBtn = document.getElementById('imageBtn');
    const imageInput = document.getElementById('imageInput');
    const editorTitle = document.querySelector('.editor-title');
    
    // Filter functionality
    const eventTypeSelect = document.getElementById('eventType');
    const secondaryFilter = document.getElementById('secondaryFilter');

    // Nuevas referencias para el formato de texto
    const toggleFormat = document.querySelector('.toggle-format');
    const formatOptions = document.querySelector('.format-options');
    const formatButtons = document.querySelectorAll('.format-btn');

    // Función para actualizar el filtro secundario
    function updateSecondaryFilter() {
        const selectedValue = eventTypeSelect.value;
        secondaryFilter.innerHTML = '';

        if (selectedValue === 'irl') {
            const countries = ['Country', 'México', 'Estados Unidos', 'España', 'Argentina', 'Colombia', 'Chile'];
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.toLowerCase();
                option.textContent = country;
                secondaryFilter.appendChild(option);
            });
        } else if (selectedValue === 'digital') {
            const languages = ['Language', 'Español', 'English', 'Português', 'Français', 'Deutsch', 'Italiano'];
            languages.forEach(language => {
                const option = document.createElement('option');
                option.value = language.toLowerCase();
                option.textContent = language;
                secondaryFilter.appendChild(option);
            });
        }
    }

    // Event listeners para filtros
    if (eventTypeSelect) {
        eventTypeSelect.addEventListener('change', updateSecondaryFilter);
        updateSecondaryFilter();
    }

    // Event listeners para el editor
    if (toggleToolsBtn && toolbarOptions) {
        toggleToolsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toolbarOptions.classList.toggle('show');
            this.classList.toggle('active');
        });
    }

    // Manejo de imágenes mejorado
    if (imageBtn && imageInput && editorTitle) {
        imageBtn.addEventListener('click', function() {
            imageInput.click();
        });

        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Crear un contenedor para la imagen
                    const imgContainer = document.createElement('span');
                    imgContainer.contentEditable = false;
                    imgContainer.className = 'image-container';
                    
                    // Crear la imagen
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'editable-image';
                    
                    // Agregar la imagen al contenedor
                    imgContainer.appendChild(img);
                    
                    // Obtener la selección actual dentro del editor
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        // Verificar si la selección está dentro del editor
                        if (editorTitle.contains(range.commonAncestorContainer)) {
                            // Insertar la imagen en la posición del cursor
                            range.insertNode(imgContainer);
                            
                            // Mover el cursor después de la imagen
                            range.setStartAfter(imgContainer);
                            range.setEndAfter(imgContainer);
                            selection.removeAllRanges();
                            selection.addRange(range);
                            
                            // Agregar un espacio después de la imagen
                            const space = document.createTextNode('\u00A0');
                            range.insertNode(space);
                            range.setStartAfter(space);
                            range.setEndAfter(space);
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Toggle del menú de formato
    if (toggleFormat && formatOptions) {
        toggleFormat.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            formatOptions.classList.toggle('show');
            this.classList.toggle('active');
            
            // Ocultar el otro menú si está abierto
            toolbarOptions.classList.remove('show');
            toggleToolsBtn.classList.remove('active');
        });
    }

    // Manejo de formato de texto
    formatButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.getAttribute('data-format');
            const selection = window.getSelection();
            
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const selectedText = range.toString();

                if (selectedText) {
                    const span = document.createElement('span');
                    
                    switch(format) {
                        case 'bold':
                            span.style.fontWeight = 'bold';
                            break;
                        case 'italic':
                            span.style.fontStyle = 'italic';
                            break;
                        case 'underline':
                            span.style.textDecoration = 'underline';
                            break;
                        case 'h':
                            span.className = 'text-h';
                            break;
                        case 'h1':
                            span.className = 'text-h1';
                            break;
                        case 'h2':
                            span.className = 'text-h2';
                            break;
                        case 'h3':
                            span.className = 'text-h3';
                            break;
                    }

                    span.textContent = selectedText;
                    range.deleteContents();
                    range.insertNode(span);
                    
                    // Mover el cursor después del texto formateado
                    range.setStartAfter(span);
                    range.setEndAfter(span);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
            
            // Cerrar el menú después de aplicar el formato
            formatOptions.classList.remove('show');
            toggleFormat.classList.remove('active');
        });
    });

    // Cerrar menús al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.editor-toolbar')) {
            formatOptions.classList.remove('show');
            toggleFormat.classList.remove('active');
            toolbarOptions.classList.remove('show');
            toggleToolsBtn.classList.remove('active');
        }
    });
}); 