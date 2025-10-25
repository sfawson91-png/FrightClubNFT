import type { AppProps } from 'next/app';
import Head from 'next/head';

import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css';

import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { wagmiConfig } from '@/lib/wagmi';
import RainbowKitPortal from '@/components/Wallet/RainbowKitPortal';
import AppMenu from '../components/Header';

const clientEmotionCache = createCache({ key: 'css', prepend: true });
const theme = createTheme();
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 3, staleTime: 5 * 60 * 1000 } },
});

type MyAppProps = AppProps & { emotionCache?: ReturnType<typeof createCache> };

export default function MyApp({ Component, pageProps, emotionCache = clientEmotionCache }: MyAppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitPortal>
                <AppMenu />
                <Component {...pageProps} />
              </RainbowKitPortal>
            </QueryClientProvider>
          </WagmiProvider>
        </ThemeProvider>
      </CacheProvider>
    </>
  );
}