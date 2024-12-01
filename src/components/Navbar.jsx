import { 
  AppBar, 
  Box, 
  Toolbar, 
  Button, 
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  InputBase,
  Divider,
  TextField
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useState } from 'react'
import useStore from '../store/store'

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Robot head background */}
    <rect width="32" height="32" rx="8" fill="#21262d"/>
    
    {/* Robot face */}
    <rect x="8" y="12" width="16" height="14" rx="2" fill="#58a6ff"/>
    
    {/* Robot antennas */}
    <path d="M13 8L13 12" stroke="#58a6ff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M19 8L19 12" stroke="#58a6ff" strokeWidth="2" strokeLinecap="round"/>
    
    {/* Robot eyes */}
    <circle cx="12" cy="18" r="2" fill="#0d1117"/>
    <circle cx="20" cy="18" r="2" fill="#0d1117"/>
    
    {/* Robot mouth */}
    <path d="M11 22H21" stroke="#0d1117" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const { user, logout } = useStore()

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar>
      <Toolbar sx={{ minHeight: '62px !important' }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <RouterLink to="/">
            <IconButton color="inherit" sx={{ p: 0 }}>
              <Logo />
            </IconButton>
          </RouterLink>

          <TextField
            size="small"
            placeholder="Search..."
            variant="outlined"
            sx={{
              width: '300px',
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#0d1117',
                borderColor: '#30363d',
                color: '#c9d1d9',
                '&:hover': {
                  borderColor: '#6e7681'
                },
                '&.Mui-focused': {
                  borderColor: '#58a6ff',
                  boxShadow: '0 0 0 2px rgba(88, 166, 255, 0.2)'
                }
              },
              '& .MuiOutlinedInput-input': {
                '&::placeholder': {
                  color: '#6e7681',
                  opacity: 1
                }
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#30363d'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6e7681'
              },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#58a6ff'
              }
            }}
          />
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
          <Button 
            color="inherit"
            component={RouterLink}
            to="/topics"
            sx={{ 
              fontSize: 14, 
              fontWeight: 600,
              color: '#fff',
              bgcolor: '#58a6ff',
              '&:hover': { 
                bgcolor: 'rgba(56,139,253,0.85)',
                color: '#fff' 
              }
            }}
          >
            Explore
          </Button>

          {user ? (
            <>
              <IconButton
                onClick={handleMenu}
                sx={{ p: 0 }}
              >
                <Avatar
                  src={user.avatarUrl}
                  alt={user.username}
                  sx={{ width: 20, height: 20 }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 180,
                    boxShadow: '0 8px 24px rgba(140,149,159,0.2)'
                  }
                }}
              >
                <MenuItem 
                  dense
                  sx={{ py: 1 }}
                >
                  Signed in as <strong style={{ marginLeft: 4 }}>{user.username}</strong>
                </MenuItem>
                <Divider />
                <MenuItem 
                  component={RouterLink} 
                  to={`/user/${user.username}`}
                  onClick={handleClose}
                  sx={{ py: 1 }}
                >
                  Your profile
                </MenuItem>
                <MenuItem 
                  component={RouterLink} 
                  to="/new"
                  onClick={handleClose}
                  sx={{ py: 1 }}
                >
                  New repository
                </MenuItem>
                <Divider />
                <MenuItem 
                  onClick={() => {
                    handleClose()
                    logout()
                  }}
                  sx={{ py: 1 }}
                >
                  Sign out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{ 
                  fontSize: 14,
                  color: '#fff',
                  '&:hover': { color: '#c9d1d9' }
                }}
              >
                Sign in
              </Button>
              <Button
                variant="contained"
                component={RouterLink}
                to="/register"
                sx={{
                  bgcolor: '#238636',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: '#2ea043'
                  }
                }}
              >
                Sign up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar 