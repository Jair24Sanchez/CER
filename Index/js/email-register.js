// Módulo de registro con verificación de correo electrónico
// Protegido con Cloudflare Turnstile

(function() {
    'use strict';

    // Almacenamiento de usuarios registrados
    function getRegisteredUsers() {
        return JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    }

    function saveRegisteredUser(email, password) {
        const users = getRegisteredUsers();
        // Guardar hash de contraseña (en producción usar bcrypt o similar)
        users[email.toLowerCase()] = {
            email: email.toLowerCase(),
            passwordHash: btoa(password), // Base64 simple (en producción usar hash real)
            registeredAt: new Date().toISOString()
        };
        localStorage.setItem('registeredUsers', JSON.stringify(users));
    }

    function verifyUser(email, password) {
        const users = getRegisteredUsers();
        const user = users[email.toLowerCase()];
        if (!user) return false;
        return btoa(password) === user.passwordHash;
    }

    // Generar código de 6 dígitos
    function generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Almacenar códigos de verificación temporalmente
    function saveVerificationCode(email, code) {
        const codes = JSON.parse(localStorage.getItem('verificationCodes') || '{}');
        codes[email.toLowerCase()] = {
            code: code,
            expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutos
        };
        localStorage.setItem('verificationCodes', JSON.stringify(codes));
    }

    function verifyCode(email, code) {
        const codes = JSON.parse(localStorage.getItem('verificationCodes') || '{}');
        const codeData = codes[email.toLowerCase()];
        if (!codeData) return false;
        if (Date.now() > codeData.expiresAt) {
            delete codes[email.toLowerCase()];
            localStorage.setItem('verificationCodes', JSON.stringify(codes));
            return false;
        }
        if (codeData.code === code) {
            delete codes[email.toLowerCase()];
            localStorage.setItem('verificationCodes', JSON.stringify(codes));
            return true;
        }
        return false;
    }

    // Simular envío de correo (en producción usar servicio real como SendGrid, AWS SES, etc.)
    async function sendVerificationEmail(email, code) {
        // En producción, esto haría una llamada a tu backend que envía el correo
        // Por ahora, simulamos el envío y guardamos el código
        console.log(`[SIMULACIÓN] Código de verificación para ${email}: ${code}`);
        
        // Guardar código para verificación
        saveVerificationCode(email, code);
        
        // En desarrollo, mostrar el código en consola
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.warn(`⚠️ MODO DESARROLLO: Código de verificación: ${code}`);
        }
        
        // En producción, aquí harías:
        // return fetch('/api/send-verification-email', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email, code })
        // });
        
        return Promise.resolve({ success: true });
    }

    // Mostrar formulario de registro
    function showRegisterForm() {
        const loginModal = document.getElementById('loginModal');
        if (!loginModal) return;

        const modalContent = loginModal.querySelector('.modal-create-content');
        const currentView = modalContent.getAttribute('data-view') || 'login';

        if (currentView === 'register') return; // Ya está en registro

        // Guardar contenido de login para poder volver
        if (currentView === 'login') {
            modalContent.setAttribute('data-login-html', modalContent.innerHTML);
        }

        modalContent.innerHTML = `
            <img src="${getLogoPath()}cer_blanco.png" alt="CER Logo" class="modal-create-logo" style="margin-bottom:0;">
            <div class="modal-create-title" style="margin:0;">REGISTRO</div>
            <input id="registerEmail" type="email" placeholder="Email" class="filter-select" style="width: 90%;" required>
            <button id="sendCodeBtn" class="modal-create-btn" style="background:#000;">Enviar código de verificación</button>
            <div id="cloudflare-widget" style="margin: 1rem 0; display: none;"></div>
            <div id="codeVerificationSection" style="display: none;">
                <input id="verificationCode" type="text" placeholder="Código de 6 dígitos" class="filter-select" style="width: 90%;" maxlength="6" pattern="[0-9]{6}">
                <button id="verifyCodeBtn" class="modal-create-btn" style="background:#22c55e;">Verificar código</button>
            </div>
            <div id="passwordSection" style="display: none;">
                <input id="registerPassword" type="password" placeholder="Contraseña" class="filter-select" style="width: 90%;" required>
                <input id="registerPasswordConfirm" type="password" placeholder="Confirmar contraseña" class="filter-select" style="width: 90%;" required>
                <button id="completeRegisterBtn" class="modal-create-btn" style="background:#22c55e;">Completar registro</button>
            </div>
            <div id="registerError" style="color: #dc3545; font-size: 0.9rem; margin-top: 0.5rem; display: none;"></div>
            <div style="margin-top: 1rem; text-align: center;">
                <a href="#" id="backToLogin" style="color: #666; text-decoration: underline; font-size: 0.9rem;">Volver a login</a>
            </div>
        `;

        modalContent.setAttribute('data-view', 'register');
        initRegisterForm();
    }

    // Inicializar formulario de registro
    function initRegisterForm() {
        const sendCodeBtn = document.getElementById('sendCodeBtn');
        const verifyCodeBtn = document.getElementById('verifyCodeBtn');
        const completeRegisterBtn = document.getElementById('completeRegisterBtn');
        const backToLogin = document.getElementById('backToLogin');
        const cloudflareWidget = document.getElementById('cloudflare-widget');

        // Volver a login
        backToLogin?.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginForm();
        });

        // Enviar código
        sendCodeBtn?.addEventListener('click', async () => {
            const emailInput = document.getElementById('registerEmail');
            const email = emailInput?.value.trim();
            const errorDiv = document.getElementById('registerError');

            if (!email) {
                showError('Por favor, ingresa un correo electrónico.');
                return;
            }

            if (!isValidEmail(email)) {
                showError('Por favor, ingresa un correo electrónico válido.');
                return;
            }

            // Verificar si el usuario ya está registrado
            const users = getRegisteredUsers();
            if (users[email.toLowerCase()]) {
                showError('Este correo ya está registrado. Por favor, inicia sesión.');
                return;
            }

            // Mostrar Cloudflare Turnstile
            if (window.turnstile) {
                try {
                    cloudflareWidget.style.display = 'block';
                    const widgetId = window.turnstile.render(cloudflareWidget, {
                        sitekey: getCloudflareSiteKey(),
                        callback: async (token) => {
                            // Verificar token con backend (en producción)
                            // Por ahora, solo verificamos que existe
                            if (token) {
                                await processEmailVerification(email);
                            }
                        },
                        'error-callback': () => {
                            showError('Error en la verificación de Cloudflare. Por favor, intenta de nuevo.');
                        }
                    });
                    cloudflareWidget.setAttribute('data-widget-id', widgetId);
                } catch (error) {
                    console.error('Error inicializando Cloudflare:', error);
                    // Continuar sin Cloudflare en caso de error
                    await processEmailVerification(email);
                }
            } else {
                // Si Cloudflare no está cargado, continuar sin él (solo en desarrollo)
                console.warn('Cloudflare Turnstile no está cargado. Continuando sin protección.');
                await processEmailVerification(email);
            }
        });

        // Verificar código
        verifyCodeBtn?.addEventListener('click', () => {
            const emailInput = document.getElementById('registerEmail');
            const codeInput = document.getElementById('verificationCode');
            const email = emailInput?.value.trim();
            const code = codeInput?.value.trim();

            if (!code || code.length !== 6) {
                showError('Por favor, ingresa el código de 6 dígitos.');
                return;
            }

            if (verifyCode(email, code)) {
                // Ocultar sección de código, mostrar sección de contraseña
                document.getElementById('codeVerificationSection').style.display = 'none';
                document.getElementById('passwordSection').style.display = 'block';
                showError(''); // Limpiar errores
            } else {
                showError('Código inválido o expirado. Por favor, solicita uno nuevo.');
            }
        });

        // Completar registro
        completeRegisterBtn?.addEventListener('click', () => {
            const emailInput = document.getElementById('registerEmail');
            const passwordInput = document.getElementById('registerPassword');
            const passwordConfirmInput = document.getElementById('registerPasswordConfirm');
            
            const email = emailInput?.value.trim();
            const password = passwordInput?.value;
            const passwordConfirm = passwordConfirmInput?.value;

            if (!password || password.length < 6) {
                showError('La contraseña debe tener al menos 6 caracteres.');
                return;
            }

            if (password !== passwordConfirm) {
                showError('Las contraseñas no coinciden.');
                return;
            }

            // Guardar usuario
            saveRegisteredUser(email, password);

            // Hacer login automático
            const sessionData = {
                provider: 'email',
                email: email,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('session', JSON.stringify(sessionData));
            window.dispatchEvent(new CustomEvent('sessionChanged', { detail: sessionData }));
            
            // Actualizar UI
            if (window.auth && window.auth.updateUI) {
                window.auth.updateUI();
            }

            // Cerrar modal y mostrar mensaje
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                loginModal.style.display = 'none';
                loginModal.classList.remove('show');
            }

            alert('¡Registro exitoso! Has iniciado sesión automáticamente.');
            
            // Actualizar UI
            if (window.auth && window.auth.updateUI) {
                window.auth.updateUI();
            }
        });

        // Permitir Enter en código
        document.getElementById('verificationCode')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                verifyCodeBtn?.click();
            }
        });
    }

    // Procesar verificación de correo
    async function processEmailVerification(email) {
        const code = generateVerificationCode();
        
        try {
            await sendVerificationEmail(email, code);
            
            // Ocultar botón de enviar código y Cloudflare, mostrar sección de código
            document.getElementById('sendCodeBtn').style.display = 'none';
            document.getElementById('cloudflare-widget').style.display = 'none';
            document.getElementById('codeVerificationSection').style.display = 'block';
            showError('');
            
            // Limpiar widget de Cloudflare si existe
            const widgetId = document.getElementById('cloudflare-widget').getAttribute('data-widget-id');
            if (widgetId && window.turnstile) {
                window.turnstile.remove(widgetId);
            }
        } catch (error) {
            console.error('Error enviando correo:', error);
            showError('Error al enviar el código. Por favor, intenta de nuevo.');
        }
    }

    // Mostrar formulario de login
    function showLoginForm() {
        const loginModal = document.getElementById('loginModal');
        if (!loginModal) return;

        const modalContent = loginModal.querySelector('.modal-create-content');
        const savedHtml = modalContent.getAttribute('data-login-html');
        
        if (savedHtml) {
            modalContent.innerHTML = savedHtml;
        } else {
            // Restaurar HTML original si no está guardado
            const logoPath = getLogoPath();
            modalContent.innerHTML = `
                <img src="${logoPath}cer_blanco.png" alt="CER Logo" class="modal-create-logo" style="margin-bottom:0;">
                <div class="modal-create-title" style="margin:0;">LOGIN</div>
                <input id="loginEmail" type="email" placeholder="Email" class="filter-select" style="width: 90%;">
                <input id="loginPassword" type="password" placeholder="Password" class="filter-select" style="width: 90%;">
                <button id="loginSubmit" class="modal-create-btn" style="background:#000;">Entrar</button>
                <div style="margin-top: 0.5rem; text-align: center;">
                    <a href="#" id="registerLink" style="color: #666; text-decoration: underline; font-size: 0.9rem;">Si no te has registrado haz click aquí</a>
                </div>
                <div style="margin:8px 0; font-weight:600;">o</div>
                <button id="googleLoginBtn" class="modal-create-btn google-btn">Continuar con Google</button>
                <div style="margin:8px 0; font-weight:600;">o conecta una wallet</div>
                <div class="wallet-grid">
                    <button id="metamaskBtn" class="modal-create-btn">MetaMask</button>
                    <button id="coinbaseBtn" class="modal-create-btn">Coinbase Wallet</button>
                    <button id="rabbyBtn" class="modal-create-btn">Rabby</button>
                    <button id="walletConnectBtn" class="modal-create-btn">WalletConnect</button>
                </div>
            `;
        }

        modalContent.setAttribute('data-view', 'login');
        
        // Re-inicializar listeners de login
        if (window.loginModule && window.loginModule.initLoginListeners) {
            window.loginModule.initLoginListeners();
        }
    }

    // Helper functions
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(message) {
        const errorDiv = document.getElementById('registerError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = message ? 'block' : 'none';
        }
    }

    function getLogoPath() {
        // Detectar si estamos en subdirectorio
        const path = window.location.pathname;
        if (path.includes('/reportajes/')) {
            return '../';
        }
        return './';
    }

    function getCloudflareSiteKey() {
        // Obtener site key de Cloudflare (configurar en localStorage o variable de entorno)
        return localStorage.getItem('cloudflareSiteKey') || '1x00000000000000000000AA'; // Site key de prueba
    }

    // Actualizar login para verificar usuarios registrados
    function updateLoginVerification() {
        const emailSubmit = document.getElementById('loginSubmit');
        if (!emailSubmit) return;

        // Remover listener anterior si existe
        const newSubmit = emailSubmit.cloneNode(true);
        emailSubmit.parentNode.replaceChild(newSubmit, emailSubmit);

        newSubmit.addEventListener('click', () => {
            const emailInput = document.getElementById('loginEmail');
            const pwdInput = document.getElementById('loginPassword');
            const email = emailInput?.value.trim();
            const pwd = pwdInput?.value.trim();

            if (!email || !pwd) {
                alert('Ingresa email y contraseña');
                return;
            }

            // Verificar credenciales
            if (verifyUser(email, pwd)) {
                // Login exitoso
                if (window.auth && window.auth.setSession) {
                    window.auth.setSession({
                        provider: 'email',
                        email: email,
                        timestamp: new Date().toISOString()
                    });
                } else {
                    localStorage.setItem('session', JSON.stringify({
                        provider: 'email',
                        email: email,
                        timestamp: new Date().toISOString()
                    }));
                    window.dispatchEvent(new CustomEvent('sessionChanged'));
                }

                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    loginModal.style.display = 'none';
                    loginModal.classList.remove('show');
                }

                alert('Sesión iniciada exitosamente.');
                
                if (window.auth && window.auth.updateUI) {
                    window.auth.updateUI();
                }
            } else {
                alert('Email o contraseña incorrectos.');
            }
        });
    }

    // Inicializar cuando el DOM esté listo
    function init() {
        // Esperar a que login.js se cargue
        setTimeout(() => {
            // Agregar event listeners a todos los enlaces de registro existentes
            const registerLinks = document.querySelectorAll('#registerLink');
            registerLinks.forEach(link => {
                // Remover listeners previos
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
                
                // Agregar nuevo listener
                newLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    showRegisterForm();
                });
            });

            // Si no hay enlaces, agregarlos dinámicamente
            const loginModals = document.querySelectorAll('#loginModal');
            loginModals.forEach(modal => {
                const modalContent = modal.querySelector('.modal-create-content');
                if (modalContent && !modalContent.querySelector('#registerLink')) {
                    const loginSubmit = modalContent.querySelector('#loginSubmit');
                    if (loginSubmit) {
                        const registerLinkContainer = document.createElement('div');
                        registerLinkContainer.className = 'register-link-container';
                        registerLinkContainer.innerHTML = `
                            <a href="#" id="registerLink" class="register-link">Si no te has registrado haz click aquí</a>
                        `;
                        loginSubmit.parentNode.insertBefore(registerLinkContainer, loginSubmit.nextSibling);
                        
                        registerLinkContainer.querySelector('#registerLink').addEventListener('click', (e) => {
                            e.preventDefault();
                            showRegisterForm();
                        });
                    }
                }
            });

            // Actualizar verificación de login
            updateLoginVerification();
        }, 100);
    }

    // Exportar funciones
    window.emailRegister = {
        showRegisterForm,
        showLoginForm,
        verifyUser,
        getRegisteredUsers
    };

    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

