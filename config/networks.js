// Configuración de redes blockchain para CER
// Permite cambiar fácilmente entre testnets y mainnet

const NETWORKS = {
    // Testnets de Ethereum
    sepolia: {
        name: 'Sepolia Testnet',
        chainId: '0xaa36a7', // 11155111 en decimal
        rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
        blockExplorer: 'https://sepolia.etherscan.io',
        nativeCurrency: {
            name: 'SepoliaETH',
            symbol: 'SEP',
            decimals: 18
        },
        faucet: 'https://sepoliafaucet.com/',
        isTestnet: true
    },
    
    goerli: {
        name: 'Goerli Testnet',
        chainId: '0x5', // 5 en decimal
        rpcUrl: 'https://goerli.infura.io/v3/YOUR_INFURA_KEY',
        blockExplorer: 'https://goerli.etherscan.io',
        nativeCurrency: {
            name: 'GoerliETH',
            symbol: 'GOR',
            decimals: 18
        },
        faucet: 'https://goerlifaucet.com/',
        isTestnet: true
    },
    
    // Arbitrum Testnet
    arbitrumSepolia: {
        name: 'Arbitrum Sepolia',
        chainId: '0x66eee', // 421614 en decimal
        rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
        blockExplorer: 'https://sepolia.arbiscan.io',
        nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
        },
        faucet: 'https://faucet.quicknode.com/arbitrum/sepolia',
        isTestnet: true,
        parentChain: 'sepolia'
    },
    
    // Arbitrum Mainnet
    arbitrum: {
        name: 'Arbitrum One',
        chainId: '0xa4b1', // 42161 en decimal
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
        blockExplorer: 'https://arbiscan.io',
        nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
        },
        isTestnet: false,
        parentChain: 'ethereum'
    },
    
    // Ethereum Mainnet
    ethereum: {
        name: 'Ethereum Mainnet',
        chainId: '0x1', // 1 en decimal
        rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
        blockExplorer: 'https://etherscan.io',
        nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
        },
        isTestnet: false
    }
};

// Red activa (cambiar según necesidad)
// Para pruebas: 'sepolia' o 'arbitrumSepolia'
// Para producción: 'arbitrum'
const ACTIVE_NETWORK = 'sepolia'; // Cambiar aquí para cambiar de red

// Obtener configuración de la red activa
function getActiveNetwork() {
    return NETWORKS[ACTIVE_NETWORK];
}

// Obtener todas las redes disponibles
function getAllNetworks() {
    return NETWORKS;
}

// Verificar si la red está conectada correctamente
async function checkNetwork() {
    if (!window.ethereum) {
        throw new Error('MetaMask no está instalado');
    }
    
    const network = getActiveNetwork();
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    if (chainId !== network.chainId) {
        // Intentar cambiar de red
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: network.chainId }],
            });
        } catch (switchError) {
            // Si la red no existe en MetaMask, agregarla
            if (switchError.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: network.chainId,
                        chainName: network.name,
                        nativeCurrency: network.nativeCurrency,
                        rpcUrls: [network.rpcUrl],
                        blockExplorerUrls: [network.blockExplorer]
                    }],
                });
            } else {
                throw switchError;
            }
        }
    }
    
    return true;
}

// Exportar para uso en otros archivos
if (typeof window !== 'undefined') {
    window.networkConfig = {
        getActiveNetwork,
        getAllNetworks,
        checkNetwork,
        ACTIVE_NETWORK,
        NETWORKS
    };
}

// Para Node.js (si se usa en scripts de despliegue)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NETWORKS,
        ACTIVE_NETWORK,
        getActiveNetwork,
        getAllNetworks
    };
}

