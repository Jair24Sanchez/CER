// Módulo de autenticación - Verifica sesión y protege rutas
(function() {
    'use strict';

    // Verificar si hay una sesión activa
    function isAuthenticated() {
        const session = localStorage.getItem('session');
        if (!session) return false;
        
        try {
            const sessionData = JSON.parse(session);
            // Verificar que tenga al menos un identificador válido
            return !!(sessionData.email || sessionData.address || sessionData.provider);
        } catch (e) {
            return false;
        }
    }

    // Obtener información de la sesión actual
    function getSession() {
        const session = localStorage.getItem('session');
        if (!session) return null;
        
        try {
            return JSON.parse(session);
        } catch (e) {
            return null;
        }
    }

    // Cerrar sesión
    function logout() {
        localStorage.removeItem('session');
        updateUI();
        // Redirigir a homepage si estamos en una página protegida
        const protectedPages = ['organize.html', 'reporte-por-iniciativa-propia.html', 'report-events.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (protectedPages.includes(currentPage)) {
            window.location.href = './Homepage.html';
        } else {
            // Recargar la página para actualizar el estado
            window.location.reload();
        }
    }

    // Actualizar UI según estado de autenticación
    function updateUI() {
        const isAuth = isAuthenticated();
        const session = getSession();
        
        // Actualizar botones de login/logout
        const loginButtons = document.querySelectorAll('.login-btn');
        loginButtons.forEach(btn => {
            if (isAuth) {
                // Cambiar a botón de logout
                btn.textContent = 'Logout';
                btn.classList.add('logout-btn');
                btn.classList.remove('login-btn');
                // Remover listeners previos y agregar nuevo
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            } else {
                btn.textContent = 'Login';
                btn.classList.add('login-btn');
                btn.classList.remove('logout-btn');
            }
        });

        // Deshabilitar/habilitar botones Create según autenticación
        const createButtons = document.querySelectorAll('.create-btn');
        createButtons.forEach(btn => {
            if (!isAuth) {
                btn.style.opacity = '0.6';
                btn.style.cursor = 'not-allowed';
            } else {
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            }
        });

        // Mostrar información del usuario si está logueado
        if (isAuth && session) {
            const userInfo = session.email || 
                           (session.address ? `${session.address.substring(0, 6)}...${session.address.substring(session.address.length - 4)}` : null) || 
                           session.provider || 
                           'Usuario';
            console.log('Usuario logueado:', userInfo);
        }
    }

    // Proteger una página - redirige si no está autenticado
    function protectPage() {
        if (!isAuthenticated()) {
            alert('Debes iniciar sesión para acceder a esta página.');
            window.location.href = './Homepage.html';
            return false;
        }
        return true;
    }

    // Proteger funcionalidad - muestra modal de login si no está autenticado
    function protectAction(callback) {
        if (!isAuthenticated()) {
            // Abrir modal de login
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                loginModal.style.display = 'flex';
                loginModal.classList.add('show');
            } else {
                alert('Debes iniciar sesión para realizar esta acción.');
            }
            return false;
        }
        if (callback) callback();
        return true;
    }

    // Inicializar al cargar
    function init() {
        updateUI();
        
        // Escuchar cambios en localStorage para actualizar UI
        window.addEventListener('storage', function(e) {
            if (e.key === 'session') {
                updateUI();
            }
        });

        // Escuchar evento personalizado de cambio de sesión
        window.addEventListener('sessionChanged', function() {
            updateUI();
        });

        // Proteger páginas que requieren autenticación
        const protectedPages = ['organize.html', 'reporte-por-iniciativa-propia.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (protectedPages.includes(currentPage)) {
            protectPage();
        }
    }

    // Exportar funciones globalmente
    window.auth = {
        isAuthenticated: isAuthenticated,
        getSession: getSession,
        logout: logout,
        protectPage: protectPage,
        protectAction: protectAction,
        updateUI: updateUI
    };

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
