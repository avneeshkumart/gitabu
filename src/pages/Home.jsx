import { Container, Grid, Box, Typography, Button, Stack, Link } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import useStore from '../store/store';
import RepositoryCard from '../components/RepositoryCard';

const Home = () => {
  const repositories = useStore(state => state.repositories);
  const user = useStore(state => state.user);

  // En çok yıldız alan repolar
  const trendingRepos = [...repositories]
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 3);

  // Son eklenen repolar
  const recentRepos = [...repositories]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Sol Kolon */}
        <Grid item xs={12} md={8}>
          {/* Trending Repositories */}
          <Box mb={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TrendingUp sx={{ mr: 1 }} />
              <Typography variant="h5">Trending Repositories</Typography>
            </Box>
            <Stack spacing={2}>
              {trendingRepos.map(repo => (
                <Box 
                  key={repo._id} 
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    p: 3
                  }}
                >
                  <RepositoryCard repository={repo} />
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Recent Activity */}
          <Box>
            <Typography variant="h5" gutterBottom>
              Recent Activity
            </Typography>
            <Stack spacing={2}>
              {recentRepos.map(repo => (
                <Box 
                  key={repo._id}
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    p: 3
                  }}
                >
                  <RepositoryCard repository={repo} />
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>

        {/* Sağ Kolon */}
        <Grid item xs={12} md={4}>
          {/* Discover Repositories */}
          <Box sx={{ 
            bgcolor: '#0d1117', 
            border: '1px solid #30363d',
            borderRadius: 1,
            p: 3 
          }}>
            <Typography variant="h6" gutterBottom>
              Discover Repositories
            </Typography>
            <Typography color="text.secondary" paragraph>
              Explore interesting projects and developers
            </Typography>
            <Button
              variant="contained"
              fullWidth
              component={RouterLink}
              to="/topics"
              sx={{ 
                bgcolor: '#58a6ff',
                '&:hover': { 
                  bgcolor: 'rgba(56,139,253,0.85)'
                }
              }}
            >
              Explore Topics
            </Button>
          </Box>

          {!user && (
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
              <Typography variant="h6" gutterBottom>
                Create Your Repository
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Sign up to create your own repository and contribute to others.
              </Typography>
              <Stack spacing={1}>
                <Button 
                  component={RouterLink}
                  to="/register"
                  variant="contained" 
                  fullWidth
                >
                  Sign Up
                </Button>
                <Button 
                  component={RouterLink}
                  to="/login"
                  variant="outlined" 
                  fullWidth
                >
                  Sign In
                </Button>
              </Stack>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 