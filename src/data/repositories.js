import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module'de __dirname yerine
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Repositories dosyasının tam yolu
const REPOSITORIES_FILE_PATH = path.join(__dirname, 'repositories.json');

// Mevcut repositoryleri dosyadan oku
export const getInitialRepositories = async () => {
  try {
    try {
      // Dosyayı oku
      const fileContent = await fs.readFile(REPOSITORIES_FILE_PATH, 'utf-8');
      return JSON.parse(fileContent);
    } catch (readError) {
      // Dosya yoksa boş dizi oluştur
      if (readError.code === 'ENOENT') {
        await fs.writeFile(REPOSITORIES_FILE_PATH, JSON.stringify([], null, 2));
        return [];
      }
      throw readError;
    }
  } catch (error) {
    console.error('Repository verilerini okuma hatası:', error);
    return [];
  }
};

// Yeni repository oluştur
export const createRepository = async (repoData) => {
  try {
    // Mevcut repositoryleri al
    const repositories = await getInitialRepositories();
    
    // Yeni repository için benzersiz ID oluştur
    const newRepo = {
      ...repoData,
      _id: Date.now().toString(), // Basit bir ID oluşturma
      createdAt: new Date().toISOString()
    };

    // Repositorylere yeni repo ekle
    repositories.push(newRepo);

    // Dosyaya kaydet
    await saveRepositories(repositories);

    return newRepo;
  } catch (error) {
    console.error('Repository oluşturma hatası:', error);
    return null;
  }
};

// Tüm repositoryleri kaydet
export const saveRepositories = async (repositories) => {
  try {
    // Repositoryleri JSON formatında dosyaya yaz
    await fs.writeFile(REPOSITORIES_FILE_PATH, JSON.stringify(repositories, null, 2));
    return true;
  } catch (error) {
    console.error('Repository verilerini kaydetme hatası:', error);
    return false;
  }
};

// Belirli bir repository'i sil
export const deleteRepository = async (repoId) => {
  try {
    // Mevcut repositoryleri al
    const repositories = await getInitialRepositories();
    
    // Belirtilen ID'ye sahip repository'i çıkar
    const updatedRepositories = repositories.filter(repo => repo._id !== repoId);

    // Güncellenmiş listeyi kaydet
    await saveRepositories(updatedRepositories);

    return true;
  } catch (error) {
    console.error('Repository silme hatası:', error);
    return false;
  }
};

// Belirli bir repository'i güncelle
export const updateRepository = async (repoId, updatedData) => {
  try {
    // Mevcut repositoryleri al
    const repositories = await getInitialRepositories();
    
    // Repository'i bul ve güncelle
    const updatedRepositories = repositories.map(repo => 
      repo._id === repoId 
        ? { ...repo, ...updatedData, updatedAt: new Date().toISOString() } 
        : repo
    );

    // Güncellenmiş listeyi kaydet
    await saveRepositories(updatedRepositories);

    return updatedRepositories.find(repo => repo._id === repoId);
  } catch (error) {
    console.error('Repository güncelleme hatası:', error);
    return null;
  }
};

export {
  getInitialRepositories,
  createRepository,
  saveRepositories,
  deleteRepository,
  updateRepository
};