module.exports = {
  reactStrictMode: true,
  
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    
    // Tell webpack that this native module doesn't exist in the web bundle.
    config.resolve.alias['@react-native-async-storage/async-storage'] = false;
    
    return config;
  },
  
  // Add experimental features for better WebSocket handling
  experimental: {
    esmExternals: true,
  },
  
  // Configure headers for better WebSocket support
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};