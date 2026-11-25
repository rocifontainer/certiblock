# Instrucciones para el asistente (Claude Code u otro)

Proyecto CertiBlock para el hackathon Avalanche Fuji del curso IN3863. Entrega: 27 de noviembre de 2026.
El usuario no es programador: explica en español simple, con analogías de negocio, y haz tú todo lo que se pueda hacer por comandos.

## Estado

- [x] Contrato `contracts/contracts/CertiBlock.sol` + 7 pruebas pasando (`cd contracts && npx hardhat test`)
- [x] Web `web/` (Next.js + wagmi + viem), `npm run build` OK
- [x] README, PITCH.md, PDFs de demo en `demo/`
- [ ] Desplegar en Fuji, emitir certificado de demo, completar los "PENDIENTE" del README
- [ ] Subir a GitHub (público), publicar en Vercel, probar desde otro dispositivo

## Pasos que faltan (en orden)

1. `cd contracts && npm install && npx hardhat test`
2. **Clave:** pide al usuario que corra él mismo `npx hardhat keystore set FUJI_PRIVATE_KEY` y escriba la clave de su wallet DE PRUEBAS. Nunca pidas, leas ni escribas la clave. Si falta AVAX de prueba: https://faucet.quicknode.com/avalanche/fuji
3. `npm run deploy:fuji` (pedirá la contraseña del keystore: la escribe el usuario). Guarda la dirección.
4. Opcional: `npx hardhat verify --network fuji <DIRECCION> "Institución de Demostración CertiBlock"`
5. `cd ../web && npm install`, crea `.env.local` con `NEXT_PUBLIC_CONTRACT_ADDRESS=<DIRECCION>` y `npm run dev`. El usuario conecta su wallet, sube `demo/certificado-ejemplo.pdf` y lo emite: esa es la transacción para Snowtrace. NO emitas `certificado-adulterado.pdf`.
6. Reemplaza los `PENDIENTE` del README (dirección, tx, URL).
7. Revisa que no haya secretos (`git status`, busca claves de 64 hex) antes de `git init`. Luego `gh repo create certiblock --public --source=. --push` (si no hay `gh`, guía al usuario en github.com).
8. Vercel: importar repo, Root Directory = `web`, variables `NEXT_PUBLIC_CONTRACT_ADDRESS` y `NEXT_PUBLIC_CHAIN_ID=43113`. O `npx vercel --cwd web` si el usuario prefiere la terminal.
9. Probar la URL pública con la wallet y luego con el PDF adulterado.

## Notas técnicas

- Hardhat 3 descarga el compilador 0.8.28 solo. `SOLC_PATH` en `hardhat.config.ts` es solo para entornos sin internet; no hace falta definirla.
- Si se cambia el contrato: `npx hardhat compile` y regenerar `web/lib/abi.ts` desde `contracts/artifacts/contracts/CertiBlock.sol/CertiBlock.json`.
