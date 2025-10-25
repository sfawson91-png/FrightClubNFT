import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  LinearProgress,
  Alert,
  Grid,
  Chip,
  CircularProgress,
} from '@mui/material';
import styled from '@emotion/styled';
import { useIPFS } from '../hooks/useIPFS';
import { NFTMetadata } from '../../lib/ipfs';

const StyledCard = styled(Card)({
  maxWidth: 600,
  margin: '0 auto',
  padding: 20,
  textAlign: 'center',
  borderRadius: 25,
  marginTop: '50px',
  backgroundColor: 'rgba(255, 255, 255, 0.4)',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
});

interface ArtGenerationStatus {
  tokenId: number;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  imageHash?: string;
  animationHash?: string;
  metadataHash?: string;
  error?: string;
  progress?: number;
}

interface ArtGenerationManagerProps {
  onMetadataUpdated?: (tokenId: number, metadataHash: string) => void;
}

// simple deterministic hash → 0..1
function seededRandom(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return ((h >>> 0) % 100000) / 100000;
}

const ArtGenerationManager: React.FC<ArtGenerationManagerProps> = ({ onMetadataUpdated }) => {
  const { updateNFTMetadata, isUploading, error, clearError } = useIPFS();
  const [generations, setGenerations] = useState<ArtGenerationStatus[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  
  // Use a stable seed for deterministic randomness
  const seed = "art-generation-seed";
  const rnd = useMemo(() => seededRandom(seed), [seed]);

  // Simulate art generation process
  const startArtGeneration = async (tokenId: number) => {
    const newGeneration: ArtGenerationStatus = {
      tokenId,
      status: 'pending',
      progress: 0,
    };

    setGenerations(prev => [...prev, newGeneration]);

    // Simulate generation process
    setTimeout(() => {
      setGenerations(prev => 
        prev.map(gen => 
          gen.tokenId === tokenId 
            ? { ...gen, status: 'generating', progress: 25 }
            : gen
        )
      );
    }, 1000);

    setTimeout(() => {
      setGenerations(prev => 
        prev.map(gen => 
          gen.tokenId === tokenId 
            ? { ...gen, progress: 50 }
            : gen
        )
      );
    }, 2000);

    setTimeout(() => {
      setGenerations(prev => 
        prev.map(gen => 
          gen.tokenId === tokenId 
            ? { ...gen, progress: 75 }
            : gen
        )
      );
    }, 3000);

    // Complete generation
    setTimeout(async () => {
      try {
        // Simulate getting generated art hashes
        const imageHash = `QmGeneratedImage${tokenId}${Date.now()}`;
        const animationHash = `QmGeneratedAnimation${tokenId}${Date.now()}`;

        // Update metadata on IPFS
        const result = await updateNFTMetadata(tokenId, imageHash, animationHash);
        
        setGenerations(prev => 
          prev.map(gen => 
            gen.tokenId === tokenId 
              ? { 
                  ...gen, 
                  status: 'completed', 
                  progress: 100,
                  imageHash,
                  animationHash,
                  metadataHash: result.hash
                }
              : gen
          )
        );

        // Notify parent component
        if (onMetadataUpdated) {
          onMetadataUpdated(tokenId, result.hash);
        }

      } catch (err) {
        setGenerations(prev => 
          prev.map(gen => 
            gen.tokenId === tokenId 
              ? { 
                  ...gen, 
                  status: 'failed', 
                  error: err instanceof Error ? err.message : 'Generation failed'
                }
              : gen
          )
        );
      }
    }, 4000);
  };

  const getStatusColor = (status: ArtGenerationStatus['status']) => {
    switch (status) {
      case 'pending': return 'default';
      case 'generating': return 'primary';
      case 'completed': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: ArtGenerationStatus['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'generating': return 'Generating';
      case 'completed': return 'Completed';
      case 'failed': return 'Failed';
      default: return 'Unknown';
    }
  };

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          🎨 Art Generation Manager
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Manage art generation and IPFS metadata updates for your FrightClub NFTs
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            onClick={() => startArtGeneration(Math.floor(rnd * 1000) + 1)}
            disabled={isUploading}
            sx={{
              backgroundColor: '#B31414',
              '&:hover': {
                backgroundColor: '#9F1111',
              },
            }}
          >
            {isUploading ? 'Processing...' : 'Start Art Generation'}
          </Button>
        </Box>

        {generations.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Generation Status
            </Typography>
            
            <Grid container spacing={2}>
              {generations.map((generation) => (
                <Grid item xs={12} key={generation.tokenId}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1">
                          Token #{generation.tokenId}
                        </Typography>
                        <Chip
                          label={getStatusText(generation.status)}
                          color={getStatusColor(generation.status)}
                          size="small"
                        />
                      </Box>

                      {generation.status === 'generating' && (
                        <Box sx={{ mb: 2 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={generation.progress || 0} 
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="caption">
                            {generation.progress}% Complete
                          </Typography>
                        </Box>
                      )}

                      {generation.status === 'completed' && (
                        <Box>
                          <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
                            ✅ Art generation completed successfully!
                          </Typography>
                          <Typography variant="caption" display="block">
                            Image Hash: {generation.imageHash}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Metadata Hash: {generation.metadataHash}
                          </Typography>
                        </Box>
                      )}

                      {generation.status === 'failed' && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                          {generation.error}
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {isUploading && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography variant="body2">
              Updating IPFS metadata...
            </Typography>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default ArtGenerationManager;
