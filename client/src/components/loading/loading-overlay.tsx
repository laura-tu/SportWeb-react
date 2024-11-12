import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LoadingOverlayProps {
  height?: string | number; // Option to control height, default is 100vh for full-screen
}

// LoadingOverlay Component
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ height = '100vh' }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={height}
      width="100%"
      position="fixed"
      top={0}
      left={0}
      bgcolor="rgba(255, 255, 255, 0.8)" // Semi-transparent white background
      zIndex={9999} // High z-index to overlay on top of other content
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingOverlay;
