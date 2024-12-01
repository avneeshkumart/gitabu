import React, { useState, useEffect } from 'react';
import useRepositoryStore from '../store/repositoryStore';
import { repositoryDB } from '../utils/indexedDBStorage';

const RepositoryManager = () => {
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoDesc, setNewRepoDesc] = useState('');

  // Zustand store'dan metodları al
  const { 
    repositories, 
    addRepository, 
    deleteRepository, 
    updateRepository 
  } = useRepositoryStore();

  // Sayfa yüklendiğinde IndexedDB'den verileri çek
  useEffect(() => {
    const loadRepositories = async () => {
      try {
        const dbRepos = await repositoryDB.getAllRepositories();
        
        // Eğer IndexedDB'de kayıtlı repository varsa Zustand store'a ekle
        if (dbRepos.length > 0) {
          dbRepos.forEach(repo => addRepository(repo));
        }
      } catch (error) {
        console.error('Repositories yüklenirken hata:', error);
      }
    };

    loadRepositories();
  }, []);

  // Yeni repository oluşturma
  const handleCreateRepository = async (e) => {
    e.preventDefault();
    
    const newRepo = {
      name: newRepoName,
      description: newRepoDesc
    };

    // Zustand store'a ekle
    addRepository(newRepo);

    // IndexedDB'ye kaydet
    await repositoryDB.addRepository(newRepo);

    // Formu temizle
    setNewRepoName('');
    setNewRepoDesc('');
  };

  // Repository silme
  const handleDeleteRepository = async (repoId) => {
    // Zustand store'dan sil
    deleteRepository(repoId);

    // IndexedDB'den sil
    await repositoryDB.deleteRepository(repoId);
  };

  // Repository güncelleme
  const handleUpdateRepository = async (repoId, updatedData) => {
    // Zustand store'da güncelle
    updateRepository(repoId, updatedData);

    // IndexedDB'de güncelle
    await repositoryDB.updateRepository(repoId, updatedData);
  };

  return (
    <div>
      <h2>Repository Yönetimi</h2>
      
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
        <h3>Repositoryler</h3>
        {repositories.map(repo => (
          <div key={repo._id}>
            <h4>{repo.name}</h4>
            <p>{repo.description}</p>
            <button onClick={() => handleDeleteRepository(repo._id)}>
              Sil
            </button>
            <button onClick={() => handleUpdateRepository(repo._id, { name: 'Güncellenmiş Ad' })}>
              Güncelle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepositoryManager;
