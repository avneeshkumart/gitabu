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

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const login = useStore(state => state.login)
  const loading = useStore(state => state.loading)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!username || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      await login({ username, password })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box 
        sx={{ 
          maxWidth: '308px',
          mx: 'auto',
          textAlign: 'center'
        }}
      >
        <GitHub sx={{ fontSize: 48, mb: 4 }} />
        <Typography variant="h5" gutterBottom>
          Sign in to GitHub
        </Typography>

        <Box 
          sx={{ 
            mt: 3,
            p: 3, 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper',
          }}
        >
          {error && (
            <Alert 
              severity="error" 
              onClose={() => setError('')}
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                required
                size="small"
                disabled={loading}
                error={!!error}
                autoComplete="username"
                inputProps={{
                  autoComplete: 'username'
                }}
              />

              <TextField
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                size="small"
                disabled={loading}
                error={!!error}
                autoComplete="current-password"
                inputProps={{
                  autoComplete: 'current-password'
                }}
              />

              <Button 
                type="submit" 
                variant="contained" 
                fullWidth
                disabled={loading}
                sx={{
                  bgcolor: '#238636',
                  '&:hover': {
                    bgcolor: '#2ea043'
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign in'
                )}
              </Button>
            </Stack>
          </form>
        </Box>

        <Box 
          sx={{ 
            mt: 3,
            p: 3, 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper',
          }}
        >
          <Typography>
            New to GitHub?{' '}
            <Link 
              component={RouterLink} 
              to="/register"
              sx={{ 
                color: '#58a6ff',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Create an account
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}

export default Login 