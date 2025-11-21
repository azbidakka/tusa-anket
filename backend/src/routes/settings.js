import express from 'express';
import { db } from '../config/firebase.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Ayarları getir
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const doc = await db.collection('settings').doc('general').get();
    res.json(doc.exists ? doc.data() : {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ayarları güncelle
router.put('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await db.collection('settings').doc('general').set(req.body, { merge: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Departmanları listele
router.get('/departments', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('departments').get();
    const departments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Doktorları listele
router.get('/doctors', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('doctors').get();
    const doctors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
