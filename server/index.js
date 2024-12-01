const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// MySQL bağlantı havuzu
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'your_mysql_user',
  password: process.env.DB_PASSWORD || 'your_mysql_password',
  database: process.env.DB_NAME || 'gitabu_db'
});

// Auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token bulunamadı' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Geçersiz token' });
  }
};

// Auth endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    
    // Email kontrolü
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Bu email zaten kayıtlı' });
    }
    
    // Şifre hashleme
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Kullanıcı oluşturma
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, display_name) VALUES (?, ?, ?)',
      [email, hashedPassword, displayName]
    );
    
    const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET);
    
    res.json({
      user: {
        id: result.insertId,
        email,
        displayName
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Geçersiz şifre' });
    }
    
    const token = jwt.sign({ id: user.id, email }, JWT_SECRET);
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/status', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Repository endpoints
app.post('/api/repositories', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    
    const [result] = await pool.execute(
      'INSERT INTO repositories (name, description, user_id, created_at) VALUES (?, ?, ?, NOW())',
      [name, description, userId]
    );
    
    res.json({
      id: result.insertId,
      name,
      description,
      userId,
      createdAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/repositories', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [rows] = await pool.execute(
      'SELECT * FROM repositories WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/repositories/:id', authMiddleware, async (req, res) => {
  try {
    const repoId = req.params.id;
    const userId = req.user.id;
    
    const [result] = await pool.execute(
      'DELETE FROM repositories WHERE id = ? AND user_id = ?',
      [repoId, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Repository bulunamadı' });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/repositories/:id', authMiddleware, async (req, res) => {
  try {
    const repoId = req.params.id;
    const userId = req.user.id;
    const { name, description } = req.body;
    
    const [result] = await pool.execute(
      'UPDATE repositories SET name = ?, description = ? WHERE id = ? AND user_id = ?',
      [name, description, repoId, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Repository bulunamadı' });
    }
    
    res.json({
      id: repoId,
      name,
      description,
      userId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 