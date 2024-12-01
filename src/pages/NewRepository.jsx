import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Stack,
  Card,
  CardContent,
  Alert,
  Divider,
  InputAdornment,
  Chip
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/store'
import MDEditor from '@uiw/react-md-editor'

const NewRepository = () => {
  const navigate = useNavigate()
  const user = useStore(state => state.user)
  const createRepository = useStore(state => state.createRepository)
  const loading = useStore(state => state.loading)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    topics: [],
    readme: '# New Repository\nAdd your README content here...',
    coverImage: null
  })
  
  const [currentTopic, setCurrentTopic] = useState('')
  const [error, setError] = useState('')

  const formatRepositoryName = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
  }

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target
    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        [name]: formatRepositoryName(value)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'isPrivate' ? checked : value
      }))
    }
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
        setFormData(prev => ({
          ...prev,
          coverImage: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('You need to be signed in to create a repository.')
      return
    }

    if (!formData.name.trim()) {
      setError('Repository name is required.')
      return
    }

    try {
      const newRepo = await createRepository(formData)
      navigate(`/${user.username}/${newRepo.name}`)
    } catch (err) {
      setError(err.message || 'Failed to create repository')
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Create a new repository
      </Typography>

      <Typography color="text.secondary" paragraph>
        A repository contains all project files, including the revision history.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card variant="outlined">
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Owner/Repository Name */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Repository name *
                </Typography>
                <TextField
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {user?.username}/
                      </InputAdornment>
                    ),
                  }}
                  placeholder="my-awesome-project"
                  helperText="Use only letters, numbers, and hyphens. No spaces allowed."
                />
              </Box>

              <Divider />

              {/* Description */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Description <Typography component="span" color="text.secondary">(optional)</Typography>
                </Typography>
                <TextField
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  fullWidth
                  size="small"
                  placeholder="Write a short description"
                />
              </Box>

              <Divider />

              {/* README */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
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

              {/* Privacy Setting */}
              <Box>
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

              <Divider />

              {/* Topics */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Topics
                </Typography>
                <TextField
                  value={currentTopic}
                  onChange={(e) => setCurrentTopic(e.target.value)}
                  onKeyDown={handleTopicKeyDown}
                  fullWidth
                  size="small"
                  placeholder="Add topics to categorize your repository"
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

              {/* Cover Image */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Cover Image <Typography component="span" color="text.secondary">(optional)</Typography>
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ mt: 1 }}
                >
                  Choose Cover Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleCoverImageChange}
                  />
                </Button>
                {formData.coverImage && (
                  <Box sx={{ mt: 2 }}>
                    <img 
                      src={formData.coverImage} 
                      alt="Cover preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }} 
                    />
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: '#2ea043',
                    '&:hover': {
                      bgcolor: '#2c974b'
                    }
                  }}
                >
                  {loading ? 'Creating...' : 'Create repository'}
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
  )
}

export default NewRepository 