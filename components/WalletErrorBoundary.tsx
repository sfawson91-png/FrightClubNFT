'use client';

import React, { useEffect, useState } from 'react';
import { Box, Alert, Button } from '@mui/material';
import LoadingSkeleton from './util/LoadingSkeleton';

interface StorageState {
  dismissed: boolean;
  ready: boolean;
}

export function WalletErrorBoundary({ children }: { children: React.ReactNode }) {
  // Stable state with ready flag
  const [state, setState] = useState<StorageState>({ 
    dismissed: false,
    ready: false
  });

  useEffect(() => {
    try {
      const v = localStorage.getItem("wallet_error_dismissed");
      setState({ dismissed: v === "1", ready: true });
    } catch {
      setState(prev => ({ ...prev, ready: true }));
    }

    const clearWalletConnectStorage = () => {
      try {
        // Clear all WalletConnect related storage
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('walletconnect') || key.includes('@walletconnect'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Clear session storage as well
        const sessionKeysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && (key.includes('walletconnect') || key.includes('@walletconnect'))) {
            sessionKeysToRemove.push(key);
          }
        }
        sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
        
        console.log('WalletConnect storage cleared');
      } catch (error) {
        console.warn('Failed to clear wallet storage:', error);
      }
    };

    const handleConnectionError = (event: any) => {
      console.log('Wallet connection error:', event);
      // Clear problematic storage for any WalletConnect related errors
      if (event?.error?.message?.includes('WalletConnect') || 
          event?.error?.message?.includes('Connection interrupted') ||
          event?.error?.message?.includes('WebSocket') ||
          event?.error?.message?.includes('JWT')) {
        clearWalletConnectStorage();
      }
    };

    const handleUnhandledRejection = (event: any) => {
      if (event.reason?.message?.includes('WalletConnect') || 
          event.reason?.message?.includes('Connection interrupted') ||
          event.reason?.message?.includes('WebSocket') ||
          event.reason?.message?.includes('JWT')) {
        console.log('WalletConnect promise rejection:', event.reason);
        clearWalletConnectStorage();
      }
    };

    // Clear storage on component mount
    clearWalletConnectStorage();

    // Move event listeners to useEffect to avoid render-time side effects
    const handleError = (event: any) => handleConnectionError(event);
    const handleRejection = (event: any) => handleUnhandledRejection(event);

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  // Render a stable shell while loading
  if (!state.ready) {
    return (
      <Box sx={{ mb: 2 }}>
        <LoadingSkeleton height={48} />
        {children}
      </Box>
    );
  }

  return (
    <>
      {!state.dismissed && (
        <Alert 
          severity="warning" 
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                setState(prev => ({ ...prev, dismissed: true }));
                try { localStorage.setItem("wallet_error_dismissed", "1"); } catch {}
              }}
            >
              Dismiss
            </Button>
          }
        >
          Having wallet issues? Try refreshing or reconnecting.
        </Alert>
      )}
      {children}
    </>
  );
}
