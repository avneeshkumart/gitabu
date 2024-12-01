import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { repoId, starCount } = req.body;

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db('github-stars');
    
    // Repo'nun yıldız sayısını güncelle veya yeni kayıt oluştur
    await db.collection('repos').updateOne(
      { repoId },
      { 
        $set: { 
          starCount,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    await client.close();
    res.status(200).json({ success: true, starCount });
  } catch (error) {
    console.error('Veritabanı hatası:', error);
    res.status(500).json({ error: error.message });
  }
} 