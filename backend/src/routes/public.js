import express from 'express';
import { db } from '../config/firebase.js';
import { surveySubmitLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Anket formunu getir (slug ile) - Token gerektirmez
router.get('/survey/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const snapshot = await db.collection('survey_templates')
      .where('slug', '==', slug)
      .where('is_active', '==', true)
      .get();
    
    if (snapshot.empty) {
      return res.status(404).json({ error: 'Anket bulunamadı veya aktif değil' });
    }
    
    const surveyDoc = snapshot.docs[0];
    const survey = { id: surveyDoc.id, ...surveyDoc.data() };
    
    // IP bazlı kontrol - GEÇİCİ OLARAK DEVRE DIŞI
    const clientIp = req.ip || req.connection.remoteAddress;
    console.log('📍 Survey request from IP:', clientIp);
    
    // const responseSnapshot = await db.collection('survey_responses')
    //   .where('template_id', '==', surveyDoc.id)
    //   .where('ip', '==', clientIp)
    //   .get();
    
    // console.log('📊 Previous responses from this IP:', responseSnapshot.size);
    
    // if (!responseSnapshot.empty) {
    //   // Daha önce doldurulmuş
    //   console.log('⚠️ Survey already submitted by this IP');
    //   return res.status(400).json({ 
    //     error: 'Bu anketi daha önce doldurdunuz. Teşekkür ederiz!',
    //     alreadySubmitted: true 
    //   });
    // }
    
    console.log('✅ Survey can be displayed (IP check disabled)');
    
    res.json(survey);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Anket gönder - Token gerektirmez
router.post('/survey/:slug/submit', surveySubmitLimiter, async (req, res) => {
  try {
    const { slug } = req.params;
    const { kvkk_consent, answers, department, doctor, patient_type } = req.body;
    
    if (!kvkk_consent) {
      return res.status(400).json({ error: 'KVKK onayı gerekli' });
    }
    
    const snapshot = await db.collection('survey_templates')
      .where('slug', '==', slug)
      .get();
    
    if (snapshot.empty) {
      return res.status(404).json({ error: 'Anket bulunamadı' });
    }
    
    const surveyDoc = snapshot.docs[0];
    const survey = surveyDoc.data();
    
    // IP bazlı tekrar gönderim kontrolü - GEÇİCİ OLARAK DEVRE DIŞI
    const clientIp = req.ip || req.connection.remoteAddress;
    console.log('📍 Submit request from IP:', clientIp);
    
    // const existingResponse = await db.collection('survey_responses')
    //   .where('template_id', '==', surveyDoc.id)
    //   .where('ip', '==', clientIp)
    //   .get();
    
    // console.log('📊 Existing responses:', existingResponse.size);
    
    // if (!existingResponse.empty) {
    //   console.log('⚠️ Duplicate submission blocked');
    //   return res.status(400).json({ 
    //     error: 'Bu anketi daha önce doldurdunuz.',
    //     alreadySubmitted: true 
    //   });
    // }
    
    console.log('✅ Submission allowed (IP check disabled)');
    
    const channel = 'Web'; // Token olmadığı için varsayılan kanal
    
    // NPS ve overall_score hesapla
    let nps = null;
    let overallScore = null;
    
    Object.entries(answers).forEach(([questionId, value]) => {
      const question = survey.questions.find(q => q.id === questionId);
      if (question) {
        if (question.type === 'nps_0_10') {
          nps = parseInt(value);
        }
        if (question.type === 'likert_5' && survey.auto_overall_score) {
          overallScore = (overallScore || 0) + parseInt(value);
        }
      }
    });
    
    if (overallScore && survey.auto_overall_score) {
      const likertCount = survey.questions.filter(q => q.type === 'likert_5').length;
      overallScore = overallScore / likertCount;
    }
    
    // Response kaydet
    const responseData = {
      template_id: surveyDoc.id,
      submitted_at: new Date().toISOString(),
      channel,
      department,
      doctor,
      patient_type,
      nps,
      overall_score: overallScore,
      ip: clientIp,
      user_agent: req.headers['user-agent'] || 'Unknown'
    };
    
    // Cevapları da response içine kaydet
    responseData.answers = answers;
    
    // Firestore için undefined değerleri temizle
    Object.keys(responseData).forEach(key => {
      if (responseData[key] === undefined || responseData[key] === null) {
        delete responseData[key];
      }
    });
    
    const responseRef = await db.collection('survey_responses').add(responseData);
    
    // Response items kaydet (ayrı koleksiyon)
    const itemPromises = Object.entries(answers).map(([questionId, value]) => {
      return db.collection('response_items').add({
        response_id: responseRef.id,
        question_id: questionId,
        value,
        created_at: new Date().toISOString()
      });
    });
    
    await Promise.all(itemPromises);
    
    console.log('Response saved:', responseRef.id);
    console.log('Items saved:', Object.keys(answers).length);
    
    res.status(201).json({ success: true, id: responseRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
