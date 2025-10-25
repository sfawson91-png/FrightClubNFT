# FrightClub Website Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Database
NEXT_PUBLIC_POSTGRES_PRISMA_URL="your_postgres_url"
NEXT_PUBLIC_POSTGRES_URL_NON_POOLING="your_postgres_direct_url"

# Wallet Connect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your_walletconnect_project_id"

# Vercel Blob Storage
NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"

# IPFS Configuration
NEXT_PUBLIC_IPFS_GATEWAY="https://ipfs.io/ipfs/"
NEXT_PUBLIC_IPFS_API_URL="https://ipfs.infura.io:5001"
NEXT_PUBLIC_IPFS_AUTH_HEADER="Basic your_base64_encoded_credentials"

# Alchemy API
NEXT_PUBLIC_ALCHEMY_API_KEY="your_alchemy_api_key"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"

# MongoDB (if using)
MONGODB_URI="your_mongodb_uri"
```

## IPFS Setup

### Option 1: Infura IPFS
1. Sign up for Infura account
2. Create a new IPFS project
3. Get your project ID and secret
4. Set `NEXT_PUBLIC_IPFS_API_URL` to `https://ipfs.infura.io:5001`
5. Set `NEXT_PUBLIC_IPFS_AUTH_HEADER` to `Basic ${base64(projectId:secret)}`

### Option 2: Pinata
1. Sign up for Pinata account
2. Get your API key and secret
3. Set `NEXT_PUBLIC_IPFS_API_URL` to `https://api.pinata.cloud`
4. Update the IPFS client configuration in `lib/ipfs.ts`

### Option 3: Local IPFS Node
1. Install IPFS locally
2. Start IPFS daemon
3. Set `NEXT_PUBLIC_IPFS_API_URL` to `http://localhost:5001`

## Smart Contract Integration

The website is configured to work with your existing FrightClub smart contract:
- Contract Address: `0x46b77a64dCeE752dd4F9e5b26A5273B2e182e57A`
- Network: Ethereum Mainnet (Chain ID: 1)
- Mint Price: 0.02 ETH per NFT
- Max per transaction: 3 NFTs
- Max per wallet: 10 NFTs

## Art Generation Integration

When your art generation completes:

1. **Update IPFS Metadata**: Use the `/api/ipfs/update-metadata` endpoint
2. **Access Art Generation Manager**: Visit `/ArtGeneration` page
3. **Monitor Progress**: Real-time updates on generation status

### API Usage

```javascript
// Update metadata when art generation completes
const response = await fetch('/api/ipfs/update-metadata', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tokenId: 123,
    imageHash: 'QmYourImageHash',
    animationHash: 'QmYourAnimationHash', // optional
    attributes: [ // optional
      { trait_type: 'Background', value: 'Spooky' },
      { trait_type: 'Rarity', value: 'Rare' }
    ]
  })
});
```

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
1. Build the project: `npm run build`
2. Start the production server: `npm start`
3. Configure your hosting platform with the built files

## Performance Optimizations

The website includes several performance optimizations:
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Bundle optimization
- Caching headers
- Mobile-first responsive design

## Features

### ✅ Completed
- Enhanced homepage with modern UI
- Improved minting flow with better error handling
- IPFS integration for metadata updates
- Mobile-responsive design
- Performance optimizations
- Art generation management system

### 🔄 In Progress
- Advanced analytics dashboard
- Community features
- Marketplace integration

## Support

For technical support or questions:
- Email: saulweiloveman@gmail.com
- Twitter: @FrightClub_NFT
- Developer: @saul_loveman (FOAM Softwares)


