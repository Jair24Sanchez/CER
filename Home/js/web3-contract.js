// Módulo para interactuar con el contrato inteligente CER
// Maneja roles, solicitudes de reportajes, depósitos de ETH y publicación de tokens

(function() {
    'use strict';

    // Dirección del contrato inteligente (se configurará cuando se despliegue)
    const CONTRACT_ADDRESS = localStorage.getItem('cerContractAddress') || '0x0000000000000000000000000000000000000000';
    
    // ABI simplificado del contrato (interfaz)
    const CONTRACT_ABI = [
        {
            "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
            "name": "getUserRole",
            "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
            "name": "registerAsReporter",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
            "name": "registerAsOrganizer",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {"internalType": "string", "name": "title", "type": "string"},
                {"internalType": "string", "name": "description", "type": "string"},
                {"internalType": "uint256", "name": "reportersNeeded", "type": "uint256"},
                {"internalType": "bool", "name": "hasReward", "type": "bool"}
            ],
            "name": "createReportRequest",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "uint256", "name": "requestId", "type": "uint256"}],
            "name": "getRequestDetails",
            "outputs": [
                {"internalType": "address", "name": "organizer", "type": "address"},
                {"internalType": "string", "name": "title", "type": "string"},
                {"internalType": "uint256", "name": "rewardAmount", "type": "uint256"},
                {"internalType": "bool", "name": "hasReward", "type": "bool"},
                {"internalType": "uint8", "name": "status", "type": "uint8"}
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {"internalType": "uint256", "name": "requestId", "type": "uint256"},
                {"internalType": "string", "name": "contentHash", "type": "string"}
            ],
            "name": "submitReport",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {"internalType": "uint256", "name": "requestId", "type": "uint256"},
                {"internalType": "address", "name": "reporter", "type": "address"}
            ],
            "name": "approveReport",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {"internalType": "uint256", "name": "requestId", "type": "uint256"},
                {"internalType": "string", "name": "tokenURI", "type": "string"}
            ],
            "name": "publishReportAsToken",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    // Roles
    const ROLES = {
        NONE: 0,
        REPORTER: 1,
        ORGANIZER: 2,
        BOTH: 3
    };

    // Estados de solicitud
    const REQUEST_STATUS = {
        PENDING: 0,
        IN_PROGRESS: 1,
        SUBMITTED: 2,
        APPROVED: 3,
        PUBLISHED: 4,
        REJECTED: 5
    };

    // Obtener instancia del contrato
    async function getContract() {
        if (!window.ethereum) {
            throw new Error('No se encontró un proveedor de Web3. Por favor, instala MetaMask u otra wallet.');
        }

        const provider = window.ethereum;
        const web3 = new Web3(provider);
        
        // Obtener cuenta actual
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
            throw new Error('No se pudo obtener la cuenta de la wallet.');
        }

        // Crear instancia del contrato
        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        return { contract, web3, account: accounts[0] };
    }

    // Obtener rol del usuario
    async function getUserRole(address) {
        try {
            const { contract } = await getContract();
            const role = await contract.methods.getUserRole(address).call();
            return parseInt(role);
        } catch (error) {
            console.error('Error obteniendo rol:', error);
            // Si el contrato no está desplegado, permitir roles locales
            return getLocalRole(address);
        }
    }

    // Obtener rol desde localStorage (fallback)
    function getLocalRole(address) {
        const userRoles = JSON.parse(localStorage.getItem('userRoles') || '{}');
        return userRoles[address] || ROLES.NONE;
    }

    // Guardar rol en localStorage (fallback)
    function setLocalRole(address, role) {
        const userRoles = JSON.parse(localStorage.getItem('userRoles') || '{}');
        userRoles[address] = role;
        localStorage.setItem('userRoles', JSON.stringify(userRoles));
    }

    // Registrar como Reportero
    async function registerAsReporter(address) {
        try {
            const { contract, web3, account } = await getContract();
            
            // Verificar que la cuenta coincida
            if (account.toLowerCase() !== address.toLowerCase()) {
                throw new Error('La dirección no coincide con la cuenta conectada.');
            }

            // Intentar registrar en blockchain
            try {
                await contract.methods.registerAsReporter(account).send({ from: account });
            } catch (error) {
                // Si falla (contrato no desplegado), usar localStorage
                console.warn('No se pudo registrar en blockchain, usando almacenamiento local:', error);
            }

            // Actualizar rol local
            const currentRole = getLocalRole(address);
            const newRole = currentRole === ROLES.ORGANIZER ? ROLES.BOTH : ROLES.REPORTER;
            setLocalRole(address, newRole);

            return newRole;
        } catch (error) {
            console.error('Error registrando como reportero:', error);
            // Fallback a localStorage
            const currentRole = getLocalRole(address);
            const newRole = currentRole === ROLES.ORGANIZER ? ROLES.BOTH : ROLES.REPORTER;
            setLocalRole(address, newRole);
            return newRole;
        }
    }

    // Registrar como Organizador
    async function registerAsOrganizer(address) {
        try {
            const { contract, web3, account } = await getContract();
            
            if (account.toLowerCase() !== address.toLowerCase()) {
                throw new Error('La dirección no coincide con la cuenta conectada.');
            }

            try {
                await contract.methods.registerAsOrganizer(account).send({ from: account });
            } catch (error) {
                console.warn('No se pudo registrar en blockchain, usando almacenamiento local:', error);
            }

            const currentRole = getLocalRole(address);
            const newRole = currentRole === ROLES.REPORTER ? ROLES.BOTH : ROLES.ORGANIZER;
            setLocalRole(address, newRole);

            return newRole;
        } catch (error) {
            console.error('Error registrando como organizador:', error);
            const currentRole = getLocalRole(address);
            const newRole = currentRole === ROLES.REPORTER ? ROLES.BOTH : ROLES.ORGANIZER;
            setLocalRole(address, newRole);
            return newRole;
        }
    }

    // Crear solicitud de reportaje
    async function createReportRequest(requestData) {
        try {
            const { contract, web3, account } = await getContract();
            
            const {
                title,
                description,
                reportersNeeded,
                hasReward,
                rewardAmount // en ETH (se convertirá a Wei)
            } = requestData;

            // Convertir ETH a Wei si hay recompensa
            const valueInWei = hasReward && rewardAmount > 0 
                ? web3.utils.toWei(rewardAmount.toString(), 'ether')
                : '0';

            // Crear solicitud en blockchain
            let requestId;
            try {
                const result = await contract.methods.createReportRequest(
                    title,
                    description,
                    reportersNeeded,
                    hasReward
                ).send({
                    from: account,
                    value: valueInWei
                });

                // El requestId debería venir del evento emitido
                // Por ahora, usamos un timestamp como ID
                requestId = Date.now().toString();
            } catch (error) {
                console.warn('No se pudo crear solicitud en blockchain, usando almacenamiento local:', error);
                requestId = Date.now().toString();
            }

            // Guardar también en localStorage para compatibilidad
            const localRequest = {
                id: requestId,
                ...requestData,
                organizer: account,
                organizerAddress: account,
                status: 'disponible',
                createdAt: new Date().toISOString(),
                blockchainRequestId: requestId
            };

            const requestedEvents = JSON.parse(localStorage.getItem('requestedEvents') || '[]');
            requestedEvents.push(localRequest);
            localStorage.setItem('requestedEvents', JSON.stringify(requestedEvents));

            return requestId;
        } catch (error) {
            console.error('Error creando solicitud:', error);
            throw error;
        }
    }

    // Enviar reportaje para aprobación
    async function submitReportForApproval(requestId, reportContent) {
        try {
            const { contract, web3, account } = await getContract();
            
            // Crear hash del contenido (en producción, usar IPFS)
            const contentHash = web3.utils.keccak256(JSON.stringify(reportContent));

            try {
                await contract.methods.submitReport(requestId, contentHash).send({ from: account });
            } catch (error) {
                console.warn('No se pudo enviar reportaje a blockchain, usando almacenamiento local:', error);
            }

            // Actualizar estado en localStorage
            const requestedEvents = JSON.parse(localStorage.getItem('requestedEvents') || '[]');
            const event = requestedEvents.find(e => e.id === requestId || e.blockchainRequestId === requestId);
            if (event) {
                event.status = 'espera';
                event.submittedReport = reportContent;
                event.reporterAddress = account;
                event.submittedAt = new Date().toISOString();
                localStorage.setItem('requestedEvents', JSON.stringify(requestedEvents));
            }

            return true;
        } catch (error) {
            console.error('Error enviando reportaje:', error);
            throw error;
        }
    }

    // Aprobar reportaje y liberar recompensa
    async function approveReportAndReleaseReward(requestId, reporterAddress) {
        try {
            const { contract, web3, account } = await getContract();
            
            // Verificar que el usuario es el organizador
            const requestedEvents = JSON.parse(localStorage.getItem('requestedEvents') || '[]');
            const event = requestedEvents.find(e => e.id === requestId || e.blockchainRequestId === requestId);
            
            if (!event) {
                throw new Error('Solicitud no encontrada.');
            }

            if (event.organizerAddress.toLowerCase() !== account.toLowerCase()) {
                throw new Error('Solo el organizador puede aprobar reportajes.');
            }

            // Aprobar en blockchain
            try {
                await contract.methods.approveReport(requestId, reporterAddress).send({ from: account });
            } catch (error) {
                console.warn('No se pudo aprobar en blockchain, usando almacenamiento local:', error);
            }

            // Actualizar estado
            event.status = 'publicado';
            event.approvedAt = new Date().toISOString();
            event.approvedBy = account;
            localStorage.setItem('requestedEvents', JSON.stringify(requestedEvents));

            return true;
        } catch (error) {
            console.error('Error aprobando reportaje:', error);
            throw error;
        }
    }

    // Publicar reportaje como token NFT
    async function publishReportAsToken(requestId, tokenURI) {
        try {
            const { contract, web3, account } = await getContract();
            
            let tokenId;
            try {
                const result = await contract.methods.publishReportAsToken(requestId, tokenURI).send({ from: account });
                // El tokenId debería venir del evento
                tokenId = Date.now().toString();
            } catch (error) {
                console.warn('No se pudo publicar token en blockchain, usando almacenamiento local:', error);
                tokenId = Date.now().toString();
            }

            // Guardar información del token
            const requestedEvents = JSON.parse(localStorage.getItem('requestedEvents') || '[]');
            const event = requestedEvents.find(e => e.id === requestId || e.blockchainRequestId === requestId);
            if (event) {
                event.tokenId = tokenId;
                event.tokenURI = tokenURI;
                event.publishedAt = new Date().toISOString();
                localStorage.setItem('requestedEvents', JSON.stringify(requestedEvents));
            }

            return tokenId;
        } catch (error) {
            console.error('Error publicando token:', error);
            throw error;
        }
    }

    // Verificar si el usuario tiene un rol específico
    async function hasRole(address, role) {
        const userRole = await getUserRole(address);
        return (userRole & role) === role || userRole === ROLES.BOTH;
    }

    // Obtener solicitudes del usuario (como organizador)
    async function getOrganizerRequests(organizerAddress) {
        const requestedEvents = JSON.parse(localStorage.getItem('requestedEvents') || '[]');
        return requestedEvents.filter(e => 
            e.organizerAddress && 
            e.organizerAddress.toLowerCase() === organizerAddress.toLowerCase()
        );
    }

    // Obtener solicitudes disponibles para reporteros
    async function getAvailableRequests() {
        const requestedEvents = JSON.parse(localStorage.getItem('requestedEvents') || '[]');
        return requestedEvents.filter(e => e.status === 'disponible' || e.status === 'comienza');
    }

    // Exportar funciones
    window.web3Contract = {
        ROLES,
        REQUEST_STATUS,
        getUserRole,
        registerAsReporter,
        registerAsOrganizer,
        createReportRequest,
        submitReportForApproval,
        approveReportAndReleaseReward,
        publishReportAsToken,
        hasRole,
        getOrganizerRequests,
        getAvailableRequests,
        getContract,
        setContractAddress: (address) => {
            localStorage.setItem('cerContractAddress', address);
        }
    };
})();

