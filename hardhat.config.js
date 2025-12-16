require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Red local para desarrollo
    hardhat: {
      chainId: 1337
    },
    
    // Sepolia Testnet (Ethereum)
    sepolia: {
      url: process.env.INFURA_API_KEY 
        ? `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
        : `https://rpc.sepolia.org`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111
    },
    
    // Goerli Testnet (Ethereum) - Deprecado pero aún funcional
    goerli: {
      url: process.env.INFURA_API_KEY 
        ? `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
        : `https://rpc.ankr.com/eth_goerli`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 5
    },
    
    // Arbitrum Sepolia Testnet
    arbitrumSepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 421614
    },
    
    // Arbitrum Mainnet
    arbitrum: {
      url: process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 42161
    },
    
    // Ethereum Mainnet
    ethereum: {
      url: process.env.INFURA_API_KEY 
        ? `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
        : `https://eth.llamarpc.com`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1
    }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      goerli: process.env.ETHERSCAN_API_KEY || "",
      arbitrumSepolia: process.env.ARBISCAN_API_KEY || "",
      arbitrum: process.env.ARBISCAN_API_KEY || "",
      mainnet: process.env.ETHERSCAN_API_KEY || ""
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

