document.addEventListener('DOMContentLoaded', function() {
    // Asegurar CSS base presente
    const haveCss = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(l => (l.getAttribute('href')||'').includes('report-events.css'));
    if (!haveCss) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = (window.location.pathname.includes('/Home/reportajes/')) ? '../report-events.css' : './report-events.css';
        document.head.appendChild(link);
    }

    // Inyectar modal CREATE si no existe
    let createModal = document.getElementById('createModal');
    if (!createModal) {
        createModal = document.createElement('div');
        createModal.id = 'createModal';
        createModal.className = 'modal-create';
        createModal.innerHTML = `
            <div class="modal-create-content">
                <img src="${pathPrefix()}cer-logo-modal.jpg" alt="CER Logo" class="modal-create-logo">
                <div class="modal-create-title"><em>CREATE</em></div>
                <a href="${pathPrefix()}report-events.html" class="modal-create-btn">Reports</a>
                <button class="modal-create-btn" data-go-organize>Organize</button>
            </div>`;
        document.body.appendChild(createModal);
    }

    function pathPrefix(){
        // Si estamos en /Home/reportajes/* usar ../ para recursos locales
        return window.location.pathname.includes('/Home/reportajes/') ? '../' : './';
    }

    const createButtons = Array.from(document.querySelectorAll('.create-btn'));
    const modalContent = createModal.querySelector('.modal-create-content');

    function openCreate(){ 
        // Verificar autenticación antes de abrir
        if (window.auth && !window.auth.isAuthenticated()) {
            // Abrir modal de login en su lugar
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                loginModal.style.display = 'flex';
                loginModal.classList.add('show');
            } else {
                alert('Debes iniciar sesión para crear contenido.');
            }
            return;
        }
        createModal.classList.add('show'); 
    }
    function closeCreate(){ createModal.classList.remove('show'); }

    createButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openCreate();
        });
    });
    document.addEventListener('click', (e)=>{ 
        if (e.target.closest('.create-btn')) {
            e.preventDefault();
            openCreate();
        }
    });

    createModal.addEventListener('mousedown', function(e) {
        if (!modalContent.contains(e.target)) closeCreate();
    });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeCreate(); });

    // Redirección al botón Organize
    const organizeBtn = createModal.querySelector('[data-go-organize]');
    if (organizeBtn) {
        organizeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Verificar autenticación antes de redirigir
            if (window.auth && !window.auth.isAuthenticated()) {
                closeCreate();
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.style.display = 'flex';
                    loginModal.classList.add('show');
                } else {
                    alert('Debes iniciar sesión para organizar eventos.');
                }
                return;
            }
            window.location.href = pathPrefix() + 'organize.html';
        });
    }

    // Proteger enlaces de Reports también
    const reportsLink = createModal.querySelector('a[href*="report-events"]');
    if (reportsLink) {
        reportsLink.addEventListener('click', function(e) {
            // Verificar autenticación antes de redirigir
            if (window.auth && !window.auth.isAuthenticated()) {
                e.preventDefault();
                closeCreate();
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.style.display = 'flex';
                    loginModal.classList.add('show');
                } else {
                    alert('Debes iniciar sesión para ver reportes.');
                }
            }
        });
    }
});