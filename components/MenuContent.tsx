import React from 'react';
import Link from 'next/link';

export default function MenuContent({ onClose }: { onClose?: () => void }) {
  const handleClick = (cb?: () => void) => () => cb && cb();

  return (
    <nav style={{ padding: 16, minWidth: 180 }} aria-label="Site menu">
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <li>
          <Link href="/" onClick={handleClick(onClose)}>Home</Link>
        </li>
        <li>
          <Link href="/Mint" onClick={handleClick(onClose)}>Mint</Link>
        </li>
        <li>
          <Link href="/FAQ" onClick={handleClick(onClose)}>FAQ</Link>
        </li>
        <li>
          <Link href="/UserPortal" onClick={handleClick(onClose)}>User Portal</Link>
        </li>
        <li>
          <Link href="/WalletConfirmation" onClick={handleClick(onClose)}>Wallet Confirmation</Link>
        </li>
      </ul>
    </nav>
  );
}
