import React, { useState } from 'react';
import authService from '../services/authService';

const AuthComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  // E-posta/Şifre ile Kayıt
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.signUp(email, password, {
        displayName: e.target.displayName?.value
      });
      console.log('Kayıt Başarılı:', user);
    } catch (err) {
      setError(err.message);
    }
  };

  // E-posta/Şifre ile Giriş
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.signIn(email, password);
      console.log('Giriş Başarılı:', user);
    } catch (err) {
      setError(err.message);
    }
  };

  // Google ile Giriş
  const handleGoogleSignIn = async () => {
    try {
      const user = await authService.signInWithGoogle();
      console.log('Google Girişi Başarılı:', user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={isLogin ? handleSignIn : handleSignUp}>
        {!isLogin && (
          <input 
            type="text" 
            name="displayName"
            placeholder="Kullanıcı Adı" 
            required={!isLogin} 
          />
        )}
        
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta" 
          required 
        />
        
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifre" 
          required 
        />
        
        <button type="submit">
          {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
        </button>
      </form>

      <button onClick={handleGoogleSignIn}>
        Google ile Giriş Yap
      </button>

      <p 
        onClick={() => setIsLogin(!isLogin)}
        style={{ cursor: 'pointer', color: 'blue' }}
      >
        {isLogin 
          ? 'Hesabınız yok mu? Kayıt olun' 
          : 'Zaten hesabınız var mı? Giriş yapın'}
      </p>
    </div>
  );
};

export default AuthComponent;
