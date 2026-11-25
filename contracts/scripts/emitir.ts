// Emite en Fuji el certificado de un archivo (PDF u otro) usando su huella SHA-256.
// Uso: CONTRACT_ADDRESS=0x... ARCHIVO=ruta/al/certificado.pdf DESCRIPCION="Aprobación IN3863" \
//      npx hardhat run scripts/emitir.ts --network fuji
import { readFile } from "node:fs/promises";
import { network } from "hardhat";
import { sha256 } from "viem";

const address = process.env.CONTRACT_ADDRESS as `0x${string}` | undefined;
const archivo = process.env.ARCHIVO;
const descripcion = process.env.DESCRIPCION ?? "Certificado de prueba CertiBlock";
if (!address || !archivo) throw new Error("Define CONTRACT_ADDRESS y ARCHIVO antes de correr el script");

const huella = sha256(new Uint8Array(await readFile(archivo)));
const { viem } = await network.create();
const publicClient = await viem.getPublicClient();
const c = await viem.getContractAt("CertiBlock", address);

const hash = await c.write.emitir([huella, descripcion]);
await publicClient.waitForTransactionReceipt({ hash });
console.log(`Huella del archivo: ${huella}`);
console.log(`Transacción: https://testnet.snowtrace.io/tx/${hash}`);
