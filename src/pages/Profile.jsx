import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Avatar, 
  Typography, 
  Grid, 
  Paper, 
  Tabs, 
  Tab, 
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Input
} from '@mui/material';
import { BookOutlined, Star, Delete as DeleteIcon, Edit as EditIcon, PhotoCamera } from '@mui/icons-material';
import RepositoryCard from '../components/RepositoryCard';
import useStore from '../store/store';

function ProfilePage() {
  const { username } = useParams();
  const user = useStore(state => state.user);
  const repositories = useStore(state => state.repositories);
  const users = useStore(state => state.users);
  const updateUsers = useStore(state => state.updateUsers);
  const setUser = useStore(state => state.setUser);
  const [tab, setTab] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    bio: '',
    location: '',
    website: ''
  });
  const [avatarStyle, setAvatarStyle] = useState('pixel-art');
  const avatarStyles = [
    { value: 'pixel-art', label: 'Pixel Art' },
    { value: 'adventurer', label: 'Adventurer' },
    { value: 'bottts', label: 'Robot' },
    { value: 'avataaars', label: 'Human' },
    { value: 'identicon', label: 'Identicon' }
  ];
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [uploadedAvatar, setUploadedAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [openAvatarDialog, setOpenAvatarDialog] = useState(false);

  // Profil verilerini bul
  const profileData = users.find(u => u.username === username);

  useEffect(() => {
    if (profileData) {
      setEditData({
        bio: profileData.bio || '',
        location: profileData.location || '',
        website: profileData.website || ''
      });
    }
  }, [profileData]);

  // Kullanıcının repository'leri
  const userRepos = repositories.filter(repo => 
    repo.owner.username === username && (!repo.isPrivate || user?.username === username)
  );

  // Yıldızlanan repository'ler
  const starredRepos = repositories.filter(repo => 
    repo.stars > 0 && repo.owner.username === username
  );

  const handleDeleteSelected = () => {
    const updatedRepositories = repositories.filter(repo => !selectedRepos.includes(repo._id));
    updateRepositories(updatedRepositories);
    setSelectedRepos([]);
    setOpenDeleteDialog(false);
  };

  const handleToggleRepo = (repoId) => {
    setSelectedRepos(prev => 
      prev.includes(repoId) 
        ? prev.filter(id => id !== repoId)
        : [...prev, repoId]
    );
  };

  const handleSaveProfile = () => {
    const updatedUsers = users.map(u => {
      if (u.username === username) {
        const updatedUser = {
          ...u,
          ...editData
        };
        if (user?.username === username) {
          setUser(updatedUser);
        }
        return updatedUser;
      }
      return u;
    });
    
    updateUsers(updatedUsers);
    setEditMode(false);
  };

  const handleAvatarChange = (style) => {
    const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${username}`;
    useStore.getState().updateAvatar(username, avatarUrl);
    setAvatarStyle(style);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreviewAvatar(base64String);
        setOpenAvatarDialog(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    try {
      if (!previewAvatar) {
        throw new Error('Yüklenecek avatar resmi bulunamadı');
      }

      // Store'daki updateAvatar fonksiyonunu kullan
      await useStore.getState().updateAvatar(username, previewAvatar);
      
      setOpenAvatarDialog(false);
      setPreviewAvatar(null);
    } catch (error) {
      console.error('Avatar yükleme hatası:', error);
      // Kullanıcıya hata mesajını göster
      alert('Avatar yüklenirken bir hata oluştu: ' + error.message);
    }
  };

  const handleCancelAvatar = () => {
    setOpenAvatarDialog(false);
    setPreviewAvatar(null);
  };

  if (!profileData) {
    return (
      <Container>
        <Typography>User not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Sol Kolon - Profil Bilgileri */}
        <Grid item xs={12} md={3}>
          <Stack spacing={3}>
            <Box>
              <Box sx={{ position: 'relative', width: 'fit-content', mb: 2 }}>
                <Avatar
                  src={profileData.avatarUrl}
                  alt={profileData.username}
                  sx={{ 
                    width: 260,
                    height: 260,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                />
                {user?.username === username && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'background.paper',
                      borderRadius: '50%',
                      p: 0.5,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      sx={{ display: 'none' }}
                      id="avatar-upload"
                    />
                    <label htmlFor="avatar-upload">
                      <IconButton
                        size="small"
                        component="span"
                        sx={{ 
                          bgcolor: '#238636',
                          color: 'white',
                          '&:hover': {
                            bgcolor: '#2ea043'
                          }
                        }}
                      >
                        <PhotoCamera fontSize="small" />
                      </IconButton>
                    </label>
                  </Box>
                )}
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    bgcolor: '#0d1117',
                    border: '1px solid #30363d',
                    boxShadow: '0 8px 24px rgba(140,149,159,0.2)',
                    '& .MuiMenuItem-root': {
                      fontSize: '14px',
                      color: '#c9d1d9',
                      '&:hover': {
                        bgcolor: 'rgba(177,186,196,0.12)'
                      }
                    }
                  }
                }}
              >
                {avatarStyles.map((style) => (
                  <MenuItem
                    key={style.value}
                    onClick={() => {
                      handleAvatarChange(style.value);
                      handleClose();
                    }}
                  >
                    {style.label}
                  </MenuItem>
                ))}
              </Menu>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h4">
                  {profileData.username}
                </Typography>
                {profileData.isOwner && (
                  <Chip 
                    label="Owner" 
                    color="primary" 
                    size="small"
                    sx={{ 
                      bgcolor: '#238636',
                      color: 'white',
                      fontWeight: 'bold'
                    }} 
                  />
                )}
              </Box>
              {!editMode ? (
                <>
                  {profileData.bio && (
                    <Typography color="text.secondary" gutterBottom>
                      {profileData.bio}
                    </Typography>
                  )}
                  {user?.username === username && (
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => setEditMode(true)}
                      sx={{ mt: 1 }}
                    >
                      Edit Profile
                    </Button>
                  )}
                </>
              ) : (
                <Box sx={{ mt: 2 }}>
                  <Stack spacing={2}>
                    <TextField
                      label="Bio"
                      multiline
                      rows={3}
                      value={editData.bio}
                      onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                      fullWidth
                    />
                    <TextField
                      label="Location"
                      value={editData.location}
                      onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                      fullWidth
                    />
                    <TextField
                      label="Website"
                      value={editData.website}
                      onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                      fullWidth
                    />
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button onClick={() => setEditMode(false)}>
                        Cancel
                      </Button>
                      <Button 
                        variant="contained" 
                        onClick={handleSaveProfile}
                        sx={{
                          bgcolor: '#238636',
                          '&:hover': {
                            bgcolor: '#2ea043'
                          }
                        }}
                      >
                        Save
                      </Button>
                    </Box>
                  </Stack>
                </Box>
              )}
            </Box>

            {/* Profil Detayları */}
            {!editMode && (
              <Stack spacing={2}>
                {profileData.location && (
                  <Typography color="text.secondary">
                    📍 {profileData.location}
                  </Typography>
                )}
                {profileData.website && (
                  <Typography color="text.secondary">
                    🔗 <a 
                      href={profileData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#58a6ff', textDecoration: 'none' }}
                    >
                      {profileData.website}
                    </a>
                  </Typography>
                )}
                <Typography color="text.secondary">
                  📅 Joined {new Date(profileData.createdAt).toLocaleDateString()}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Grid>

        {/* Sağ Kolon - Repository'ler */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
              <Tabs 
                value={tab} 
                onChange={(e, v) => setTab(v)}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    minHeight: '48px',
                    fontSize: '14px'
                  }
                }}
              >
                <Tab 
                  icon={<BookOutlined sx={{ fontSize: 16 }} />} 
                  iconPosition="start" 
                  label={`Repositories ${userRepos.length}`} 
                />
                <Tab 
                  icon={<Star sx={{ fontSize: 16 }} />} 
                  iconPosition="start" 
                  label={`Starred ${starredRepos.length}`} 
                />
              </Tabs>
              {user?.isOwner && tab === 0 && (
                <Button
                  startIcon={<DeleteIcon />}
                  color="error"
                  onClick={() => setOpenDeleteDialog(true)}
                  disabled={userRepos.length === 0}
                >
                  Delete Repositories
                </Button>
              )}
            </Box>
          </Paper>

          {tab === 0 ? (
            // Repository'ler
            <Stack spacing={2}>
              {userRepos.map(repo => (
                <RepositoryCard key={repo._id} repository={repo} />
              ))}
              {userRepos.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography color="text.secondary">
                    {username} doesn't have any repositories yet.
                  </Typography>
                </Box>
              )}
            </Stack>
          ) : (
            // Yıldızlanan Repository'ler
            <Stack spacing={2}>
              {starredRepos.map(repo => (
                <RepositoryCard key={repo._id} repository={repo} />
              ))}
              {starredRepos.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography color="text.secondary">
                    {username} hasn't starred any repositories yet.
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </Grid>
      </Grid>

      {/* Toplu Silme Dialog'u */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Repositories</DialogTitle>
        <DialogContent>
          <List>
            {userRepos.map(repo => (
              <ListItem key={repo._id} dense button onClick={() => handleToggleRepo(repo._id)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedRepos.includes(repo._id)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText 
                  primary={repo.name}
                  secondary={`${repo.stars} stars`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteSelected}
            color="error"
            disabled={selectedRepos.length === 0}
          >
            Delete Selected ({selectedRepos.length})
          </Button>
        </DialogActions>
      </Dialog>

      {/* Avatar Preview Dialog */}
      <Dialog 
        open={openAvatarDialog} 
        onClose={handleCancelAvatar}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Change Profile Picture</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Avatar
              src={previewAvatar}
              alt="Preview"
              sx={{ 
                width: 200,
                height: 200,
                border: '1px solid',
                borderColor: 'divider'
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAvatar}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveAvatar}
            variant="contained"
            sx={{
              bgcolor: '#238636',
              '&:hover': {
                bgcolor: '#2ea043'
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ProfilePage; 