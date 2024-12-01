import axios from 'axios';

// API endpoint'i
const API_BASE_URL = 'http://148.135.37.189:3001/api'; // VPS sunucunuzun domain adresini buraya yazın

class RepositoryStorage {
  // Repository ekleme
  static async addRepository(repositoryData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/repositories`, {
        ...repositoryData,
        createdAt: new Date().toISOString(),
        stars: 0,
        forks: 0
      });
      
      return response.data;
    } catch (error) {
      console.error('Repository ekleme hatası:', error);
      return null;
    }
  }

  // Repositoryleri getirme
  static async getRepositories(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/repositories`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      console.error('Repositories getirme hatası:', error);
      return [];
    }
  }

  // Repository silme
  static async deleteRepository(repoId) {
    try {
      await axios.delete(`${API_BASE_URL}/repositories/${repoId}`);
      return true;
    } catch (error) {
      console.error('Repository silme hatası:', error);
      return false;
    }
  }

  // Repository güncelleme
  static async updateRepository(repoId, updateData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/repositories/${repoId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Repository güncelleme hatası:', error);
      return null;
    }
  }

  // Kullanıcıya özel repositoryleri getir
  static async getUserRepositories(userId) {
    return await this.getRepositories(userId);
  }

  // Repository arama
  static async searchRepositories(query) {
    try {
      const response = await axios.get(`${API_BASE_URL}/repositories/search`, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error('Repository arama hatası:', error);
      return [];
    }
  }
}

export default RepositoryStorage;
