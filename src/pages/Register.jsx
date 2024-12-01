import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Link,
  CircularProgress
} from '@mui/material'
import { GitHub } from '@mui/icons-material'
import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import useStore from '../store/store'

const Register = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box 
        sx={{ 
          maxWidth: '308px',
          mx: 'auto',
          textAlign: 'center'
        }}
      >
        <GitHub sx={{ fontSize: 48, mb: 4 }} />
        <Typography variant="h5" gutterBottom>
          Registrations Disabled
        </Typography>
        <Typography color="text.secondary" paragraph>
          New registrations are currently disabled.
        </Typography>
        <Button
          component={RouterLink}
          to="/login"
          variant="contained"
          fullWidth
          sx={{ 
            mt: 2,
            bgcolor: '#58a6ff',
            '&:hover': { 
              bgcolor: 'rgba(56,139,253,0.85)'
            }
          }}
        >
          Return to Login
        </Button>
      </Box>
    </Container>
  );
};

export default Register 