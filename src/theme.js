import { createTheme } from '@mui/material'

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body': {
          backgroundColor: '#0d1117',
          color: '#c9d1d9',
          margin: 0,
          padding: 0,
          height: '100%',
          width: '100%'
        },
        '#root': {
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        position: 'fixed'
      },
      styleOverrides: {
        root: {
          backgroundColor: '#010409',
          borderBottom: '1px solid #30363d',
          height: '62px',
          position: 'sticky',
          top: 0,
          zIndex: 1100
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '62px !important',
          padding: '0 32px !important'
        }
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: '24px'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '14px',
          borderRadius: '6px',
          padding: '5px 16px',
          border: '1px solid rgba(240,246,252,0.1)',
          '&:hover': {
            backgroundColor: 'rgba(177,186,196,0.12)'
          }
        },
        contained: {
          backgroundColor: '#238636',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#2ea043'
          }
        },
        outlined: {
          borderColor: '#30363d',
          '&:hover': {
            borderColor: '#8b949e',
            backgroundColor: 'transparent'
          }
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#0d1117',
          border: '1px solid #30363d',
          borderRadius: '6px',
          color: '#c9d1d9',
          '&:hover': {
            borderColor: '#8b949e'
          },
          '& input': {
            padding: '5px 12px',
            fontSize: '14px',
            lineHeight: '20px',
            color: '#c9d1d9'
          },
          '& input::placeholder': {
            color: '#6e7681'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#0d1117',
          border: '1px solid #30363d',
          borderRadius: '6px',
          '&:hover': {
            borderColor: '#8b949e'
          }
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#21262d'
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#58a6ff',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline'
          }
        }
      }
    }
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#238636'
    },
    background: {
      default: '#0d1117',
      paper: '#0d1117'
    },
    text: {
      primary: '#c9d1d9',
      secondary: '#8b949e'
    }
  },
  typography: {
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
    h1: { fontSize: '2rem', fontWeight: 600 },
    h2: { fontSize: '1.5rem', fontWeight: 600 },
    h3: { fontSize: '1.25rem', fontWeight: 600 },
    h4: { fontSize: '1rem', fontWeight: 600 },
    body1: { fontSize: '14px' },
    body2: { fontSize: '12px' }
  }
})

export default theme 