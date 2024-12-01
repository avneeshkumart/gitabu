import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedRepos, setSelectedRepos] = useState([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isAuthenticated && user ? (
        <>
          <div className="profile-container">
            {user?.avatarUrl && (
              <img 
                src={user.avatarUrl} 
                alt="Profil Avatar" 
                className="profile-avatar"
              />
            )}
            <div className="profile-info">
              <h2>{user?.username}</h2>
              <p>{user?.email}</p>
              {user?.bio && <p>{user.bio}</p>}
              {user?.location && <p>{user.location}</p>}
              {user?.website && <p>{user.website}</p>}
            </div>
          </div>
          
          {user?.username === 'tDev' && (
            <div className="admin-controls">
              <button className="delete-repos">
                Delete selected repositories ({selectedRepos.length})
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="not-authenticated">
          <p>Bu sayfayı görüntülemek için giriş yapmalısınız.</p>
        </div>
      )}
    </div>
  );
}

export default ProfilePage; 