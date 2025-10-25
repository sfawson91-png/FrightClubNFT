// lib/wagmi.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

// IMPORTANT: ensure this env var exists in .env.local, e.g. NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=xxxxxxxxxx
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;
if (!projectId) {
  // This helps catch it early during SSR
  console.warn('⚠️ NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is missing. RainbowKit/Wagmi may fail.');
}

export const wagmiConfig = getDefaultConfig({
  appName: 'Fright Club',
  projectId,
  chains: [sepolia, mainnet],
  ssr: true,
  // Explicit transports keep things stable across hosts (optional but recommended)
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});