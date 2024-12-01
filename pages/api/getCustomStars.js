import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db('github-stars');
    
    const customStars = await db.collection('repos').find({}).toArray();
    
    // Repo ID'lerini key olarak kullanan bir obje oluştur
    const starsMap = customStars.reduce((acc, curr) => {
      acc[curr.repoId] = curr;
      return acc;
    }, {});

    await client.close();
    res.status(200).json(starsMap);
  } catch (error) {
    console.error('Veritabanı hatası:', error);
    res.status(500).json({ error: error.message });
  }
} 