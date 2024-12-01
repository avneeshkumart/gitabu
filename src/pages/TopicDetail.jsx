import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
  Divider,
  Link,
  IconButton,
  TextField
} from '@mui/material'
import { useParams } from 'react-router-dom'
import { Link as RouterLink } from 'react-router-dom'
import useStore from '../store/store'
import RepositoryCard from '../components/RepositoryCard'
import { LocalOffer, Edit as EditIcon, Star } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { SEOHead } from '../components/SEOHead'

const TopicDetail = () => {
  const { topic } = useParams()
  const repositories = useStore(state => state.repositories)
  const user = useStore(state => state.user)
  const [editingAbout, setEditingAbout] = useState(false)
  const [aboutData, setAboutData] = useState({
    description: '',
    website: ''
  })
  const [loading, setLoading] = useState(false)

  const topicRepositories = repositories.filter(repo => 
    repo.topics.includes(topic)
  )

  const handleAboutSave = () => {
    try {
      setLoading(true)
      // Yerel veri güncelleme işlemleri buraya eklenebilir
      setEditingAbout(false)
    } catch (err) {
      console.error('Failed to update topic:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Yerel veri ile çalışacağımız için API çağrısına gerek yok
    setAboutData({
      description: topicDescription,
      website: ''
    })
  }, [topic])

  const topicDescription = `
Instagram Report Bot is a powerful automation tool designed for efficient content moderation and mass reporting on Instagram. This tool enables automated reporting of multiple accounts, posts, or stories that violate Instagram's community guidelines. Features include bulk reporting capabilities, automated account reporting, and mass report automation for Instagram profiles.

Key Features:
• Automated mass reporting system
• Bulk account reporting tool
• Instagram violation detection
• Multiple report automation
• Fast reporting mechanism
• User-friendly interface
• Efficient moderation tool
• Advanced reporting features

This tool is specifically designed for content moderation and helps maintain community guidelines on Instagram. It streamlines the process of reporting inappropriate content, spam accounts, and policy violations through automated mechanisms.

Popular use cases include:
- Mass reporting of spam accounts
- Automated content moderation
- Bulk violation reporting
- Instagram safety management
- Account reporting automation
- Community guidelines enforcement

#InstagramReportBot #InstagramMassReport #ReportAutomation #ContentModeration #InstagramSafety
`;

  const formattedTopic = topic.replace(/-/g, ' ');

  return (
    <>
      <SEOHead
        title={`${formattedTopic} Tools and Scripts - Instagram Automation`}
        description={`Find the best ${formattedTopic} tools, bots and automation scripts. Discover powerful Instagram reporting and moderation solutions.`}
        keywords={`${formattedTopic}, instagram bot, automation tool, mass reporting`}
        path={`/topics/${topic}`}
      />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Sol Kolon - Repository'ler */}
          <Grid item xs={12}>
            {/* Header Section */}
            <Card variant="outlined" sx={{ mb: 4 }}>
              <CardContent>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalOffer sx={{ color: 'primary.main' }} />
                    <Typography variant="h4" component="h1">
                      {topic}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Typography color="text.secondary">
                      {topicRepositories.length.toLocaleString()} repositories
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Star sx={{ fontSize: 16, color: '#7d8590' }} />
                      <Typography color="text.secondary">
                        {topicRepositories.reduce((sum, repo) => sum + repo.stars, 0).toLocaleString()} stars
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Repository List */}
            <Box>
              <Typography variant="h5" gutterBottom>
                Repositories
              </Typography>
              <Grid container spacing={3}>
                {topicRepositories.map(repo => (
                  <Grid item xs={12} md={6} key={repo._id}>
                    <Box 
                      sx={{ 
                        height: '100%',
                        border: '1px solid',
                        borderColor: 'divider',
                        p: 3
                      }}
                    >
                      <RepositoryCard repository={repo} showCover={true} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default TopicDetail 