import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '200px'
      }}
    >
      <CircularProgress 
        sx={{ 
          color: '#58a6ff'  // GitHub tema rengi
        }} 
      />
    </Box>
  );
};

export default LoadingSpinner; 