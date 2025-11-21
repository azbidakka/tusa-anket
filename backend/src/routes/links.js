import express from 'express';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import { db } from '../config/firebase.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Link oluştur
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { template_id, label, channel, expires_at, utm_source, utm_campaign, unique } = req.body;
    
    const token = unique !== false ? nanoid(16) : null;
    const surveyDomain = process.env.SURVEY_DOMAIN || 'http://localhost:5173';
    
    const templateDoc = await db.collection('survey_templates').doc(template_id).get();
    if (!templateDoc.exists) {
      return res.status(404).json({ error: 'Anket bulunamadı' });
    }
    
    const template = templateDoc.data();
    let url = `${surveyDomain}/s/${template.slug}`;
    
    if (token) {
      url += `?token=${token}`;
    }
    
    const params = new URLSearchParams();
    if (utm_source) params.append('utm_source', utm_source);
    if (utm_campaign) params.append('utm_campaign', utm_campaign);
    if (params.toString()) {
      url += (token ? '&' : '?') + params.toString();
    }
    
    // Firestore için undefined değerleri temizle
    const linkData = {
      template_id,
      label: label || 'Genel Link',
      channel: channel || 'QR',
      url,
      created_at: new Date().toISOString(),
      created_by: req.user.id
    };
    
    // Sadece tanımlı değerleri ekle
    if (token) linkData.token = token;
    if (expires_at) linkData.expires_at = expires_at;
    if (utm_source) linkData.utm_source = utm_source;
    if (utm_campaign) linkData.utm_campaign = utm_campaign;
    
    const docRef = await db.collection('survey_links').add(linkData);
    res.status(201).json({ id: docRef.id, ...linkData });
  } catch (error) {
    console.error('Link creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// QR kod oluştur
router.post('/qr', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { url } = req.body;
    const qrCode = await QRCode.toDataURL(url, { width: 300, margin: 2 });
    res.json({ qrCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Linkleri listele
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { template_id } = req.query;
    let query = db.collection('survey_links');
    
    if (template_id) {
      query = query.where('template_id', '==', template_id);
    }
    
    const snapshot = await query.get();
    const links = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
