const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Iniciando despliegue del contrato CER...");
  console.log(`📡 Red: ${hre.network.name}`);
  
  // Obtener el contrato
  const CER = await hre.ethers.getContractFactory("CER");
  
  console.log("⏳ Desplegando contrato...");
  const cer = await CER.deploy();
  
  console.log("⏳ Esperando confirmación...");
  await cer.deployed();

  console.log("✅ Contrato desplegado exitosamente!");
  console.log(`📍 Dirección: ${cer.address}`);
  console.log(`🌐 Red: ${hre.network.name}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  
  // Crear directorio de deployments si no existe
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Guardar información del despliegue
  const deploymentInfo = {
    address: cer.address,
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    timestamp: new Date().toISOString(),
    deployer: (await hre.ethers.getSigners())[0].address
  };
  
  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(
    deploymentFile,
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`💾 Información guardada en: ${deploymentFile}`);
  
  // Mostrar instrucciones para verificar
  console.log("\n📝 Próximos pasos:");
  console.log(`1. Actualiza la dirección del contrato en Home/js/config.js:`);
  console.log(`   CONTRACT_ADDRESSES.${hre.network.name.replace(/\s+/g, '').toLowerCase()} = '${cer.address}';`);
  console.log(`\n2. Verifica el contrato en el block explorer:`);
  
  const blockExplorer = getBlockExplorer(hre.network.name);
  if (blockExplorer) {
    console.log(`   ${blockExplorer}/address/${cer.address}`);
    console.log(`\n3. Comando de verificación:`);
    console.log(`   npx hardhat verify --network ${hre.network.name} ${cer.address}`);
  }
  
  console.log("\n✨ ¡Despliegue completado!");
}

function getBlockExplorer(networkName) {
  const explorers = {
    sepolia: "https://sepolia.etherscan.io",
    goerli: "https://goerli.etherscan.io",
    arbitrumSepolia: "https://sepolia.arbiscan.io",
    arbitrum: "https://arbiscan.io",
    ethereum: "https://etherscan.io"
  };
  
  return explorers[networkName] || null;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante el despliegue:");
    console.error(error);
    process.exit(1);
  });

