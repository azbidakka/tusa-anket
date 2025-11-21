// Tema Sabitleri
export const THEME = {
  colors: {
    primary: '#0A6A39',
    primaryDark: '#084F2A',
    accent: '#1E7D4E',
    bgLight: '#F8FAFC',
    border: '#E5E7EB',
    textDark: '#0B1320'
  },
  fonts: {
    family: 'Poppins, sans-serif'
  }
};

// Soru Tipleri
export const QUESTION_TYPES = {
  LIKERT_5: 'likert_5',
  NPS_0_10: 'nps_0_10',
  MULTIPLE_SINGLE: 'multiple_single',
  MULTIPLE_MULTI: 'multiple_multi',
  YES_NO: 'yes_no',
  SHORT_TEXT: 'short_text',
  LONG_TEXT: 'long_text',
  DATE: 'date'
};

// Likert Etiketleri
export const LIKERT_LABELS = {
  1: 'Kesinlikle Katılmıyorum',
  2: 'Katılmıyorum',
  3: 'Kararsızım',
  4: 'Katılıyorum',
  5: 'Tamamen Katılıyorum'
};

// NPS Kategorileri
export const NPS_CATEGORIES = {
  DETRACTOR: { min: 0, max: 6, label: 'Eleştirmen' },
  PASSIVE: { min: 7, max: 8, label: 'Pasif' },
  PROMOTER: { min: 9, max: 10, label: 'Destekleyen' }
};

// Kanallar
export const CHANNELS = ['SMS', 'WhatsApp', 'E-posta', 'QR'];

// Hasta Tipleri
export const PATIENT_TYPES = ['Ayaktan', 'Yatan', 'Acil'];

// KVKK Metni
export const KVKK_TEXT = 'Paylaştığınız veriler hizmet kalitemizi geliştirmek amacıyla anonim olarak değerlendirilecektir. Aydınlatma metnini okuyup anladım.';

// KVKK Aydınlatma Metni - Detaylı versiyonu
import { KVKK_AYDINLATMA_METNI as KVKK_AYDINLATMA_METNI_IMPORT } from './kvkkAydinlatmaMetni.js';
export const KVKK_AYDINLATMA_METNI = KVKK_AYDINLATMA_METNI_IMPORT;

// Hata Mesajları
export const ERROR_MESSAGES = {
  REQUIRED_FIELDS: 'Zorunlu alanları doldurunuz.',
  EXPIRED_LINK: 'Bu bağlantının süresi dolmuş.',
  ALREADY_SUBMITTED: 'Bu anket zaten doldurulmuş.',
  INVALID_TOKEN: 'Geçersiz bağlantı.',
  RATE_LIMIT: 'Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.'
};

export default {
  THEME,
  QUESTION_TYPES,
  LIKERT_LABELS,
  NPS_CATEGORIES,
  CHANNELS,
  PATIENT_TYPES,
  KVKK_TEXT,
  KVKK_AYDINLATMA_METNI,
  ERROR_MESSAGES
};
