'use client';

import React from 'react';
import { Box, Skeleton } from '@mui/material';

interface LoadingSkeletonProps {
  height?: number | string;
  width?: number | string;
  variant?: 'text' | 'rectangular' | 'rounded' | 'circular';
}

export default function LoadingSkeleton({ 
  height = '100%', 
  width = '100%',
  variant = 'rectangular'
}: LoadingSkeletonProps) {
  return (
    <Box sx={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Skeleton 
        variant={variant}
        width={typeof width === 'number' ? width : '100%'}
        height={typeof height === 'number' ? height : '100%'}
        animation="wave"
      />
    </Box>
  );
}