import express from 'express';
import { saveAvatar, getAvatar } from './avatar';

const router = express.Router();

// Avatar route'ları
router.post('/api/avatar', saveAvatar);
router.get('/api/avatar/:username', getAvatar);

export default router; 