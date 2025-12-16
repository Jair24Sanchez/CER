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

    // Obtener rol del usuario actual
    async function getUserRole() {
        const session = getSession();
        if (!session || !session.address) {
            return null;
        }

        // Si tenemos web3Contract disponible, usarlo
        if (window.web3Contract) {
            try {
                const role = await window.web3Contract.getUserRole(session.address);
                return role;
            } catch (error) {
                console.error('Error obteniendo rol:', error);
            }
        }

        // Fallback: verificar en la sesión
        return session.role || null;
    }

    // Verificar si el usuario tiene un rol específico
    async function hasRole(requiredRole) {
        const session = getSession();
        if (!session || !session.address) {
            return false;
        }

        if (window.web3Contract) {
            try {
                return await window.web3Contract.hasRole(session.address, requiredRole);
            } catch (error) {
                console.error('Error verificando rol:', error);
            }
        }

        // Fallback: verificar en la sesión
        const userRole = session.role || 0;
        const ROLES = window.web3Contract?.ROLES || { REPORTER: 1, ORGANIZER: 2, BOTH: 3 };
        return (userRole & requiredRole) === requiredRole || userRole === ROLES.BOTH;
    }

    // Verificar si el usuario es Reportero
    async function isReporter() {
        const ROLES = window.web3Contract?.ROLES || { REPORTER: 1, ORGANIZER: 2, BOTH: 3 };
        return await hasRole(ROLES.REPORTER);
    }

    // Verificar si el usuario es Organizador
    async function isOrganizer() {
        const ROLES = window.web3Contract?.ROLES || { REPORTER: 1, ORGANIZER: 2, BOTH: 3 };
        return await hasRole(ROLES.ORGANIZER);
    }

    // Proteger página para un rol específico
    async function protectPageForRole(requiredRole, roleName) {
        if (!isAuthenticated()) {
            alert('Debes iniciar sesión para acceder a esta página.');
            window.location.href = './Homepage.html';
            return false;
        }

        const hasRequiredRole = await hasRole(requiredRole);
        if (!hasRequiredRole) {
            alert(`Esta página es solo para ${roleName}. Por favor, registra tu rol primero.`);
            window.location.href = './Homepage.html';
            return false;
        }

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
        updateUI: updateUI,
        getUserRole: getUserRole,
        hasRole: hasRole,
        isReporter: isReporter,
        isOrganizer: isOrganizer,
        protectPageForRole: protectPageForRole
    };

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
