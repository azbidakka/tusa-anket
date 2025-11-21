import express from 'express';
import { db } from '../config/firebase.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { createAuditLog } from './auditLogs.js';

const router = express.Router();

// Tüm anketleri listele
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('survey_templates').get();
    const surveys = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Anket detayı
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const doc = await db.collection('survey_templates').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Anket bulunamadı' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Yeni anket oluştur
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const surveyData = {
      ...req.body,
      created_at: new Date().toISOString(),
      created_by: req.user.id
    };
    const docRef = await db.collection('survey_templates').add(surveyData);
    res.status(201).json({ id: docRef.id, ...surveyData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Anket güncelle
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await db.collection('survey_templates').doc(req.params.id).update({
      ...req.body,
      updated_at: new Date().toISOString()
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Anket sil
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await db.collection('survey_templates').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tüm anketleri sil (Audit log ile)
router.delete('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('survey_templates').get();
    const count = snapshot.size;
    
    // Audit log oluştur
    await createAuditLog('DELETE_ALL_SURVEYS', {
      count,
      reason: req.body.reason || 'No reason provided'
    }, req);
    
    // Tüm anketleri sil
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    
    console.log(`🗑️ Deleted ${count} surveys by ${req.user.email}`);
    res.json({ success: true, deleted: count });
  } catch (error) {
    console.error('Delete surveys error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
