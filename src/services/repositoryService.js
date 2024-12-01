import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  getDoc,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

class RepositoryService {
  constructor() {
    this.repositoryCollection = collection(db, 'repositories');
  }

  // Yeni repository oluştur
  async createRepository(repositoryData, userId) {
    try {
      const newRepository = {
        ...repositoryData,
        owner: userId,
        createdAt: new Date(),
        stars: 0,
        forks: 0,
        visibility: 'public'
      };

      const docRef = await addDoc(this.repositoryCollection, newRepository);
      return { id: docRef.id, ...newRepository };
    } catch (error) {
      console.error("Repository oluşturma hatası:", error);
      throw error;
    }
  }

  // Kullanıcının repositorylerini getir
  async getUserRepositories(userId, pageSize = 10, lastDoc = null) {
    try {
      let q = query(
        this.repositoryCollection, 
        where('owner', '==', userId),
        orderBy('createdAt', 'desc')
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc), limit(pageSize));
      } else {
        q = query(q, limit(pageSize));
      }

      const snapshot = await getDocs(q);
      const repositories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        repositories,
        lastDoc: snapshot.docs[snapshot.docs.length - 1]
      };
    } catch (error) {
      console.error("Repositories getirme hatası:", error);
      throw error;
    }
  }

  // Tüm public repositoryleri getir
  async getPublicRepositories(pageSize = 20, lastDoc = null) {
    try {
      let q = query(
        this.repositoryCollection, 
        where('visibility', '==', 'public'),
        orderBy('stars', 'desc')
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc), limit(pageSize));
      } else {
        q = query(q, limit(pageSize));
      }

      const snapshot = await getDocs(q);
      const repositories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        repositories,
        lastDoc: snapshot.docs[snapshot.docs.length - 1]
      };
    } catch (error) {
      console.error("Public repositories getirme hatası:", error);
      throw error;
    }
  }

  // Belirli bir repository'i getir
  async getRepositoryById(repoId) {
    try {
      const docRef = doc(db, 'repositories', repoId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Repository bulunamadı');
      }
    } catch (error) {
      console.error("Repository getirme hatası:", error);
      throw error;
    }
  }

  // Repository güncelle
  async updateRepository(repoId, updateData) {
    try {
      const docRef = doc(db, 'repositories', repoId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date()
      });

      return true;
    } catch (error) {
      console.error("Repository güncelleme hatası:", error);
      throw error;
    }
  }

  // Repository sil
  async deleteRepository(repoId) {
    try {
      const docRef = doc(db, 'repositories', repoId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Repository silme hatası:", error);
      throw error;
    }
  }

  // Repository'e yıldız ekle/çıkar
  async toggleStar(repoId, userId) {
    try {
      const repoRef = doc(db, 'repositories', repoId);
      const repoSnap = await getDoc(repoRef);
      
      if (repoSnap.exists()) {
        const currentStars = repoSnap.data().stars || 0;
        await updateDoc(repoRef, {
          stars: currentStars + 1
        });
      }
    } catch (error) {
      console.error("Star ekleme hatası:", error);
      throw error;
    }
  }
}

export default new RepositoryService();
