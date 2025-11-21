import bcrypt from 'bcryptjs';
import { db } from '../config/firebase.js';
import { DEFAULT_SURVEYS } from '../../../shared/defaultSurveys.js';

export async function seedOnStartup() {
  try {
    // Check if admin user exists
    const adminSnapshot = await db.collection('admin_users').doc('admin1').get();
    
    if (adminSnapshot.exists) {
      console.log('✅ Database already seeded - skipping');
      return;
    }

    console.log('🌱 Seeding database on startup (first time)...');

    // Admin kullanıcı oluştur
    const hashedPassword = await bcrypt.hash('TusaAdmin2024!', 10);
    await db.collection('admin_users').doc('admin1').set({
      email: 'admin@tusahastanesi.com',
      password_hash: hashedPassword,
      role: 'admin',
      created_at: new Date().toISOString()
    });
    console.log('✅ Admin user created');

    // Varsayılan anketleri oluştur
    for (const survey of DEFAULT_SURVEYS) {
      const surveyData = {
        ...survey,
        questions: survey.questions.map((q, idx) => ({ ...q, id: `q${idx + 1}` })),
        created_at: new Date().toISOString()
      };
      await db.collection('survey_templates').add(surveyData);
    }
    console.log('✅ Surveys created');

    // Örnek departmanlar
    const departments = [
      { name: 'Kardiyoloji', is_active: true },
      { name: 'Ortopedi', is_active: true },
      { name: 'Genel Cerrahi', is_active: true }
    ];

    for (const dept of departments) {
      await db.collection('departments').add(dept);
    }
    console.log('✅ Departments created');

    // Örnek doktorlar
    const doctors = [
      { full_name: 'Dr. Ahmet Yılmaz', department_id: 'dept1', is_active: true },
      { full_name: 'Dr. Ayşe Demir', department_id: 'dept2', is_active: true }
    ];

    for (const doctor of doctors) {
      await db.collection('doctors').add(doctor);
    }
    console.log('✅ Doctors created');

    // Varsayılan ayarlar
    await db.collection('settings').doc('general').set({
      organization_name: 'TUSA Hospital',
      logo_url: '',
      require_unique_token: true,
      enable_sms_otp: false,
      rate_limit_enabled: true
    });
    console.log('✅ Settings created');

    console.log('🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
}
