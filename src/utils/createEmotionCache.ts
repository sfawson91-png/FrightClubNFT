import createCache from '@emotion/cache';

export default function createEmotionCache() {
  // MUI recommends prepending so it loads first and can be overridden by other styles
  return createCache({ key: 'css', prepend: true });
}