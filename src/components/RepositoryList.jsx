import React, { useState, useEffect } from 'react';
import RepositoryStorage from '../utils/repositoryStorage';

const RepositoryList = ({ userId }) => {
  const [repositories, setRepositories] = useState([]);
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoDesc, setNewRepoDesc] = useState('');

  // Sayfa yüklendiğinde repositoryleri getir
  useEffect(() => {
    // Kullanıcıya özel repositoryleri getir
    const userRepos = RepositoryStorage.getUserRepositories(userId);
    setRepositories(userRepos);
  }, [userId]);

  // Yeni repository oluşturma
  const handleCreateRepository = (e) => {
    e.preventDefault();
    
    const newRepo = {
      name: newRepoName,
      description: newRepoDesc,
      owner: userId
    };

    // Repository storage'a ekle
    const createdRepo = RepositoryStorage.addRepository(newRepo);
    
    if (createdRepo) {
      // Listeyi güncelle
      setRepositories(prev => [...prev, createdRepo]);
      
      // Formu temizle
      setNewRepoName('');
      setNewRepoDesc('');
    }
  };

  // Repository silme
  const handleDeleteRepository = (repoId) => {
    // Storage'dan sil
    const result = RepositoryStorage.deleteRepository(repoId);
    
    if (result) {
      // Listeden çıkar
      setRepositories(prev => prev.filter(repo => repo._id !== repoId));
    }
  };

  return (
    <div>
      <h2>Repositoryler</h2>
      
      {/* Repository Oluşturma Formu */}
      <form onSubmit={handleCreateRepository}>
        <input 
          type="text" 
          placeholder="Repository Adı"
          value={newRepoName}
          onChange={(e) => setNewRepoName(e.target.value)}
          required 
        />
        <textarea 
          placeholder="Repository Açıklaması"
          value={newRepoDesc}
          onChange={(e) => setNewRepoDesc(e.target.value)}
        />
        <button type="submit">Repository Oluştur</button>
      </form>

      {/* Repository Listesi */}
      <div>
        {repositories.map(repo => (
          <div key={repo._id}>
            <h3>{repo.name}</h3>
            <p>{repo.description}</p>
            <span>⭐ {repo.stars} yıldız</span>
            <button onClick={() => handleDeleteRepository(repo._id)}>
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepositoryList;
