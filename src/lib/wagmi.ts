// src/lib/wagmi.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';
import { http, cookieStorage, createStorage } from 'wagmi';

export const wagmiConfig = getDefaultConfig({
  appName: 'FrightClub',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  ssr: true,
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
    [mainnet.id]: http(process.env.NEXT_PUBLIC_MAINNET_RPC_URL),
  },
  storage: createStorage({ storage: cookieStorage }),
});

export default wagmiConfig; // also default-export for flexibility