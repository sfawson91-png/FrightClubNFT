'use client';
import * as React from 'react';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';

export default function RainbowKitPortal({ children }: { children?: React.ReactNode }) {
  return (
    <RainbowKitProvider
      theme={darkTheme({
        accentColor: '#8c0017',
        accentColorForeground: 'white',
        borderRadius: 'large',
        fontStack: 'rounded',
        overlayBlur: 'small',
      })}
      modalSize="compact"
      showRecentTransactions={false}
    >
      {children}
    </RainbowKitProvider>
  );
}