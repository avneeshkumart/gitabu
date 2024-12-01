import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useRepositoryStore = create(persist(
  (set, get) => ({
    repositories: [],
    
    // Repository ekleme
    addRepository: (repository) => {
      set((state) => {
        const newRepo = {
          ...repository,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        return { 
          repositories: [...state.repositories, newRepo] 
        };
      });
    },

    // Repository silme
    deleteRepository: (repoId) => {
      set((state) => ({
        repositories: state.repositories.filter(repo => repo._id !== repoId)
      }));
    },

    // Repository güncelleme
    updateRepository: (repoId, updatedData) => {
      set((state) => ({
        repositories: state.repositories.map(repo => 
          repo._id === repoId 
            ? { 
                ...repo, 
                ...updatedData, 
                updatedAt: new Date().toISOString() 
              } 
            : repo
        )
      }));
    },

    // Tüm repositoryleri temizleme
    clearRepositories: () => {
      set({ repositories: [] });
    }
  }),
  {
    name: 'repository-storage', // localStorage'da kullanılacak anahtar
    storage: createJSONStorage(() => localStorage), // Tarayıcı depolaması
    partialize: (state) => ({ repositories: state.repositories }) // Sadece repositories'i kaydet
  }
));

export default useRepositoryStore;
