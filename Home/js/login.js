// Login module: Email, Google (GIS if configured), and Web3 wallets (EIP-1193)
document.addEventListener('DOMContentLoaded', function() {
    const loginButtons = Array.from(document.querySelectorAll('.login-btn'));
    const loginModal = document.getElementById('loginModal');
    if (!loginModal) return;

    const modalContent = loginModal.querySelector('.modal-create-content');
    const emailInput = loginModal.querySelector('#loginEmail');
    const pwdInput = loginModal.querySelector('#loginPassword');
    const emailSubmit = loginModal.querySelector('#loginSubmit');
    const googleBtn = loginModal.querySelector('#googleLoginBtn');
    const metamaskBtn = loginModal.querySelector('#metamaskBtn');
    const coinbaseBtn = loginModal.querySelector('#coinbaseBtn');
    const rabbyBtn = loginModal.querySelector('#rabbyBtn');
    const wcBtn = loginModal.querySelector('#walletConnectBtn');

    function openModal() { 
        loginModal.style.display = 'flex';
        loginModal.classList.add('show');
    }
    function closeModal() { 
        loginModal.style.display = 'none';
        loginModal.classList.remove('show');
    }

    // Adjuntar a todos los botones LOGIN presentes
    loginButtons.forEach(btn => {
        // Remover listeners previos
        btn.replaceWith(btn.cloneNode(true));
    });
    document.querySelectorAll('.login-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    // Delegación por si se monta dinámicamente
    document.addEventListener('click', (e) => {
        const el = e.target.closest('.login-btn');
        if (el && !el.classList.contains('logout-btn')) {
            e.preventDefault();
            openModal();
        }
    });

    loginModal.addEventListener('mousedown', (e) => { 
        if (!modalContent.contains(e.target)) closeModal(); 
    });
    document.addEventListener('keydown', (e) => { 
        if (e.key === 'Escape') closeModal(); 
    });

    // Helpers
    function setSession(session) {
        localStorage.setItem('session', JSON.stringify(session));
        // Disparar evento personalizado para que auth.js se actualice
        window.dispatchEvent(new CustomEvent('sessionChanged', { detail: session }));
        // Actualizar UI inmediatamente
        if (window.auth && window.auth.updateUI) {
            window.auth.updateUI();
        }
    }
    
    function notifyLogin(name, address = null) {
        const message = address 
            ? `Sesión iniciada con ${name}\nDirección: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`
            : `Sesión iniciada con ${name}`;
        alert(message);
        closeModal();
    }

    // Email/password
    if (emailSubmit) {
        emailSubmit.addEventListener('click', () => {
            const email = emailInput?.value.trim();
            const pwd = pwdInput?.value.trim();
            if (!email || !pwd) { 
                alert('Ingresa email y contraseña'); 
                return; 
            }
            setSession({ provider: 'email', email, timestamp: new Date().toISOString() });
            notifyLogin('email');
        });
    }

    // Google (GIS). Requiere configurar un Client ID: guarda en localStorage key 'googleClientId'
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            const cid = localStorage.getItem('googleClientId');
            if (!cid) {
                alert('Configura tu Google Client ID. Guarda en localStorage la clave "googleClientId".');
                return;
            }
            if (!window.google || !google.accounts || !google.accounts.id) {
                alert('Google Identity aún no está cargado. Reintenta en unos segundos.');
                return;
            }
            try {
                google.accounts.id.initialize({ 
                    client_id: cid, 
                    callback: (resp) => {
                        // Solo guardamos el token de forma local para demo
                        setSession({ 
                            provider: 'google', 
                            credential: resp.credential,
                            timestamp: new Date().toISOString()
                        });
                        notifyLogin('Google');
                    }
                });
                // One-tap / o prompt explícito
                google.accounts.id.prompt();
            } catch (e) {
                console.error(e);
                alert('No se pudo iniciar sesión con Google.');
            }
        });
    }

    // Web3 common connect - Mejorado para detectar diferentes wallets
    async function connectEip1193(prefer) {
        try {
            // Detectar proveedor específico
            let provider = null;
            
            if (prefer === 'metamask') {
                provider = window.ethereum?.isMetaMask ? window.ethereum : null;
            } else if (prefer === 'coinbase') {
                provider = window.ethereum?.isCoinbaseWallet ? window.ethereum : null;
            } else if (prefer === 'rabby') {
                provider = window.ethereum?.isRabby ? window.ethereum : null;
            } else if (prefer === 'walletconnect') {
                // WalletConnect requiere una librería especial, por ahora usamos ethereum si está disponible
                provider = window.ethereum;
                if (!provider) {
                    alert('WalletConnect requiere una configuración especial. Por favor, instala MetaMask, Coinbase Wallet o Rabby.');
                    return;
                }
            } else {
                // Detectar automáticamente
                provider = window.ethereum;
            }

            if (!provider) {
                const walletName = prefer === 'metamask' ? 'MetaMask' : 
                                  prefer === 'coinbase' ? 'Coinbase Wallet' : 
                                  prefer === 'rabby' ? 'Rabby' : 'Wallet';
                alert(`No se encontró ${walletName}. Por favor, instala la extensión del navegador.`);
                return;
            }

            // Solicitar conexión
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            const address = accounts?.[0];
            
            if (!address) {
                alert('No se pudo obtener la dirección de la wallet.');
                return;
            }

            // Determinar nombre del proveedor
            let providerName = prefer || 'wallet';
            if (!prefer) {
                if (provider.isMetaMask) providerName = 'metamask';
                else if (provider.isCoinbaseWallet) providerName = 'coinbase';
                else if (provider.isRabby) providerName = 'rabby';
                else providerName = 'wallet';
            }

            // Guardar sesión
            setSession({ 
                provider: providerName, 
                address: address,
                timestamp: new Date().toISOString()
            });
            
            notifyLogin(providerName, address);

            // Escuchar cambios de cuenta
            if (provider.on) {
                provider.on('accountsChanged', (accounts) => {
                    if (accounts.length === 0) {
                        // Usuario desconectó la wallet
                        localStorage.removeItem('session');
                        window.dispatchEvent(new CustomEvent('sessionChanged'));
                        if (window.auth && window.auth.updateUI) {
                            window.auth.updateUI();
                        }
                    } else {
                        // Usuario cambió de cuenta
                        setSession({ 
                            provider: providerName, 
                            address: accounts[0],
                            timestamp: new Date().toISOString()
                        });
                    }
                });

                provider.on('chainChanged', () => {
                    // Recargar página cuando cambia la red
                    window.location.reload();
                });
            }

        } catch (e) {
            console.error('Error conectando wallet:', e);
            if (e.code === 4001) {
                alert('Conexión rechazada por el usuario.');
            } else {
                alert('Error al conectar la wallet: ' + e.message);
            }
        }
    }

    // Conectar botones de wallets
    metamaskBtn?.addEventListener('click', () => connectEip1193('metamask'));
    coinbaseBtn?.addEventListener('click', () => connectEip1193('coinbase'));
    rabbyBtn?.addEventListener('click', () => connectEip1193('rabby'));
    wcBtn?.addEventListener('click', () => connectEip1193('walletconnect'));
});
