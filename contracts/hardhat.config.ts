import hardhatToolboxViem from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable, defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatToolboxViem],
  solidity: process.env.SOLC_PATH
    ? { version: "0.8.28", path: process.env.SOLC_PATH } // solo para entornos sin internet
    : "0.8.28",
  networks: {
    fuji: {
      type: "http",
      chainType: "l1",
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      // La clave NO se escribe aquí: se guarda con `npx hardhat keystore set FUJI_PRIVATE_KEY`
      accounts: [configVariable("FUJI_PRIVATE_KEY")],
    },
  },
  verify: {
    etherscan: {
      // Snowtrace (Routescan) acepta cualquier texto como API key para la testnet
      apiKey: "snowtrace",
    },
  },
  chainDescriptors: {
    43113: {
      name: "Avalanche Fuji",
      blockExplorers: {
        etherscan: {
          name: "Snowtrace",
          url: "https://testnet.snowtrace.io",
          apiUrl:
            "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan",
        },
      },
    },
  },
});
