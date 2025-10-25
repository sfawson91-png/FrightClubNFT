'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { PropsWithChildren, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from '../../lib/wagmi';

export default function WalletProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      {/* Stable server-rendered target for optional portalized UI */}
      <div id="rk-boundary" suppressHydrationWarning />
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            modalSize="compact"
            theme={lightTheme()}
            appInfo={{ appName: 'FrightClub', disclaimer: null }}
          >
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}
