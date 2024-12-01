import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase yapılandırma bilgileri - Firebase konsolundan kopyalayın
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firestore ve Authentication örnekleri
export const db = getFirestore(app);
export const auth = getAuth(app);

// Google Authentication sağlayıcısı
export const googleProvider = new GoogleAuthProvider();

export default app;
