# 🚀 Guía Rápida de Inicio - CER

Esta es una guía rápida para poner tu aplicación CER en funcionamiento en una testnet de Ethereum.

## ⚡ Inicio Rápido (5 minutos)

### Paso 1: Instalar Dependencias

```bash
npm install
```

### Paso 2: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
PRIVATE_KEY=tu_clave_privada_de_metamask_aqui
INFURA_API_KEY=tu_clave_de_infura_opcional
```

**⚠️ IMPORTANTE**: 
- Usa una cuenta de MetaMask dedicada para desarrollo
- Nunca compartas tu clave privada
- No subas el archivo `.env` a Git

### Paso 3: Obtener ETH de Testnet

1. Conecta MetaMask a **Sepolia Testnet**
2. Obtén ETH gratis de: https://sepoliafaucet.com/
3. Necesitarás ETH para pagar las transacciones de despliegue

### Paso 4: Desplegar el Contrato

```bash
# Compilar el contrato
npm run compile

# Desplegar a Sepolia
npm run deploy:sepolia
```

**Copia la dirección del contrato** que aparece en la consola.

### Paso 5: Configurar la Aplicación Web

Edita `Home/js/config.js` y actualiza la dirección del contrato:

```javascript
const CONTRACT_ADDRESSES = {
    sepolia: '0xTU_DIRECCION_DEL_CONTRATO_AQUI', // ← Pega aquí la dirección
    // ...
};
```

### Paso 6: Desplegar la Aplicación Web

#### Opción A: Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

#### Opción B: Netlify

1. Ve a https://www.netlify.com/
2. Arrastra la carpeta `Home` a Netlify Drop

#### Opción C: GitHub Pages

1. Sube tu código a GitHub
2. Ve a Settings > Pages
3. Selecciona la carpeta `Home`

### Paso 7: Probar

1. Abre tu aplicación desplegada
2. Conecta MetaMask (asegúrate de estar en Sepolia Testnet)
3. Prueba las funcionalidades:
   - Registrarte como Reportero/Organizador
   - Crear una solicitud de reportaje
   - Enviar un reportaje
   - Aprobar y publicar

## 🎯 Próximos Pasos

Una vez que hayas probado en Sepolia:

1. **Probar en Arbitrum Sepolia**
   ```bash
   npm run deploy:arbitrum-sepolia
   ```
   - Obtén ETH de: https://faucet.quicknode.com/arbitrum/sepolia
   - Actualiza `config/networks.js`: `ACTIVE_NETWORK = 'arbitrumSepolia'`

2. **Migrar a Arbitrum Mainnet** (cuando estés listo)
   ```bash
   npm run deploy:arbitrum
   ```
   - Actualiza `config/networks.js`: `ACTIVE_NETWORK = 'arbitrum'`

## 📚 Documentación Completa

Para más detalles, consulta [DEPLOYMENT.md](./DEPLOYMENT.md)

## ❓ Problemas Comunes

### Error: "No se encontró un proveedor de Web3"
- Instala MetaMask: https://metamask.io/
- Asegúrate de que esté desbloqueado

### Error: "Red incorrecta"
- En MetaMask, cambia a Sepolia Testnet
- O usa el script `networks.js` que cambia automáticamente

### Las transacciones fallan
- Verifica que tengas suficiente ETH de testnet
- Obtén más en: https://sepoliafaucet.com/

## 🆘 ¿Necesitas Ayuda?

- Revisa [DEPLOYMENT.md](./DEPLOYMENT.md) para la guía completa
- Verifica que todos los scripts estén cargados correctamente
- Revisa la consola del navegador para errores

¡Buena suerte con tu despliegue! 🎉

