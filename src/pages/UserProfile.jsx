import {
  Container,
  Grid,
  Box,
  Typography,
  Avatar,
  Stack,
  Link,
  Button,
  IconButton,
  TextField,
  Card,
  CardContent
} from '@mui/material'
import { LocationOn, AccessTime, Language } from '@mui/icons-material'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useStore from '../store/store'
import { api } from '../services/api'
import RepositoryCard from '../components/RepositoryCard'

const UserProfile = () => {
  const { username } = useParams()
  const repositories = useStore(state => state.repositories)
  const currentUser = useStore(state => state.user)
  const [user, setUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({
    location: '',
    website: ''
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get(`/users/${username}`)
        setUser(data)
        setEditData({
          location: data.location || '',
          website: data.website || ''
        })
      } catch (err) {
        console.error('Failed to fetch user:', err)
      }
    }
    fetchUser()
  }, [username])

  const handleSave = async () => {
    try {
      const { data } = await api.patch('/users/me', editData)
      setUser(data)
      setEditing(false)
    } catch (err) {
      console.error('Failed to update profile:', err)
    }
  }

  const userRepositories = repositories.filter(repo => 
    repo.owner.username === username
  )

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Sol Kolon - Profil */}
        <Grid item xs={12} md={3}>
          <Stack spacing={3}>
            {/* Avatar ve Username */}
            <Box>
              <Avatar
                src={user?.avatarUrl}
                alt={user?.username}
                sx={{ width: 296, height: 296, mb: 2 }}
              />
              <Typography variant="h4" gutterBottom>
                {user?.username}
              </Typography>
            </Box>

            {/* Sadece bu üç bilgiyi göster */}
            <Stack spacing={2}>
              {user?.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ color: '#7d8590', fontSize: 20 }} />
                  <Typography color="text.secondary">
                    {user.location}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime sx={{ color: '#7d8590', fontSize: 20 }} />
                <Typography color="text.secondary">
                  Joined {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Typography>
              </Box>

              {user?.website && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Language sx={{ color: '#7d8590', fontSize: 20 }} />
                  <Link href={user.website} target="_blank" rel="noopener noreferrer">
                    {user.website}
                  </Link>
                </Box>
              )}
            </Stack>

            {/* Achievements */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: '#7d8590' }}>
                Achievements
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                flexWrap: 'wrap',
                p: 2,
                bgcolor: 'rgba(110,118,129,0.1)',
                borderRadius: 1
              }}>
                <Box sx={{ 
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  bgcolor: '#58a6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography sx={{ color: '#fff', fontSize: 20 }}>β</Typography>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Grid>

        {/* Sağ Kolon - Repository'ler */}
        <Grid item xs={12} md={9}>
          <Typography variant="h5" gutterBottom>
            Repositories
          </Typography>
          <Grid container spacing={3}>
            {userRepositories.map(repo => (
              <Grid item xs={12} md={6} key={repo._id}>
                <Box 
                  sx={{ 
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    p: 3
                  }}
                >
                  <RepositoryCard repository={repo} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}

export default UserProfile