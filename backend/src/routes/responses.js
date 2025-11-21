import express from 'express';
import { db } from '../config/firebase.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { createAuditLog } from './auditLogs.js';

const router = express.Router();

// Cevapları listele
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { template_id, start_date, end_date, department, doctor, channel } = req.query;
    
    let query = db.collection('survey_responses');
    
    if (template_id) {
      query = query.where('template_id', '==', template_id);
    }
    
    const snapshot = await query.get();
    let responses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Filtreleme
    if (start_date) {
      responses = responses.filter(r => r.submitted_at >= start_date);
    }
    if (end_date) {
      responses = responses.filter(r => r.submitted_at <= end_date);
    }
    if (department) {
      responses = responses.filter(r => r.department === department);
    }
    if (doctor) {
      responses = responses.filter(r => r.doctor === doctor);
    }
    if (channel) {
      responses = responses.filter(r => r.channel === channel);
    }
    
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cevap detayı
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const doc = await db.collection('survey_responses').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Cevap bulunamadı' });
    }
    
    const response = { id: doc.id, ...doc.data() };
    
    // Önce response_items koleksiyonundan dene
    const itemsSnapshot = await db.collection('response_items')
      .where('response_id', '==', req.params.id)
      .get();
    
    if (itemsSnapshot.docs.length > 0) {
      // response_items koleksiyonundan geldi
      response.items = itemsSnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data };
      });
    } else if (response.answers) {
      // Mock mode: answers direkt response içinde
      response.items = Object.entries(response.answers).map(([question_id, value]) => ({
        question_id,
        value,
        response_id: req.params.id
      }));
    } else {
      response.items = [];
    }
    
    console.log('Response detail - Items count:', response.items.length);
    
    res.json(response);
  } catch (error) {
    console.error('Response detail error:', error);
    res.status(500).json({ error: error.message });
  }
});

// İstatistikler
router.get('/stats/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const snapshot = await db.collection('survey_responses').get();
    const allResponses = snapshot.docs.map(doc => doc.data());
    
    const thisMonthResponses = allResponses.filter(r => new Date(r.submitted_at) >= thisMonth);
    const lastMonthResponses = allResponses.filter(r => 
      new Date(r.submitted_at) >= lastMonth && new Date(r.submitted_at) < thisMonth
    );
    
    const avgSatisfaction = thisMonthResponses.reduce((sum, r) => sum + (r.overall_score || 0), 0) / thisMonthResponses.length || 0;
    const avgNPS = thisMonthResponses.reduce((sum, r) => sum + (r.nps || 0), 0) / thisMonthResponses.length || 0;
    
    const changePercent = lastMonthResponses.length > 0
      ? ((thisMonthResponses.length - lastMonthResponses.length) / lastMonthResponses.length) * 100
      : 0;
    
    res.json({
      totalResponses: thisMonthResponses.length,
      changePercent: Math.round(changePercent * 10) / 10,
      avgSatisfaction: Math.round(avgSatisfaction * 10) / 10,
      avgNPS: Math.round(avgNPS * 10) / 10
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tüm cevapları sil (Audit log ile)
router.delete('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('survey_responses').get();
    const count = snapshot.size;
    
    // Audit log oluştur
    await createAuditLog('DELETE_ALL_RESPONSES', {
      count,
      reason: req.body.reason || 'No reason provided'
    }, req);
    
    // Tüm cevapları sil
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    
    // Response items'ları da sil
    const itemsSnapshot = await db.collection('response_items').get();
    const itemsBatch = db.batch();
    itemsSnapshot.docs.forEach(doc => {
      itemsBatch.delete(doc.ref);
    });
    await itemsBatch.commit();
    
    console.log(`🗑️ Deleted ${count} responses by ${req.user.email}`);
    res.json({ success: true, deleted: count });
  } catch (error) {
    console.error('Delete responses error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
