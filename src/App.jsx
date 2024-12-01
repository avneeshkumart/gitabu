import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Box, CssBaseline } from '@mui/material'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Topics from './pages/Topics'
import Login from './pages/Login'
import Register from './pages/Register'
import NewRepository from './pages/NewRepository'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import RepositorySettings from './pages/RepositorySettings'
import LoadingSpinner from './components/LoadingSpinner'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import AuthComponent from './components/AuthComponent'
import RepositoryList from './components/RepositoryList'

const Repository = lazy(() => import('./pages/Repository'));
const TopicDetail = lazy(() => import('./pages/TopicDetail'));

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <Navbar />
      <Box component="main" sx={{ pt: 2 }}>
        <Suspense fallback={<LoadingSpinner />}>
          {user ? (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/topics" element={<Topics />} />
              <Route path="/topics/:topic" element={<TopicDetail />} />
              <Route path="/:username/:repoName" element={<Repository />} />
              <Route path="/new" element={<NewRepository />} />
              <Route path="/user/:username" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/:username/:repoName/settings" element={<RepositorySettings />} />
              <Route path="/repositories" element={<RepositoryList userId={user.id} />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<AuthComponent />} />
            </Routes>
          )}
        </Suspense>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <CssBaseline />
      <AppContent />
    </AuthProvider>
  );
}

export default App; 