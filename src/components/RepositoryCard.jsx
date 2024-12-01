import { 
  Box,
  Typography,
  Stack,
  Link,
  Chip
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { Star, ForkRight, Code as CodeIcon } from '@mui/icons-material'
import { formatStarCount, formatDate } from '../utils/formatters';

const RepositoryCard = ({ repository, showCover = false }) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {showCover && repository?.coverImage && (
        <Link
          component={RouterLink}
          to={`/${repository.owner.username}/${repository.name}`}
          sx={{
            display: 'block',
            width: 'calc(100% + 48px)',
            height: 150,
            mt: -3,
            mx: -3,
            mb: 2,
            position: 'relative',
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundImage: `url(${repository.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.9
            }
          }}
        />
      )}

      <Stack spacing={2} sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Link
                component={RouterLink}
                to={`/${repository.owner.username}/${repository.name}`}
                sx={{
                  fontSize: '16px',
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

            <Box sx={{ display: 'flex', alignItems: 'center', mt: '4px' }}>
              <Link
                component={RouterLink}
                to={`/${repository.owner.username}/${repository.name}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  color: '#7d8590',
                  textDecoration: 'none',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid #30363d',
                  '&:hover': {
                    color: '#c9d1d9',
                    backgroundColor: 'rgba(177, 186, 196, 0.12)',
                    borderColor: '#6e7681'
                  }
                }}
              >
                <CodeIcon sx={{ fontSize: 14 }} />
                Code
              </Link>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Star sx={{ fontSize: 16, color: '#7d8590' }} />
            <Typography sx={{ fontSize: '12px', color: '#7d8590' }}>
              {formatStarCount(repository.stars)}
            </Typography>
          </Box>
        </Box>

        {repository.description && (
          <Typography 
            color="text.secondary"
            sx={{ 
              fontSize: '14px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {repository.description}
          </Typography>
        )}

        {repository.topics?.length > 0 && (
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            mt: 2
          }}>
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
                  whiteSpace: 'nowrap',
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
        )}

        <Stack 
          direction="row" 
          spacing={3}
          sx={{ 
            fontSize: '12px',
            color: '#7d8590',
            mt: 'auto',
            pt: 1
          }}
        >
          {repository.forks > 0 && (
            <Box 
              component="span"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <ForkRight sx={{ fontSize: 16 }} />
              {repository.forks}
            </Box>
          )}

          <Typography component="span">
            {formatDate(repository.updatedAt)}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default RepositoryCard 