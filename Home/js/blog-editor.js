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
    submitBtn.addEventListener('click', async () => {
        // Verificar autenticación antes de permitir crear reportaje
        if (window.auth && !window.auth.isAuthenticated()) {
            alert('Debes iniciar sesión para crear un reportaje.');
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                loginModal.style.display = 'flex';
                loginModal.classList.add('show');
            }
            return;
        }

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

        // Obtener información del autor desde la sesión
        const session = JSON.parse(localStorage.getItem('session') || 'null');
        if (!session || (!session.email && !session.address && !session.provider)) {
            alert('Error: No se pudo obtener la información de la sesión.');
            return;
        }

        // Verificar si el usuario es reportero (si usa Web3)
        if (session.address && window.auth && window.web3Contract) {
            const isRep = await window.auth.isReporter();
            if (!isRep) {
                const register = confirm('No estás registrado como reportero. ¿Deseas registrarte ahora?');
                if (register) {
                    try {
                        await window.web3Contract.registerAsReporter(session.address);
                        // Actualizar sesión con nuevo rol
                        session.role = await window.web3Contract.getUserRole(session.address);
                        localStorage.setItem('session', JSON.stringify(session));
                    } catch (error) {
                        alert('Error al registrarse como reportero: ' + error.message);
                        return;
                    }
                } else {
                    return;
                }
            }
        }

        const authorName = session?.email ? session.email : (session?.address ? `${session.address.substring(0, 6)}...${session.address.substring(session.address.length - 4)}` : (session?.provider ? session.provider : 'reporter'));
        const authorId = session?.email || session?.address || session?.provider || 'anon';

        // Verificar si este reportaje es para una solicitud de organizador
        const urlParams = new URLSearchParams(window.location.search);
        const requestId = urlParams.get('id');

        let reportaje;
        let isRequestReport = false;
        let requestEvent = null;

        if (requestId) {
            // Es un reportaje para una solicitud
            isRequestReport = true;
            const requestedEvents = JSON.parse(localStorage.getItem('requestedEvents') || '[]');
            requestEvent = requestedEvents.find(e => e.id === requestId || e.blockchainRequestId === requestId);

            if (!requestEvent) {
                alert('Error: No se encontró la solicitud de reportaje.');
                return;
            }

            // Crear objeto del reportaje vinculado a la solicitud
            reportaje = {
                id: Date.now().toString(),
                requestId: requestId,
                title: title,
                content: content,
                type: requestEvent.type || type,
                subtype: requestEvent.subtype || subtype,
                typeLabel: requestEvent.typeLabel || (type === 'irl' ? 'IRL Events' : 'Digital Events'),
                subtypeLabel: requestEvent.subtypeLabel || secondaryFilter.options[secondaryFilter.selectedIndex].text,
                timestamp: new Date().toISOString(),
                author: authorName,
                authorId: authorId,
                authorAddress: session.address || null,
                rewardType: requestEvent.rewardType || 'voluntario',
                rewardAmount: requestEvent.rewardAmount || 0,
                rewardAmountETH: requestEvent.rewardAmountETH || 0,
                paid: false,
                paidAt: null,
                status: 'pendiente_aprobacion',
                organizerAddress: requestEvent.organizerAddress || null
            };

            // Si el organizador tiene recompensa en blockchain, enviar para aprobación
            if (requestEvent.blockchainDeposited && session.address && window.web3Contract) {
                try {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Enviando para aprobación...';

                    // Enviar reportaje a blockchain para aprobación
                    await window.web3Contract.submitReportForApproval(requestId, {
                        id: reportaje.id,
                        title: reportaje.title,
                        content: reportaje.content,
                        author: reportaje.authorAddress
                    });

                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Publicar';

                    // Actualizar estado de la solicitud
                    requestEvent.status = 'espera';
                    requestEvent.submittedReport = reportaje;
                    requestEvent.reporterAddress = session.address;
                    requestEvent.submittedAt = new Date().toISOString();
                    const requestedEvents = JSON.parse(localStorage.getItem('requestedEvents') || '[]');
                    const eventIndex = requestedEvents.findIndex(e => e.id === requestId || e.blockchainRequestId === requestId);
                    if (eventIndex !== -1) {
                        requestedEvents[eventIndex] = requestEvent;
                        localStorage.setItem('requestedEvents', JSON.stringify(requestedEvents));
                    }

                    alert('¡Reportaje enviado para aprobación! El organizador revisará tu trabajo y liberará la recompensa si está conforme.');
                    
                    // Guardar reportaje en localStorage
                    saveReportaje(reportaje);
                    
                    // Redirigir a página de confirmación
                    const confirmationURL = generateConfirmationURL(reportaje.id);
                    window.location.href = confirmationURL;
                    return;

                } catch (error) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Publicar';
                    console.error('Error enviando reportaje para aprobación:', error);
                    alert('Error al enviar reportaje para aprobación: ' + error.message);
                    return;
                }
            } else {
                // Solicitud sin blockchain, guardar normalmente
                saveReportaje(reportaje);
                
                // Actualizar estado de la solicitud
                requestEvent.status = 'espera';
                requestEvent.submittedReport = reportaje;
                requestEvent.reporterAddress = session.address || authorId;
                requestEvent.submittedAt = new Date().toISOString();
                const requestedEvents = JSON.parse(localStorage.getItem('requestedEvents') || '[]');
                const eventIndex = requestedEvents.findIndex(e => e.id === requestId || e.blockchainRequestId === requestId);
                if (eventIndex !== -1) {
                    requestedEvents[eventIndex] = requestEvent;
                    localStorage.setItem('requestedEvents', JSON.stringify(requestedEvents));
                }

                alert('¡Reportaje enviado para aprobación!');
            }
        } else {
            // Reportaje libre (no vinculado a solicitud)
            reportaje = {
                id: Date.now().toString(),
                title: title,
                content: content,
                type: type,
                subtype: subtype,
                typeLabel: type === 'irl' ? 'IRL Events' : 'Digital Events',
                subtypeLabel: secondaryFilter.options[secondaryFilter.selectedIndex].text,
                timestamp: new Date().toISOString(),
                author: authorName,
                authorId: authorId,
                authorAddress: session.address || null,
                rewardType: 'voluntario',
                rewardAmount: 0,
                paid: false,
                paidAt: null,
                status: 'publicado'
            };

            // Si el usuario tiene wallet Web3, publicar como token NFT
            if (session.address && window.web3Contract) {
                try {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Publicando en blockchain...';

                    // Crear token URI (en producción, subir a IPFS)
                    const tokenURI = `https://cer.app/reportajes/${reportaje.id}`;
                    
                    // Publicar como token (sin requestId porque es libre)
                    // Nota: Esto requeriría una función adicional en el contrato para reportajes libres
                    // Por ahora, solo guardamos en localStorage
                    
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Publicar';
                } catch (error) {
                    console.error('Error publicando en blockchain:', error);
                    // Continuar con guardado local aunque falle blockchain
                }
            }

            // Guardar en localStorage
            saveReportaje(reportaje);
        }

        // Generar URL de confirmación
        const confirmationURL = generateConfirmationURL(reportaje.id);
        
        // Redirigir a página de confirmación
        window.location.href = confirmationURL;
    });
}); 