import axios from 'axios';

const API_BASE_URL = 'http://148.135.37.189:3001/api';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.listeners = new Set();
  }

  // Kullanıcı durumu değişikliğini dinleyenlere bildir
  notifyListeners(user) {
    this.listeners.forEach(listener => listener(user));
  }

  // Kullanıcı durumu değişikliğini dinle
  onAuthStateChanged(listener) {
    this.listeners.add(listener);
    listener(this.currentUser);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  // E-posta/Şifre ile Giriş
  async signIn(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      
      this.currentUser = response.data.user;
      this.notifyListeners(this.currentUser);
      return this.currentUser;
    } catch (error) {
      console.error("Giriş hatası:", error);
      throw error;
    }
  }

  // E-posta/Şifre ile Kayıt
  async signUp(email, password, additionalInfo = {}) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
        ...additionalInfo
      });
      
      this.currentUser = response.data.user;
      this.notifyListeners(this.currentUser);
      return this.currentUser;
    } catch (error) {
      console.error("Kayıt hatası:", error);
      throw error;
    }
  }

  // Çıkış Yap
  async signOut() {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
      this.currentUser = null;
      this.notifyListeners(null);
    } catch (error) {
      console.error("Çıkış hatası:", error);
      throw error;
    }
  }

  // Mevcut kullanıcıyı al
  getCurrentUser() {
    return this.currentUser;
  }

  // Oturum durumunu kontrol et
  async checkAuthStatus() {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/status`);
      this.currentUser = response.data.user;
      this.notifyListeners(this.currentUser);
      return this.currentUser;
    } catch (error) {
      this.currentUser = null;
      this.notifyListeners(null);
      return null;
    }
  }
}

const authService = new AuthService();
export default authService;
