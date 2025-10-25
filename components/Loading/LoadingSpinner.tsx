import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import styled from '@emotion/styled';

const LoadingContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
});

const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "Loading..." }) => {
  return (
    <Fade in>
      <LoadingContainer>
        <CircularProgress 
          size={60} 
          thickness={4}
          sx={{ 
            color: '#B31414',
            mb: 2 
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'white',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
          }}
        >
          {message}
        </Typography>
      </LoadingContainer>
    </Fade>
  );
};

export default LoadingSpinner;
