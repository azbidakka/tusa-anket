import express from 'express';
import { db } from '../config/firebase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Audit log oluştur
export const createAuditLog = async (action, details, req) => {
  try {
    const logData = {
      action, // 'DELETE_RESPONSES', 'DELETE_SURVEYS', 'LOGIN', 'LOGOUT', etc.
      details, // İşlem detayları
      user_email: req.user?.email || 'Unknown',
      user_id: req.user?.id || null,
      ip_address: req.ip || req.connection.remoteAddress || 'Unknown',
      user_agent: req.headers['user-agent'] || 'Unknown',
      timestamp: new Date().toISOString(),
      // MAC adresi client-side'dan alınmalı (güvenlik nedeniyle server'dan alınamaz)
      client_info: {
        platform: req.headers['sec-ch-ua-platform'] || 'Unknown',
        browser: req.headers['sec-ch-ua'] || 'Unknown'
      }
    };

    await db.collection('audit_logs').add(logData);
    console.log('📝 Audit log created:', action);
  } catch (error) {
    console.error('❌ Audit log error:', error);
    // Log hatası işlemi durdurmaz
  }
};

// Tüm logları getir (sadece admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { limit = 100, offset = 0, action } = req.query;
    
    let query = db.collection('audit_logs')
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset));
    
    if (action) {
      query = query.where('action', '==', action);
    }
    
    const snapshot = await query.get();
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Log istatistikleri
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const snapshot = await db.collection('audit_logs').get();
    const logs = snapshot.docs.map(doc => doc.data());
    
    const stats = {
      total: logs.length,
      byAction: {},
      byUser: {},
      last24Hours: 0
    };
    
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    logs.forEach(log => {
      // Action bazlı
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;
      
      // User bazlı
      stats.byUser[log.user_email] = (stats.byUser[log.user_email] || 0) + 1;
      
      // Son 24 saat
      if (log.timestamp > yesterday) {
        stats.last24Hours++;
      }
    });
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Belirli bir kullanıcının logları
router.get('/user/:email', authenticateToken, async (req, res) => {
  try {
    const { email } = req.params;
    
    const snapshot = await db.collection('audit_logs')
      .where('user_email', '==', email)
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();
    
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
