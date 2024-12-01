import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Divider,
  FormControlLabel,
  Switch,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Breadcrumbs,
  Link
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { useState } from 'react'
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom'
import useStore from '../store/store'
import MDEditor from '@uiw/react-md-editor'
import CoverImageEditor from '../components/CoverImageEditor'

const RepositorySettings = () => {
  const { username, repoName } = useParams()
  const navigate = useNavigate()
  const repositories = useStore(state => state.repositories)
  const updateRepository = useStore(state => state.updateRepository)
  const deleteRepository = useStore(state => state.deleteRepository)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteConfirmName, setDeleteConfirmName] = useState('')
  const [coverEditorOpen, setCoverEditorOpen] = useState(false)
  const [coverPosition, setCoverPosition] = useState({ x: 0, y: 0 })

  const repository = repositories.find(r => 
    r.owner.username === username && r.name === repoName
  )
  const [formData, setFormData] = useState({
    name: repository?.name || '',
    description: repository?.description || '',
    isPrivate: repository?.isPrivate || false,
    topics: repository?.topics || [],
    readme: repository?.readme || ''
  })
  const [currentTopic, setCurrentTopic] = useState('')
  const [coverImage, setCoverImage] = useState(repository?.coverImage || null)

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isPrivate' ? checked : value
    }))
  }

  const handleTopicKeyDown = (e) => {
    if (e.key === 'Enter' && currentTopic.trim()) {
      e.preventDefault()
      if (!formData.topics.includes(currentTopic.trim())) {
        setFormData(prev => ({
          ...prev,
          topics: [...prev.topics, currentTopic.trim()]
        }))
      }
      setCurrentTopic('')
    }
  }

  const handleRemoveTopic = (topicToRemove) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter(topic => topic !== topicToRemove)
    }))
  }

  const handleCoverImageChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Cover image size should be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImage(reader.result)
        setCoverEditorOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverPositionSave = (position) => {
    setCoverPosition(position)
    setCoverEditorOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Tüm form verilerini ve kapak fotoğrafını birlikte gönder
      const updatedData = {
        ...formData,
        coverImage: coverImage // Kapak fotoğrafını ekle
      }

      // Repository'yi güncelle
      await updateRepository(username, repoName, updatedData)
      
      // Store'daki repository'yi güncelle
      await useStore.getState().fetchRepositories() // Tüm repository'leri yeniden yükle
      
      setSuccess('Repository settings updated successfully. Cover image has been changed.')
    } catch (err) {
      setError(err.message || 'Failed to update repository')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (deleteConfirmName !== repository.name) {
      setError('Please type the repository name to confirm deletion')
      return
    }

    try {
      setLoading(true)
      await deleteRepository(username, repoName)
      setLoading(false)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Failed to delete repository')
      setLoading(false)
    }
  }

  if (!repository) return null

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link 
          component={RouterLink} 
          to={`/${username}/${repoName}`}
          color="inherit"
          sx={{ 
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          {repository?.name}
        </Link>
        <Typography color="text.primary">Settings</Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom>
        Repository settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            {/* Repository name */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Repository name
              </Typography>
              <TextField
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                size="small"
                required
              />
            </Box>

            <Divider />

            {/* Description */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <TextField
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                size="small"
                multiline
                rows={2}
                placeholder="Add a short description to your repository"
              />
            </Box>

            <Divider />

            {/* Topics */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Topics
              </Typography>
              <TextField
                value={currentTopic}
                onChange={(e) => setCurrentTopic(e.target.value)}
                onKeyDown={handleTopicKeyDown}
                fullWidth
                size="small"
                placeholder="Add topics to describe your repository"
                helperText="Separate topics with Enter"
              />
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.topics.map(topic => (
                  <Chip
                    key={topic}
                    label={topic}
                    onDelete={() => handleRemoveTopic(topic)}
                    sx={{
                      bgcolor: 'rgba(56,139,253,0.15)',
                      color: '#58a6ff',
                      '&:hover': {
                        bgcolor: 'rgba(56,139,253,0.25)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Divider />

            {/* README */}
            <Box>
              <Typography variant="h6" gutterBottom>
                README.md
              </Typography>
              <Box data-color-mode="dark">
                <MDEditor
                  value={formData.readme}
                  onChange={(value) => setFormData(prev => ({ ...prev, readme: value }))}
                  preview="edit"
                  height={300}
                />
              </Box>
            </Box>

            <Divider />

            {/* Visibility */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Visibility
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    name="isPrivate"
                    checked={formData.isPrivate}
                    onChange={handleInputChange}
                  />
                }
                label={
                  <Box>
                    <Typography>Private repository</Typography>
                    <Typography variant="body2" color="text.secondary">
                      You choose who can see and commit to this repository.
                    </Typography>
                  </Box>
                }
              />
            </Box>

            {/* Cover Image */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Cover Image
              </Typography>
              <Box sx={{ position: 'relative', mb: 2 }}>
                {coverImage ? (
                  <Box sx={{ 
                    width: '100%',
                    height: 150,
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <img
                      src={coverImage}
                      alt="Cover"
                      style={{
                        width: '100%',
                        position: 'relative',
                        top: coverPosition.y
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      border: '1px dashed',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography color="text.secondary">
                      No cover image
                    </Typography>
                  </Box>
                )}
                <Button
                  variant="contained"
                  component="label"
                  sx={{ 
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    bgcolor: '#58a6ff',
                    '&:hover': { bgcolor: 'rgba(56,139,253,0.85)' }
                  }}
                >
                  Change Cover
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleCoverImageChange}
                  />
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Add a cover image to your repository (max 5MB)
              </Typography>
            </Box>

            <Divider />

            <Button 
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ alignSelf: 'flex-start' }}
            >
              Save changes
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* Danger Zone */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: '#21262d', borderColor: '#f85149' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Danger Zone
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete this repository
          </Button>
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={deleteDialogOpen} 
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ color: 'error.main' }}>
            Are you absolutely sure?
          </DialogTitle>
          <DialogContent>
            <Typography paragraph>
              This action <strong>cannot</strong> be undone. This will permanently delete the <strong>{repository.name}</strong> repository.
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={deleteConfirmName}
              onChange={(e) => setDeleteConfirmName(e.target.value)}
              placeholder={`Please type "${repository.name}" to confirm`}
              error={!!error}
              helperText={error}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              color="error" 
              variant="contained"
              onClick={handleDelete}
              disabled={deleteConfirmName !== repository.name || loading}
            >
              I understand the consequences, delete this repository
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>

      <CoverImageEditor
        open={coverEditorOpen}
        onClose={() => setCoverEditorOpen(false)}
        image={coverImage}
        onSave={handleCoverPositionSave}
      />
    </Container>
  )
}

export default RepositorySettings 