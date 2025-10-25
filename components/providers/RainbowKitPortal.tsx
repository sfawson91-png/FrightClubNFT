'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';

export default function RainbowKitPortal() {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(document.getElementById('rk-boundary'));
  }, []);

  if (!container) return null;

  return createPortal(
    <RainbowKitProvider theme={lightTheme()} modalSize="compact" showRecentTransactions={false}>
      {/* slot container for wallet UI that will be portaled into the provider */}
      <div id="rk-ui-slot" />
    </RainbowKitProvider>,
    container
  );
}
