import Dexie from 'dexie';

class RepositoryDatabase extends Dexie {
  constructor() {
    super('RepositoryDatabase');
    this.version(1).stores({
      repositories: '++_id, name, description, createdAt, updatedAt'
    });
  }

  // Tüm repositoryleri getir
  async getAllRepositories() {
    return await this.repositories.toArray();
  }

  // Yeni repository ekle
  async addRepository(repository) {
    const newRepo = {
      ...repository,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    return await this.repositories.add(newRepo);
  }

  // Repository güncelle
  async updateRepository(repoId, updatedData) {
    return await this.repositories.update(repoId, {
      ...updatedData,
      updatedAt: new Date().toISOString()
    });
  }

  // Repository sil
  async deleteRepository(repoId) {
    return await this.repositories.delete(repoId);
  }

  // Tüm repositoryleri temizle
  async clearRepositories() {
    return await this.repositories.clear();
  }
}

export const repositoryDB = new RepositoryDatabase();
