import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { useState } from 'react'
import useStore from '../store/store'
import { CloudUpload } from '@mui/icons-material'

const Settings = () => {
  const user = useStore(state => state.user)
  const updateAvatar = useStore(state => state.updateAvatar)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const [formData, setFormData] = useState({
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    avatarUrl: user?.avatarUrl || ''
  })

  const handleAvatarChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError('Image size should be less than 4MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      setAvatarFile(file)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result }))
        setPreviewOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (avatarFile) {
        const reader = new FileReader()
        reader.onloadend = async () => {
          try {
            await updateAvatar(user.username, reader.result)
            setSuccess('Profile updated successfully')
          } catch (error) {
            setError('Failed to update avatar')
          } finally {
            setLoading(false)
          }
        }
        reader.readAsDataURL(avatarFile)
      }

      // Diğer profil bilgilerini güncelle
      const updatedUsers = useStore.getState().users.map(u => {
        if (u.username === user.username) {
          return {
            ...u,
            bio: formData.bio,
            location: formData.location,
            website: formData.website
          }
        }
        return u
      })
      
      await useStore.getState().updateUsers(updatedUsers)
      setSuccess('Profile updated successfully')
    } catch (err) {
      console.error('Profile update error:', err)
      setError(err.message || 'An error occurred while updating profile')
    } finally {
      setLoading(false)
    }
  }

  const handleClosePreview = () => {
    setPreviewOpen(false)
  }

  const handleConfirmAvatar = () => {
    setPreviewOpen(false)
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        {/* Avatar Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Profile Picture
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={formData.avatarUrl}
              alt={user?.username}
              sx={{ width: 100, height: 100 }}
            />
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUpload />}
              sx={{ 
                bgcolor: '#58a6ff',
                '&:hover': { 
                  bgcolor: 'rgba(56,139,253,0.85)'
                }
              }}
            >
              Change Avatar
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
                aria-label="Upload avatar"
              />
            </Button>
          </Box>
        </Box>

        {/* Avatar Preview Dialog */}
        <Dialog 
          open={previewOpen} 
          onClose={handleClosePreview}
          aria-labelledby="avatar-preview-dialog"
        >
          <DialogTitle id="avatar-preview-dialog">Preview Avatar</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Avatar
                src={formData.avatarUrl}
                alt="Avatar preview"
                sx={{ width: 200, height: 200 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePreview}>Cancel</Button>
            <Button onClick={handleConfirmAvatar} variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bio */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Bio
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Write a short bio about yourself"
            aria-label="Bio"
          />
        </Box>

        {/* Location */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Location
          </Typography>
          <TextField
            fullWidth
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Add your location"
            aria-label="Location"
          />
        </Box>

        {/* Website */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Website
          </Typography>
          <TextField
            fullWidth
            value={formData.website}
            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
            placeholder="Add your website URL"
            aria-label="Website"
          />
        </Box>

        {/* Error & Success Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ 
            bgcolor: '#58a6ff',
            '&:hover': { 
              bgcolor: 'rgba(56,139,253,0.85)'
            }
          }}
        >
          {loading ? 'Updating...' : 'Update profile'}
        </Button>
      </Box>
    </Container>
  )
}

export default Settings 