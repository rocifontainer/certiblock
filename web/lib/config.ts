import { createConfig, http } from "wagmi";
import { avalancheFuji } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const fuji = avalancheFuji; // Chain ID 43113

export const wagmiConfig = createConfig({
  chains: [fuji],
  connectors: [injected()], // Core, MetaMask u otra wallet del navegador
  transports: {
    [fuji.id]: http("https://api.avax-test.network/ext/bc/C/rpc"),
  },
  ssr: true,
});

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as
  | `0x${string}`
  | undefined;

export const SNOWTRACE = "https://testnet.snowtrace.io";
