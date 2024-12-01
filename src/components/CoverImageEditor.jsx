import { useState, useRef } from 'react'
import { Box, Button, Dialog } from '@mui/material'

const CoverImageEditor = ({ open, onClose, image, onSave }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e) => {
    isDragging.current = true
    startPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    }
  }

  const handleMouseMove = (e) => {
    if (!isDragging.current) return

    const newX = e.clientX - startPos.current.x
    const newY = e.clientY - startPos.current.y

    // Sınırları kontrol et
    const maxY = 0
    const minY = 150 - imageRef.current?.height || 0

    setPosition({
      x: 0, // X ekseni sabit
      y: Math.min(maxY, Math.max(minY, newY))
    })
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  const imageRef = useRef(null)

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <Box sx={{ p: 2 }}>
        <Box 
          sx={{ 
            height: '150px',
            overflow: 'hidden',
            cursor: 'move',
            position: 'relative',
            bgcolor: '#0d1117',
            mb: 2
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imageRef}
            src={image}
            alt="Cover"
            style={{
              width: '100%',
              position: 'relative',
              top: position.y,
              userSelect: 'none'
            }}
            draggable={false}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={() => onSave(position)}
            sx={{ 
              bgcolor: '#58a6ff',
              '&:hover': { bgcolor: 'rgba(56,139,253,0.85)' }
            }}
          >
            Save Position
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}

export default CoverImageEditor 