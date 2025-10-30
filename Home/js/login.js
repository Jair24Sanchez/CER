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

    function openModal() { loginModal.style.display = 'flex'; }
    function closeModal() { loginModal.style.display = 'none'; }

    // Adjuntar a todos los botones LOGIN presentes
    loginButtons.forEach(btn => btn.addEventListener('click', openModal));
    // Delegación por si se monta dinámicamente
    document.addEventListener('click', (e) => {
        const el = e.target.closest('.login-btn');
        if (el) openModal();
    });
    loginModal.addEventListener('mousedown', (e) => { if (!modalContent.contains(e.target)) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    // Helpers
    function setSession(session) {
        localStorage.setItem('session', JSON.stringify(session));
    }
    function notifyLogin(name) { alert('Sesión iniciada con ' + name); closeModal(); }

    // Email/password
    if (emailSubmit) {
        emailSubmit.addEventListener('click', () => {
            const email = emailInput?.value.trim();
            const pwd = pwdInput?.value.trim();
            if (!email || !pwd) { alert('Ingresa email y contraseña'); return; }
            setSession({ provider: 'email', email });
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
                google.accounts.id.initialize({ client_id: cid, callback: (resp) => {
                    // Solo guardamos el token de forma local para demo
                    setSession({ provider: 'google', credential: resp.credential });
                    notifyLogin('Google');
                }});
                // One-tap / o prompt explícito
                google.accounts.id.prompt();
            } catch (e) {
                console.error(e);
                alert('No se pudo iniciar sesión con Google.');
            }
        });
    }

    // Web3 common connect
    async function connectEip1193(prefer) {
        const eth = window.ethereum;
        if (!eth) { alert('No se encontró un proveedor Web3. Instala MetaMask / Coinbase / Rabby.'); return; }
        try {
            const accounts = await eth.request({ method: 'eth_requestAccounts' });
            const address = accounts?.[0];
            let providerName = 'wallet';
            if (prefer) providerName = prefer;
            else if (eth.isMetaMask) providerName = 'metamask';
            else if (eth.isCoinbaseWallet) providerName = 'coinbase';
            else if (eth.isRabby) providerName = 'rabby';
            setSession({ provider: providerName, address });
            notifyLogin(providerName);
        } catch (e) {
            console.error(e);
            alert('Conexión Web3 cancelada o fallida.');
        }
    }

    metamaskBtn?.addEventListener('click', () => connectEip1193('metamask'));
    coinbaseBtn?.addEventListener('click', () => connectEip1193('coinbase'));
    rabbyBtn?.addEventListener('click', () => connectEip1193('rabby'));
    wcBtn?.addEventListener('click', () => connectEip1193('walletconnect'));
});


