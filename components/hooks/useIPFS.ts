import { useState, useCallback } from 'react';
import { uploadImageToIPFS, uploadMetadataToIPFS, getIPFSUrl } from '../../lib/ipfs';
import { NFTMetadata } from '../../lib/ipfs';

interface IPFSUploadResult {
  hash: string;
  url: string;
}

interface UseIPFSReturn {
  uploadImage: (file: File | Blob) => Promise<IPFSUploadResult>;
  uploadMetadata: (metadata: NFTMetadata) => Promise<IPFSUploadResult>;
  updateNFTMetadata: (tokenId: number, imageHash: string, animationHash?: string, attributes?: Array<{ trait_type: string; value: string | number }>) => Promise<IPFSUploadResult>;
  isUploading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useIPFS = (): UseIPFSReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const uploadImage = useCallback(async (file: File | Blob): Promise<IPFSUploadResult> => {
    setIsUploading(true);
    setError(null);

    try {
      const hash = await uploadImageToIPFS(file);
      const url = getIPFSUrl(hash);
      
      return { hash, url };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadMetadata = useCallback(async (metadata: NFTMetadata): Promise<IPFSUploadResult> => {
    setIsUploading(true);
    setError(null);

    try {
      const hash = await uploadMetadataToIPFS(metadata);
      const url = getIPFSUrl(hash);
      
      return { hash, url };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload metadata';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const updateNFTMetadata = useCallback(async (
    tokenId: number, 
    imageHash: string, 
    animationHash?: string, 
    attributes?: Array<{ trait_type: string; value: string | number }>
  ): Promise<IPFSUploadResult> => {
    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch('/api/ipfs/update-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenId,
          imageHash,
          animationHash,
          attributes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update metadata');
      }

      const result = await response.json();
      
      return {
        hash: result.metadataHash,
        url: result.metadataUrl,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update NFT metadata';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    uploadImage,
    uploadMetadata,
    updateNFTMetadata,
    isUploading,
    error,
    clearError,
  };
};


