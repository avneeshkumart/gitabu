import fs from 'fs';
import path from 'path';

const avatarFilePath = path.join(process.cwd(), 'src/data/avatars.json');

export const saveAvatar = async (req, res) => {
  try {
    const { username, avatarUrl } = req.body;
    
    // Mevcut avatar verilerini oku
    const avatarData = JSON.parse(fs.readFileSync(avatarFilePath, 'utf8'));
    
    // Avatar'ı güncelle
    avatarData[username] = {
      avatarUrl,
      lastUpdated: new Date().toISOString()
    };
    
    // Dosyaya kaydet
    fs.writeFileSync(avatarFilePath, JSON.stringify(avatarData, null, 2));
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Avatar kaydetme hatası:', error);
    res.status(500).json({ error: 'Avatar kaydedilemedi' });
  }
};

export const getAvatar = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Avatar verilerini oku
    const avatarData = JSON.parse(fs.readFileSync(avatarFilePath, 'utf8'));
    
    // Kullanıcının avatar'ını döndür
    res.status(200).json(avatarData[username] || { avatarUrl: null });
  } catch (error) {
    console.error('Avatar okuma hatası:', error);
    res.status(500).json({ error: 'Avatar okunamadı' });
  }
}; 