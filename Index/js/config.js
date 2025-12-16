// Configuración del contrato CER por red
// Actualiza estas direcciones después de desplegar el contrato en cada red

const CONTRACT_ADDRESSES = {
    // Sepolia Testnet
    sepolia: '0x0000000000000000000000000000000000000000', // Reemplazar después del despliegue
    
    // Arbitrum Sepolia Testnet
    arbitrumsepolia: '0x0000000000000000000000000000000000000000', // Reemplazar después del despliegue
    
    // Arbitrum Mainnet
    arbitrumone: '0x0000000000000000000000000000000000000000', // Reemplazar después del despliegue
    
    // Ethereum Mainnet
    ethereummainnet: '0x0000000000000000000000000000000000000000' // Reemplazar después del despliegue
};

// Función para obtener la dirección del contrato según la red activa
function getContractAddressForNetwork() {
    if (!window.networkConfig) {
        console.warn('networkConfig no está disponible, usando dirección por defecto');
        return localStorage.getItem('cerContractAddress') || '0x0000000000000000000000000000000000000000';
    }
    
    try {
        const network = window.networkConfig.getActiveNetwork();
        const networkKey = network.name.replace(/\s+/g, '').toLowerCase();
        
        // Buscar en CONTRACT_ADDRESSES
        let address = CONTRACT_ADDRESSES[networkKey];
        
        // Si no se encuentra, intentar variaciones comunes
        if (!address || address === '0x0000000000000000000000000000000000000000') {
            const variations = [
                networkKey,
                networkKey.replace('testnet', ''),
                networkKey.replace('mainnet', ''),
                networkKey.replace('one', '')
            ];
            
            for (const variation of variations) {
                if (CONTRACT_ADDRESSES[variation] && CONTRACT_ADDRESSES[variation] !== '0x0000000000000000000000000000000000000000') {
                    address = CONTRACT_ADDRESSES[variation];
                    break;
                }
            }
        }
        
        // Si aún no hay dirección, usar localStorage como fallback
        if (!address || address === '0x0000000000000000000000000000000000000000') {
            address = localStorage.getItem(`cerContractAddress_${networkKey}`) || 
                     localStorage.getItem('cerContractAddress') || 
                     '0x0000000000000000000000000000000000000000';
        }
        
        return address;
    } catch (error) {
        console.error('Error obteniendo dirección del contrato:', error);
        return localStorage.getItem('cerContractAddress') || '0x0000000000000000000000000000000000000000';
    }
}

// Auto-configurar el contrato cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que networkConfig y web3Contract estén disponibles
    const initConfig = () => {
        if (window.networkConfig && window.web3Contract) {
            const address = getContractAddressForNetwork();
            if (address && address !== '0x0000000000000000000000000000000000000000') {
                window.web3Contract.setContractAddress(address);
                console.log(`✅ Contrato configurado: ${address}`);
                
                // Mostrar información de la red en consola
                try {
                    const network = window.networkConfig.getActiveNetwork();
                    console.log(`🌐 Red activa: ${network.name} (Chain ID: ${network.chainId})`);
                } catch (e) {
                    // Ignorar errores
                }
            } else {
                console.warn('⚠️ No se ha configurado una dirección de contrato. Usa setContractAddress() después de desplegar.');
            }
        } else {
            // Reintentar después de un breve delay
            setTimeout(initConfig, 100);
        }
    };
    
    initConfig();
});

// Exportar para uso manual si es necesario
if (typeof window !== 'undefined') {
    window.cerConfig = {
        CONTRACT_ADDRESSES,
        getContractAddressForNetwork,
        setContractAddress: (address, networkName) => {
            if (networkName) {
                const networkKey = networkName.replace(/\s+/g, '').toLowerCase();
                CONTRACT_ADDRESSES[networkKey] = address;
                localStorage.setItem(`cerContractAddress_${networkKey}`, address);
            }
            localStorage.setItem('cerContractAddress', address);
            if (window.web3Contract) {
                window.web3Contract.setContractAddress(address);
            }
            console.log(`✅ Dirección del contrato actualizada: ${address}`);
        }
    };
}

