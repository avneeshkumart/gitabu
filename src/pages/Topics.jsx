import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Pagination
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { Star } from '@mui/icons-material'
import useStore from '../store/store'
import { useState } from 'react'
import TopicRepositoryCard from '../components/TopicRepositoryCard'

const ITEMS_PER_PAGE = 10

const Topics = () => {
  const repositories = useStore(state => state.repositories)
  const allTopics = [...new Set(repositories.flatMap(repo => repo.topics))]
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(allTopics.length / ITEMS_PER_PAGE)
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const displayedTopics = allTopics.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0}>
        {displayedTopics.map(topic => (
          <Box 
            key={topic}
            sx={{ 
              py: 2,
              px: 3,
              borderBottom: page === Math.ceil((startIndex + displayedTopics.indexOf(topic) + 1) / ITEMS_PER_PAGE) && 
                           displayedTopics.indexOf(topic) === displayedTopics.length - 1 ? 
                           'none' : '1px solid rgba(255, 255, 255, 0.12)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box>
                <RouterLink
                  to={`/topics/${topic}`}
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#58a6ff',
                    textDecoration: 'none'
                  }}
                >
                  {topic}
                </RouterLink>
              </Box>
              <Button
                startIcon={<Star sx={{ fontSize: 16 }} />}
                variant="outlined"
                size="small"
                sx={{
                  textTransform: 'none',
                  color: '#c9d1d9',
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                  '&:hover': {
                    borderColor: '#58a6ff',
                    bgcolor: 'rgba(56, 139, 253, 0.15)'
                  }
                }}
              >
                Star
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#8b949e' }}>
              <svg 
                aria-hidden="true" 
                height="16" 
                viewBox="0 0 16 16" 
                width="16" 
                fill="currentColor"
              >
                <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
              </svg>
              <Typography sx={{ fontSize: '14px', color: '#8b949e' }}>
                {repositories.filter(repo => repo.topics.includes(topic)).length} repositories
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>

      {totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mt: 4,
          py: 3,
          borderTop: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          <Stack direction="row" spacing={1}>
            <Button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              sx={{
                color: '#c9d1d9',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                '&:hover': {
                  borderColor: '#58a6ff',
                  bgcolor: 'rgba(56, 139, 253, 0.15)'
                }
              }}
            >
              Previous
            </Button>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              sx={{
                color: '#c9d1d9',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                '&:hover': {
                  borderColor: '#58a6ff',
                  bgcolor: 'rgba(56, 139, 253, 0.15)'
                }
              }}
            >
              Next
            </Button>
          </Stack>
        </Box>
      )}
    </Container>
  )
}

export default Topics 