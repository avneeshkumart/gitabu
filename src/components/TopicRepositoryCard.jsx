import { 
  Box,
  Typography,
  Link,
  Chip
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { Code as CodeIcon } from '@mui/icons-material'
import { formatDate } from '../utils/formatters'

const TopicRepositoryCard = ({ repository }) => {
  return (
    <Box sx={{ 
      p: 3,
      borderBottom: '1px solid #21262d'
    }}>
      {/* Repository Name & Code Tab */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Link
          component={RouterLink}
          to={`/${repository.owner.username}/${repository.name}`}
          sx={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#58a6ff',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          {repository.owner.username}/{repository.name}
        </Link>
        <Chip 
          label="Public"
          size="small"
          sx={{ 
            height: '20px',
            fontSize: '12px',
            bgcolor: 'rgba(110,118,129,0.4)',
            color: '#7d8590',
            border: '1px solid rgba(240,246,252,0.1)'
          }}
        />
      </Box>

      {/* Description */}
      {repository.description && (
        <Typography 
          sx={{ 
            color: '#7d8590',
            fontSize: '14px',
            mb: 2
          }}
        >
          {repository.description}
        </Typography>
      )}

      {/* Topics */}
      <Box sx={{ 
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        mb: 2,
        maxWidth: '100%'
      }}>
        {repository.topics?.map(topic => (
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
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: 'rgba(56,139,253,0.25)',
                textDecoration: 'none'
              }
            }}
          >
            {topic}
          </Link>
        ))}
      </Box>

      {/* Updated Date */}
      <Typography sx={{ fontSize: '12px', color: '#7d8590' }}>
        {formatDate(repository.updatedAt)}
      </Typography>
    </Box>
  )
}

export default TopicRepositoryCard 