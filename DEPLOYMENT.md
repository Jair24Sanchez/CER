# Guía de Despliegue - CER (Crypto Event Reports)

Esta guía te ayudará a desplegar tu aplicación CER en la web y conectarla a una testnet de Ethereum para pruebas, con el objetivo final de migrar a Arbitrum.

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración Inicial](#configuración-inicial)
3. [Desplegar el Contrato Inteligente](#desplegar-el-contrato-inteligente)
4. [Desplegar la Aplicación Web](#desplegar-la-aplicación-web)
5. [Configurar la Red](#configurar-la-red)
6. [Migración a Arbitrum](#migración-a-arbitrum)

---

## Requisitos Previos

### Herramientas Necesarias

1. **Node.js y npm** (v16 o superior)
   - Descarga: https://nodejs.org/

2. **MetaMask** (extensión del navegador)
   - Descarga: https://metamask.io/

3. **Git** (opcional, para control de versiones)
   - Descarga: https://git-scm.com/

4. **Cuenta en Infura o Alchemy** (para RPC endpoints)
   - Infura: https://infura.io/
   - Alchemy: https://www.alchemy.com/

### Fondos de Testnet

Necesitarás ETH de testnet para pagar las transacciones. Puedes obtenerlos de:

- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Arbitrum Sepolia Faucet**: https://faucet.quicknode.com/arbitrum/sepolia

---

## Configuración Inicial

### 1. Instalar Dependencias

```bash
# Instalar Hardhat (framework para desarrollo de contratos)
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Instalar Web3.js (ya debería estar en tu proyecto)
npm install web3
```

### 2. Configurar Hardhat

Crea un archivo `hardhat.config.js` en la raíz del proyecto:

```javascript
require("@nomicfoundation/hardhat-toolbox");

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
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    arbitrumSepolia: {
      url: `https://sepolia-rollup.arbitrum.io/rpc`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    arbitrum: {
      url: `https://arb1.arbitrum.io/rpc`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (NO lo subas a Git):

```env
INFURA_API_KEY=tu_clave_de_infura_aqui
PRIVATE_KEY=tu_clave_privada_de_metamask_aqui
```

**⚠️ IMPORTANTE**: 
- Nunca compartas tu clave privada
- No subas el archivo `.env` a Git
- Usa una cuenta de MetaMask dedicada para desarrollo

---

## Desplegar el Contrato Inteligente

### Opción 1: Usando Hardhat (Recomendado)

1. **Crear script de despliegue**

Crea `scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
  const CER = await hre.ethers.getContractFactory("CER");
  const cer = await CER.deploy();

  await cer.deployed();

  console.log("CER desplegado en:", cer.address);
  console.log("Network:", hre.network.name);
  
  // Guardar la dirección en un archivo para referencia
  const fs = require("fs");
  const deploymentInfo = {
    address: cer.address,
    network: hre.network.name,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    `deployments/${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

2. **Desplegar a Sepolia Testnet**

```bash
# Compilar el contrato
npx hardhat compile

# Desplegar a Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

3. **Copiar la dirección del contrato**

Después del despliegue, copia la dirección del contrato y guárdala. La necesitarás para configurar la aplicación web.

### Opción 2: Usando Remix IDE (Más Simple)

1. Ve a https://remix.ethereum.org/
2. Crea un nuevo archivo `CER.sol` y pega el código del contrato
3. Compila el contrato (versión 0.8.19)
4. Ve a la pestaña "Deploy & Run"
5. Selecciona "Injected Provider - MetaMask"
6. Asegúrate de estar conectado a Sepolia Testnet en MetaMask
7. Haz clic en "Deploy"
8. Copia la dirección del contrato desplegado

---

## Desplegar la Aplicación Web

### Opción 1: Vercel (Recomendado - Gratis)

1. **Instalar Vercel CLI**

```bash
npm install -g vercel
```

2. **Desplegar**

```bash
# Desde la raíz del proyecto
vercel

# Sigue las instrucciones en pantalla
# Cuando pregunte por el directorio, usa: Home
```

3. **Configurar dominio personalizado** (opcional)

En el dashboard de Vercel, puedes agregar tu dominio personalizado.

### Opción 2: Netlify (Gratis)

1. Ve a https://www.netlify.com/
2. Arrastra la carpeta `Home` a Netlify Drop
3. O conecta tu repositorio de Git

### Opción 3: GitHub Pages (Gratis)

1. Sube tu código a GitHub
2. Ve a Settings > Pages
3. Selecciona la rama y carpeta `Home`
4. Tu sitio estará disponible en `https://tu-usuario.github.io/cer/`

### Opción 4: IPFS + Fleek (Descentralizado)

1. Instala IPFS: https://ipfs.io/
2. Sube tu carpeta `Home` a IPFS
3. Usa Fleek para hosting continuo: https://fleek.co/

---

## Configurar la Red

### 1. Actualizar la Configuración de Red

Edita `config/networks.js` y cambia `ACTIVE_NETWORK`:

```javascript
// Para pruebas en Sepolia
const ACTIVE_NETWORK = 'sepolia';

// Para pruebas en Arbitrum Sepolia
const ACTIVE_NETWORK = 'arbitrumSepolia';

// Para producción en Arbitrum
const ACTIVE_NETWORK = 'arbitrum';
```

### 2. Cargar el Script de Configuración en HTML

Agrega esta línea ANTES de `web3-contract.js` en todos los archivos HTML que lo usen:

```html
<script src="../config/networks.js"></script>
<script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
<script src="./js/web3-contract.js"></script>
```

### 3. Configurar la Dirección del Contrato

Después de desplegar el contrato, configura la dirección en la aplicación:

```javascript
// En la consola del navegador o en un script de inicialización
window.web3Contract.setContractAddress('0xTU_DIRECCION_DEL_CONTRATO_AQUI');
```

O crea un archivo `Home/js/config.js`:

```javascript
// Configuración del contrato por red
const CONTRACT_ADDRESSES = {
    sepolia: '0xTU_DIRECCION_EN_SEPOLIA',
    arbitrumSepolia: '0xTU_DIRECCION_EN_ARBITRUM_SEPOLIA',
    arbitrum: '0xTU_DIRECCION_EN_ARBITRUM'
};

// Auto-configurar según la red activa
document.addEventListener('DOMContentLoaded', () => {
    if (window.networkConfig && window.web3Contract) {
        const network = window.networkConfig.getActiveNetwork();
        const networkKey = network.name.replace(/\s+/g, '').toLowerCase();
        const address = CONTRACT_ADDRESSES[networkKey] || CONTRACT_ADDRESSES.sepolia;
        window.web3Contract.setContractAddress(address);
        console.log(`Contrato configurado para ${network.name}: ${address}`);
    }
});
```

Y agrégalo a tus HTML:

```html
<script src="../config/networks.js"></script>
<script src="./js/config.js"></script>
<script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
<script src="./js/web3-contract.js"></script>
```

---

## Migración a Arbitrum

### Paso 1: Probar en Arbitrum Sepolia Testnet

1. **Obtener ETH de Arbitrum Sepolia**
   - Ve a: https://faucet.quicknode.com/arbitrum/sepolia
   - Conecta tu wallet y solicita tokens

2. **Desplegar el contrato en Arbitrum Sepolia**

```bash
npx hardhat run scripts/deploy.js --network arbitrumSepolia
```

3. **Actualizar la configuración**

```javascript
// En config/networks.js
const ACTIVE_NETWORK = 'arbitrumSepolia';
```

4. **Probar todas las funcionalidades**

### Paso 2: Migrar a Arbitrum Mainnet

1. **Obtener ETH en Arbitrum**
   - Puedes usar un puente como: https://bridge.arbitrum.io/
   - O comprar directamente en un exchange que soporte Arbitrum

2. **Desplegar el contrato en Arbitrum**

```bash
npx hardhat run scripts/deploy.js --network arbitrum
```

3. **Actualizar la configuración de producción**

```javascript
// En config/networks.js
const ACTIVE_NETWORK = 'arbitrum';
```

4. **Verificar el contrato en Arbiscan**

```bash
npx hardhat verify --network arbitrum CONTRACT_ADDRESS
```

---

## Verificación y Testing

### Checklist de Pruebas

- [ ] Contrato desplegado correctamente
- [ ] Dirección del contrato configurada en la app
- [ ] MetaMask conectado a la red correcta
- [ ] Registro de usuarios funciona
- [ ] Creación de solicitudes funciona
- [ ] Depósitos de ETH funcionan
- [ ] Envío de reportajes funciona
- [ ] Aprobación y liberación de recompensas funciona
- [ ] Publicación como NFT funciona

### Comandos Útiles

```bash
# Compilar contratos
npx hardhat compile

# Ejecutar tests (si los tienes)
npx hardhat test

# Verificar contrato en Etherscan/Arbiscan
npx hardhat verify --network NETWORK_NAME CONTRACT_ADDRESS

# Limpiar compilaciones anteriores
npx hardhat clean
```

---

## Solución de Problemas

### Error: "No se encontró un proveedor de Web3"

- Asegúrate de tener MetaMask instalado
- Verifica que MetaMask esté desbloqueado
- Recarga la página

### Error: "Red incorrecta"

- Verifica que estés conectado a la red correcta en MetaMask
- El script `networks.js` debería cambiar automáticamente, pero puedes hacerlo manualmente

### Error: "Contrato no encontrado"

- Verifica que la dirección del contrato sea correcta
- Asegúrate de estar en la misma red donde desplegaste el contrato
- Verifica que el contrato esté desplegado usando el block explorer

### Las transacciones fallan

- Verifica que tengas suficiente ETH para gas
- Aumenta el límite de gas en MetaMask
- Verifica que el contrato tenga los fondos necesarios (para recompensas)

---

## Recursos Adicionales

- **Documentación de Hardhat**: https://hardhat.org/docs
- **Documentación de Arbitrum**: https://docs.arbitrum.io/
- **Web3.js Docs**: https://web3js.readthedocs.io/
- **MetaMask Docs**: https://docs.metamask.io/
- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Arbitrum Bridge**: https://bridge.arbitrum.io/
- **Arbiscan**: https://arbiscan.io/

---

## Próximos Pasos

1. ✅ Desplegar en Sepolia Testnet
2. ✅ Probar todas las funcionalidades
3. ✅ Desplegar en Arbitrum Sepolia
4. ✅ Probar migración de datos (si aplica)
5. ✅ Auditar el contrato (recomendado antes de mainnet)
6. ✅ Desplegar en Arbitrum Mainnet
7. ✅ Marketing y lanzamiento

---

¿Necesitas ayuda? Revisa la documentación o abre un issue en el repositorio.

