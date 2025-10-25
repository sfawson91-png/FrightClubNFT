import { create, IPFSHTTPClient } from 'ipfs-http-client';

// IPFS configuration
const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
const IPFS_API_URL = process.env.NEXT_PUBLIC_IPFS_API_URL || 'https://ipfs.infura.io:5001';

// Create IPFS client
let ipfs: IPFSHTTPClient | null = null;

const getIPFSClient = (): IPFSHTTPClient => {
  if (!ipfs) {
    ipfs = create({
      url: IPFS_API_URL,
      headers: {
        authorization: process.env.NEXT_PUBLIC_IPFS_AUTH_HEADER || '',
      },
    });
  }
  return ipfs;
};

// Interface for NFT metadata
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  animation_url?: string;
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

// Upload metadata to IPFS
export const uploadMetadataToIPFS = async (metadata: NFTMetadata): Promise<string> => {
  try {
    const client = getIPFSClient();
    const metadataJSON = JSON.stringify(metadata, null, 2);
    
    const result = await client.add(metadataJSON, {
      pin: true, // Pin the content to ensure it stays available
    });
    
    const ipfsHash = result.path;
    console.log('Metadata uploaded to IPFS:', ipfsHash);
    
    return ipfsHash;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
};

// Upload image to IPFS
export const uploadImageToIPFS = async (imageFile: File | Blob): Promise<string> => {
  try {
    const client = getIPFSClient();
    
    const result = await client.add(imageFile, {
      pin: true,
    });
    
    const ipfsHash = result.path;
    console.log('Image uploaded to IPFS:', ipfsHash);
    
    return ipfsHash;
  } catch (error) {
    console.error('Error uploading image to IPFS:', error);
    throw new Error('Failed to upload image to IPFS');
  }
};

// Get IPFS URL from hash
export const getIPFSUrl = (hash: string): string => {
  return `${IPFS_GATEWAY}${hash}`;
};

// Pin content to IPFS (ensure it stays available)
export const pinToIPFS = async (hash: string): Promise<boolean> => {
  try {
    const client = getIPFSClient();
    await client.pin.add(hash);
    return true;
  } catch (error) {
    console.error('Error pinning to IPFS:', error);
    return false;
  }
};

// Check if content is pinned
export const isPinned = async (hash: string): Promise<boolean> => {
  try {
    const client = getIPFSClient();
    const pins = client.pin.ls();

    for await (const pin of pins) {
      if (pin.cid.toString() === hash) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking pin status:', error);
    return false;
  }
};

// Batch upload multiple metadata files
export const batchUploadMetadata = async (metadataArray: NFTMetadata[]): Promise<string[]> => {
  const hashes: string[] = [];
  
  for (const metadata of metadataArray) {
    try {
      const hash = await uploadMetadataToIPFS(metadata);
      hashes.push(hash);
    } catch (error) {
      console.error('Error uploading metadata:', error);
      throw error;
    }
  }
  
  return hashes;
};

// Create metadata for FrightClub NFT
export const createFrightClubMetadata = (
  tokenId: number,
  imageHash: string,
  animationHash?: string,
  attributes?: Array<{ trait_type: string; value: string | number }>
): NFTMetadata => {
  return {
    name: `Fright Club #${tokenId}`,
    description: "3131 animated monsters ready for fun at the Fright Club. Each unique character brings their own spooky charm to the collection.",
    image: getIPFSUrl(imageHash),
    animation_url: animationHash ? getIPFSUrl(animationHash) : undefined,
    external_url: "https://frightclub.com",
    attributes: attributes || [
      { trait_type: "Collection", value: "Fright Club" },
      { trait_type: "Rarity", value: "Unique" }
    ]
  };
};
