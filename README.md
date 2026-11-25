# CertiBlock: certificados verificables en Avalanche

Proyecto del hackathon *Chile Team1 Avalanche* para el curso IN3863, Aplicaciones de Blockchain y Criptomonedas (FCFM, U. de Chile).

**El problema:** verificar un título o certificado hoy significa escribirle a la institución y esperar días. Un PDF se puede adulterar en minutos (por ejemplo, cambiarle la nota) y quien lo recibe no tiene cómo saberlo.

**La solución:** la institución registra en la blockchain la **huella digital** (hash SHA-256) de cada certificado que emite. Cualquier persona, por ejemplo una empresa que contrata, sube el PDF a CertiBlock y en segundos sabe:

- si fue emitido por esa institución,
- cuándo se emitió,
- si sigue vigente o fue revocado,
- y si alguien lo modificó, porque cambiar una sola coma produce otra huella y el documento aparece como *No registrado*.

En la blockchain **no se guardan datos personales**: solo la huella y una descripción. El PDF nunca sale del navegador.

| | |
| --- | --- |
| Red | Avalanche Fuji C-Chain (testnet, Chain ID 43113) |
| Contrato | `0x6BDa55000bd3b3C02aA66088870396443Cb0532C` · [ver en Snowtrace](https://testnet.snowtrace.io/address/0x6BDa55000bd3b3C02aA66088870396443Cb0532C) |
| Transacción de ejemplo | [emisión del certificado de demo](https://testnet.snowtrace.io/tx/0xdd6858e08cc9403369e0e3608bf66684b95952120de2e363e9c87b7260df9030) |
| Demo | `PENDIENTE: https://...vercel.app` |

## Cómo funciona

| Función del contrato | Quién la usa | Qué hace |
| --- | --- | --- |
| `emitir(huella, descripcion)` | Institución autorizada | Registra un certificado. No se puede emitir dos veces la misma huella |
| `verificar(huella)` | Cualquiera, gratis | Devuelve si existe, si es válido, quién lo emitió y cuándo |
| `revocar(huella)` | Solo quien lo emitió | Anula un certificado emitido por error |
| `setInstitucion(wallet, nombre)` | Administrador | Autoriza a otra institución a emitir |

Quien despliega el contrato queda como administrador y como primera institución emisora.

## Probar la demo

1. Abre la URL de la demo y sube `demo/certificado-ejemplo.pdf`: aparece **✔ Certificado auténtico**.
2. Sube `demo/certificado-adulterado.pdf`, el mismo certificado con la nota cambiada de 4,8 a 6,8: aparece **✖ No registrado**.
3. Para emitir, conecta la wallet de la institución (Core o MetaMask en Fuji), sube un PDF nuevo, escribe una descripción y presiona **Emitir certificado**.

## Estructura

```
contracts/   Smart contract (Solidity 0.8.28) con Hardhat 3 + viem, pruebas y despliegue Ignition
web/         Aplicación Next.js + wagmi + viem (una sola pantalla)
demo/        PDFs de ejemplo (original y adulterado)
```

## Correrlo localmente

Requisitos: Node.js 22 o superior.

```bash
# Contrato: compilar y correr las 7 pruebas
cd contracts
npm install
npx hardhat test

# Web
cd ../web
npm install
cp .env.example .env.local   # y pega la dirección del contrato
npm run dev                  # http://localhost:3000
```

## Desplegar en Fuji

```bash
cd contracts
npx hardhat keystore set FUJI_PRIVATE_KEY   # escribe aquí la clave de tu wallet DE PRUEBAS (no se ve ni se guarda en el repo)
npm run deploy:fuji                         # imprime la dirección del contrato
npx hardhat verify --network fuji <DIRECCION> "Institución de Demostración CertiBlock"   # opcional: publica el código en Snowtrace
```

## Seguridad

- La clave privada vive solo en el almacén cifrado de Hardhat (`keystore`), nunca en archivos del repositorio.
- La web solo conoce la dirección pública del contrato (`NEXT_PUBLIC_CONTRACT_ADDRESS`).
- Solo instituciones autorizadas emiten; solo el emisor revoca; nadie puede editar ni borrar un certificado.
- El contrato no maneja dinero, así que no hay riesgo de reentrada ni de robo de fondos.

**Limitaciones conocidas (prototipo):** hay un solo administrador; si se pierde su clave, no se pueden autorizar nuevas instituciones. La verificación requiere el archivo exacto: una copia impresa y escaneada genera otra huella. En producción se agregaría un código QR con la huella en el certificado.
