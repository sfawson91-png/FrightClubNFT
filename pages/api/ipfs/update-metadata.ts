import { NextApiRequest, NextApiResponse } from 'next';
import { uploadMetadataToIPFS, createFrightClubMetadata, pinToIPFS } from '../../../lib/ipfs';

interface UpdateMetadataRequest {
  tokenId: number;
  imageHash: string;
  animationHash?: string;
  attributes?: Array<{ trait_type: string; value: string | number }>;
}

interface UpdateMetadataResponse {
  success: boolean;
  metadataHash?: string;
  metadataUrl?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateMetadataResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { tokenId, imageHash, animationHash, attributes }: UpdateMetadataRequest = req.body;

    // Validate required fields
    if (!tokenId || !imageHash) {
      return res.status(400).json({
        success: false,
        error: 'tokenId and imageHash are required'
      });
    }

    // Create metadata object
    const metadata = createFrightClubMetadata(
      tokenId,
      imageHash,
      animationHash,
      attributes
    );

    // Upload metadata to IPFS
    const metadataHash = await uploadMetadataToIPFS(metadata);
    
    // Pin the metadata to ensure it stays available
    await pinToIPFS(metadataHash);

    const metadataUrl = `https://ipfs.io/ipfs/${metadataHash}`;

    console.log(`Metadata updated for token ${tokenId}:`, metadataUrl);

    return res.status(200).json({
      success: true,
      metadataHash,
      metadataUrl
    });

  } catch (error) {
    console.error('Error updating metadata:', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}


