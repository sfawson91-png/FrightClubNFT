'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function WalletSlot() {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <ConnectButton chainStatus="icon" showBalance={false} />
    </div>
  );
}