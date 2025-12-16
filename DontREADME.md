# CER - Crypto Event Reports

Plataforma descentralizada para reportajes de eventos con recompensas en blockchain.

## 🚀 Inicio Rápido

Para empezar rápidamente, consulta [QUICK_START.md](./QUICK_START.md)

## 📚 Documentación

- **[QUICK_START.md](./QUICK_START.md)** - Guía rápida de inicio (5 minutos)
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía completa de despliegue

## 🛠️ Características

- ✅ Registro de usuarios (Reporteros y Organizadores)
- ✅ Creación de solicitudes de reportajes con recompensas en ETH
- ✅ Sistema de aprobación y liberación de recompensas
- ✅ Publicación de reportajes como NFTs
- ✅ Soporte para múltiples redes (Ethereum, Arbitrum)
- ✅ Interfaz web moderna y responsive

## 🌐 Redes Soportadas

- **Sepolia Testnet** (Ethereum) - Para pruebas
- **Arbitrum Sepolia Testnet** - Para pruebas en L2
- **Arbitrum Mainnet** - Producción (recomendado)
- **Ethereum Mainnet** - Producción

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Compilar contratos
npm run compile
```

## 🚀 Despliegue

### Desplegar Contrato a Sepolia

```bash
npm run deploy:sepolia
```

### Desplegar Contrato a Arbitrum Sepolia

```bash
npm run deploy:arbitrum-sepolia
```

### Desplegar Contrato a Arbitrum Mainnet

```bash
npm run deploy:arbitrum
```

## 🔧 Configuración

1. Copia `.env.example` a `.env`
2. Completa las variables de entorno necesarias
3. Configura la dirección del contrato en `Home/js/config.js`
4. Actualiza la red activa en `config/networks.js`

## 📖 Estructura del Proyecto

```
cer/
├── Home/                 # Aplicación web frontend
│   ├── js/              # Scripts JavaScript
│   └── *.html           # Páginas HTML
├── contracts/           # Contratos inteligentes Solidity
│   └── CER.sol          # Contrato principal
├── config/              # Configuración de redes
│   └── networks.js      # Configuración de blockchain
├── scripts/             # Scripts de despliegue
│   └── deploy.js        # Script de despliegue
└── deployments/         # Información de despliegues
```

## 🔐 Seguridad

- ⚠️ Nunca compartas tu clave privada
- ⚠️ No subas el archivo `.env` a Git
- ⚠️ Usa una cuenta dedicada para desarrollo
- ⚠️ Audita el contrato antes de desplegar en mainnet

## 📝 Licencia

MIT

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

## 📞 Soporte

Para ayuda, consulta la documentación o abre un issue en el repositorio.
