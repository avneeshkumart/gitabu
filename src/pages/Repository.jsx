import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Avatar,
  Tabs,
  Tab,
  Link,
  Breadcrumbs,
  CircularProgress,
  Grid,
  TextField,
  Chip
} from '@mui/material'
import { 
  Star, 
  Code, 
  Settings,
  Edit as EditIcon,
  Language as WebsiteIcon
} from '@mui/icons-material'
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
import useStore from '../store/store'
import { SEOHead } from '../components/SEOHead'

const formatStarCount = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count;
};

const Repository = () => {
  const { username, repoName } = useParams()
  const navigate = useNavigate()
  const repositories = useStore(state => state.repositories)
  const updateRepositories = useStore(state => state.updateRepositories)
  const [repository, setRepository] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const user = useStore(state => state.user)
  const [editingAbout, setEditingAbout] = useState(false)
  const [aboutData, setAboutData] = useState({
    description: '',
    website: '',
    topics: []
  })
  const [currentTopic, setCurrentTopic] = useState('')
  const [starCount, setStarCount] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editableStars, setEditableStars] = useState(0)

  useEffect(() => {
    const fetchRepository = () => {
      try {
        const repo = repositories.find(r => r.owner.username === username && r.name === repoName);
        if (repo) {
          setRepository(repo);
          setStarCount(repo.stars || 0);
          setAboutData({
            description: repo.description || '',
            website: repo.website || '',
            topics: repo.topics || []
          });
          setEditableStars(repo.stars || 0);
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Failed to load repository:', err);
        navigate('/');
      }
    };

    fetchRepository();
  }, [username, repoName, repositories]);

  const handleAboutSave = () => {
    try {
      const updatedRepo = {
        ...repository,
        description: aboutData.description,
        website: aboutData.website,
        topics: aboutData.topics
      };

      const updatedRepositories = repositories.map(repo =>
        repo._id === repository._id ? updatedRepo : repo
      );

      updateRepositories(updatedRepositories);
      setRepository(updatedRepo);
      setEditingAbout(false);
      console.log('Repository updated successfully');
    } catch (err) {
      console.error('Failed to update repository:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    if (newValue === 1) {
      navigate(`/${username}/${repoName}/settings`)
    } else {
      setTabValue(newValue)
    }
  }

  const handleTopicChange = (e) => {
    const formattedValue = e.target.value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    setCurrentTopic(formattedValue)
  }

  const handleTopicKeyDown = (e) => {
    if (e.key === 'Enter' && currentTopic.trim()) {
      e.preventDefault()
      const newTopic = currentTopic.trim()
      if (!aboutData.topics.includes(newTopic)) {
        const updatedTopics = [...aboutData.topics, newTopic]
        setAboutData(prev => ({
          ...prev,
          topics: updatedTopics
        }))
        setCurrentTopic('')
      }
    }
  }

  const handleStarInputChange = (e) => {
    setEditableStars(parseInt(e.target.value) || 0);
  };

  const handleStarSubmit = () => {
    try {
      const updatedRepo = {
        ...repository,
        stars: editableStars
      };

      const updatedRepositories = repositories.map(repo =>
        repo._id === repository._id ? updatedRepo : repo
      );

      updateRepositories(updatedRepositories);
      setRepository(updatedRepo);
      setIsEditing(false);
    } catch (error) {
      console.error('Star update failed:', error);
      setEditableStars(repository.stars || 0);
    }
  };

  const handleUpdateAllStars = async () => {
    await repositories.updateAllStars();
  };

  if (!repository) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <>
      <SEOHead
        title={`${repoName} - Instagram Report Bot & Mass Reporting Tool`}
        description={repository.description || `${repoName} is a powerful Instagram report bot and mass reporting tool. Automate Instagram content moderation and reporting.`}
        keywords={repository.topics?.join(', ') || 'instagram report bot, mass reporting, automation'}
        image={repository.coverImage}
        path={`/${username}/${repoName}`}
      />
      <Box sx={{ bgcolor: 'background.default' }}>
        {/* Header */}
        <Box sx={{ 
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          py: 2,
          mt: 2
        }}>
          <Container maxWidth="xl" sx={{ px: 3 }}>
            {/* Breadcrumbs */}
            <Box sx={{ mb: 1 }}>
              <Breadcrumbs 
                separator="/" 
                sx={{ 
                  '& .MuiBreadcrumbs-separator': { 
                    color: 'text.secondary' 
                  }
                }}
              >
                <Link 
                  component={RouterLink} 
                  to={`/user/${repository.owner.username}`}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: 'text.primary',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  <Avatar
                    src={repository.owner.avatarUrl}
                    alt={repository.owner.username}
                    sx={{ width: 20, height: 20, mr: 1 }}
                  />
                  {repository.owner.username}
                </Link>
                <Typography color="text.primary">
                  {repository.name}
                </Typography>
              </Breadcrumbs>
            </Box>

            {/* Title & Description */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 2 
            }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h4" component="h1">
                    {repository.name}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      px: 1, 
                      py: 0.5, 
                      border: '1px solid', 
                      borderColor: 'divider',
                      borderRadius: 1,
                      color: 'text.secondary'
                    }}
                  >
                    Public
                  </Typography>
                </Box>
              </Box>

              {/* Star Button */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Star sx={{ fontSize: 16 }} />}
                  size="small"
                  onClick={() => setIsEditing(true)}
                  sx={{ 
                    color: '#7d8590',
                    borderColor: 'divider',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: 'divider',
                      bgcolor: 'rgba(177, 186, 196, 0.12)'
                    }
                  }}
                >
                  Star
                  <Box
                    component="span"
                    sx={{
                      ml: 1,
                      pl: 1,
                      borderLeft: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    {isEditing ? (
                      <input 
                        type="number"
                        min="0"
                        value={editableStars}
                        onChange={handleStarInputChange}
                        onBlur={handleStarSubmit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleStarSubmit();
                          }
                        }}
                        autoFocus
                        style={{
                          width: '50px',
                          padding: '0 4px',
                          border: '1px solid #30363d',
                          borderRadius: '4px',
                          background: '#0d1117',
                          color: '#c9d1d9',
                          fontSize: '14px'
                        }}
                      />
                    ) : (
                      formatStarCount(repository.stars || 0)
                    )}
                  </Box>
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Content */}
        <Container maxWidth="xl" sx={{ py: 3, px: 3 }}>
          <Grid container spacing={3}>
            {/* Sol Kolon - README */}
            <Grid item xs={12} md={9}>
              <Box sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden'
              }}>
                {/* Navigation Tabs */}
                <Box sx={{ 
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper'
                }}>
                  <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange}
                    sx={{
                      '& .MuiTab-root': {
                        minHeight: '48px',
                        textTransform: 'none',
                        fontSize: '14px',
                        fontWeight: 600,
                        px: 3,
                        minWidth: 'auto',
                        color: 'text.secondary',
                        '&.Mui-selected': {
                          color: 'text.primary',
                          borderBottom: '2px solid #f78166'
                        }
                      }
                    }}
                  >
                    <Tab icon={<Code sx={{ fontSize: 16 }} />} iconPosition="start" label="Code" />
                    {user?.username === repository.owner.username && (
                      <Tab icon={<Settings sx={{ fontSize: 16 }} />} iconPosition="start" label="Settings" />
                    )}
                  </Tabs>
                </Box>

                {/* README */}
                <Box 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'background.paper',
                    '& .wmde-markdown': {
                      background: 'transparent',
                      color: 'inherit',
                      fontFamily: 'inherit',
                      textAlign: 'center'
                    },
                    '& .wmde-markdown h1, & .wmde-markdown h2, & .wmde-markdown h3, & .wmde-markdown h4, & .wmde-markdown h5, & .wmde-markdown h6': {
                      color: '#c9d1d9',
                      borderBottom: '1px solid #21262d',
                      textAlign: 'center'
                    },
                    '& .wmde-markdown p': {
                      color: '#c9d1d9',
                      textAlign: 'center'
                    },
                    '& .wmde-markdown ul, & .wmde-markdown ol': {
                      color: '#c9d1d9',
                      textAlign: 'center',
                      listStylePosition: 'inside'
                    },
                    '& .wmde-markdown code': {
                      background: '#161b22',
                      color: '#c9d1d9',
                      border: '1px solid #30363d',
                      borderRadius: '6px'
                    },
                    '& .wmde-markdown pre': {
                      background: '#161b22',
                      border: '1px solid #30363d',
                      borderRadius: '6px'
                    },
                    '& .wmde-markdown blockquote': {
                      color: '#8b949e',
                      borderLeft: '4px solid #30363d'
                    },
                    '& .wmde-markdown a': {
                      color: '#58a6ff'
                    },
                    '& .wmde-markdown hr': {
                      background: '#21262d',
                      height: '1px'
                    },
                    '& .wmde-markdown table': {
                      borderColor: '#30363d'
                    }
                  }}
                >
                  <MDEditor.Markdown 
                    source={repository.readme}
                    style={{
                      backgroundColor: 'transparent',
                      color: 'inherit',
                      fontFamily: 'inherit'
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Sağ Kolon - About */}
            <Grid item xs={12} md={3}>
              <Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 2
                }}>
                  <Typography variant="h6">About</Typography>
                  {user?.username === repository.owner.username && (
                    <IconButton 
                      size="small"
                      onClick={() => setEditingAbout(!editingAbout)}
                      sx={{ color: 'text.secondary' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                {editingAbout ? (
                  <Stack spacing={2}>
                    <TextField
                      multiline
                      rows={4}
                      label="Description"
                      value={aboutData.description}
                      onChange={(e) => setAboutData(prev => ({ ...prev, description: e.target.value }))}
                      fullWidth
                    />

                    <TextField
                      label="Website"
                      value={aboutData.website}
                      onChange={(e) => setAboutData(prev => ({ ...prev, website: e.target.value }))}
                      fullWidth
                    />

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Topics
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                        {aboutData.topics.map(topic => (
                          <Chip
                            key={topic}
                            label={topic}
                            onDelete={() => setAboutData(prev => ({
                              ...prev,
                              topics: prev.topics.filter(t => t !== topic)
                            }))}
                            sx={{
                              bgcolor: 'rgba(56,139,253,0.15)',
                              color: '#58a6ff',
                              '& .MuiChip-deleteIcon': {
                                color: '#58a6ff'
                              }
                            }}
                          />
                        ))}
                      </Box>
                      <TextField
                        size="small"
                        placeholder="Add a topic"
                        value={currentTopic}
                        onChange={handleTopicChange}
                        onKeyDown={handleTopicKeyDown}
                        fullWidth
                        helperText="Press Enter to add a topic"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button onClick={() => setEditingAbout(false)}>
                        Cancel
                      </Button>
                      <Button variant="contained" onClick={handleAboutSave}>
                        Save
                      </Button>
                    </Box>
                  </Stack>
                ) : (
                  <Stack spacing={2}>
                    {repository.description && (
                      <Typography color="text.secondary">
                        {repository.description}
                      </Typography>
                    )}

                    {repository.website && (
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <WebsiteIcon sx={{ fontSize: 16, color: '#7d8590' }} />
                          <Typography sx={{ fontSize: '14px', color: '#7d8590' }}>Website</Typography>
                        </Box>
                        <Link
                          href={repository.website.startsWith('http') ? repository.website : `https://${repository.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: '#58a6ff',
                            textDecoration: 'none',
                            fontSize: '14px',
                            display: 'block',
                            ml: '28px',
                            '&:hover': {
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          {repository.website.replace(/^https?:\/\//, '')}
                        </Link>
                      </Box>
                    )}

                    {repository.topics?.length > 0 && (
                      <Box>
                        <Typography 
                          variant="subtitle2" 
                          color="text.secondary"
                          sx={{ mb: 1, fontSize: '12px', fontWeight: 600 }}
                        >
                          Topics
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {repository.topics.map(topic => (
                            <Link
                              key={topic}
                              component={RouterLink}
                              to={`/topics/${topic}`}
                              sx={{
                                fontSize: '12px',
                                color: '#58a6ff',
                                bgcolor: 'rgba(56,139,253,0.15)',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '2em',
                                textDecoration: 'none',
                                '&:hover': {
                                  bgcolor: 'rgba(56,139,253,0.25)',
                                  color: '#58a6ff',
                                  textDecoration: 'none'
                                }
                              }}
                            >
                              {topic}
                            </Link>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Stack>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default Repository 