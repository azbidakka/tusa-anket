import { QUESTION_TYPES } from './index.js';

export const DEFAULT_SURVEYS = [
  {
    name: 'Ayaktan Hasta Anketi',
    slug: 'ayaktan-hasta',
    description: 'Poliklinik hizmetlerimiz hakkındaki görüşleriniz',
    is_active: true,
    require_unique_token: true,
    allow_multiple_submissions: false,
    auto_overall_score: true,
    auto_nps: true,
    sections: [
      { title: 'Kayıt & Karşılama', description: 'İlk karşılama deneyiminiz' },
      { title: 'Hekim Görüşmesi', description: 'Doktor muayenesi' },
      { title: 'Fiziksel Ortam', description: 'Hastane ortamı' },
      { title: 'Genel Değerlendirme', description: 'Genel görüşleriniz' }
    ],
    questions: [
      {
        section_title: 'Kayıt & Karşılama',
        order: 1,
        type: QUESTION_TYPES.LIKERT_5,
        text: 'Kayıt işlemleri ve yönlendirme hizmetinden memnuniyetiniz',
        is_required: true,
        topic_tag: 'kayit_yonlendirme'
      },
      {
        section_title: 'Kayıt & Karşılama',
        order: 2,
        type: QUESTION_TYPES.LIKERT_5,
        text: 'Bekleme süresi',
        is_required: true,
        topic_tag: 'bekleme_suresi'
      },
      {
        section_title: 'Hekim Görüşmesi',
        order: 3,
        type: QUESTION_TYPES.LIKERT_5,
        text: 'Hekimin açıklamalarının anlaşılır olması',
        is_required: true,
        topic_tag: 'hekim_aciklama'
      },
      {
        section_title: 'Hekim Görüşmesi',
        order: 4,
        type: QUESTION_TYPES.LIKERT_5,
        text: 'Hekimin iletişimi ve ilgisi',
        is_required: true,
        topic_tag: 'hekim_iletisim'
      },
      {
        section_title: 'Fiziksel Ortam',
        order: 5,
        type: QUESTION_TYPES.LIKERT_5,
        text: 'Temizlik ve hijyen',
        is_required: true,
        topic_tag: 'temizlik'
      },
      {
        section_title: 'Fiziksel Ortam',
        order: 6,
        type: QUESTION_TYPES.LIKERT_5,
        text: 'Yönlendirme tabelaları',
        is_required: true,
        topic_tag: 'tabelalar'
      },
      {
        section_title: 'Genel Değerlendirme',
        order: 7,
        type: QUESTION_TYPES.YES_NO,
        text: 'Hastanemizi tekrar tercih eder misiniz?',
        is_required: true,
        topic_tag: 'tekrar_tercih'
      },
      {
        section_title: 'Genel Değerlendirme',
        order: 8,
        type: QUESTION_TYPES.SHORT_TEXT,
        text: 'Geliştirme öneriniz',
        is_required: false,
        topic_tag: 'oneri'
      },
      {
        section_title: 'Genel Değerlendirme',
        order: 9,
        type: QUESTION_TYPES.NPS_0_10,
        text: 'Hastanemizi bir yakınınıza tavsiye etme olasılığınız (0-10)',
        is_required: true,
        topic_tag: 'nps'
      }
    ]
  },
  {
    name: 'Yatan Hasta Anketi',
    slug: 'yatan-hasta',
    description: 'Yatarak tedavi hizmetlerimiz hakkındaki görüşleriniz',
    is_active: true,
    require_unique_token: true,
    allow_multiple_submissions: false,
    auto_overall_score: true,
    auto_nps: true,
    sections: [
      { title: 'Hemşirelik Hizmetleri', description: 'Hemşire bakımı' },
      { title: 'Hekim Hizmetleri', description: 'Doktor takibi' },
      { title: 'Oda & Yemek', description: 'Konaklama ve beslenme' },
      { title: 'Genel Değerlendirme', description: 'Genel görüşleriniz' }
    ],
    questions: [
      {
        section_title: 'Hemşirelik Hizmetleri',
        order: 1,
        type: QUESTION_TYPES.LIKERT_5,
        text: 'Hemşirelerin yaklaşımı ve bilgilendirmesi',
        is_required: true,
        topic_tag: 'hemsire_yaklasim'
      },
      {
        section_title: 'Hemşirelik Hizmetleri',
        order: 2,
        type: QUESTION_TYPES.LIKERT_5,
        text: 'İhtiyaçlarınıza zamanında yanıt verilmesi',
        is_required: true,
        topic_tag: 'hemsire_hiz'
      },
      {
        section_title: 'Hekim Hizmetleri',
        order: 3,
        type: QUESTION_TYPES.LIKERT_5,
        text: 'Tedavi sürecinin paylaşılması',
        is_required: true,
        topic_tag: 'hekim_bilgilendirme'
      },
      {
        section_title: 'Hekim Hizmetleri',
        order: 4,
        type: QUESTION_TYPES.LIKERT_5,
        text: 'Hekime duyulan güven',
        is_required: true,
        topic_tag: 'hekim_guven'
      },
      {
        section_title: 'Oda & Yemek',
        order: 5,
        type: QUESTION_TYPES.LIKERT_5,
        text: 'Oda konforu ve temizliği',
        is_required: true,
        topic_tag: 'oda_konfor'
      },
      {
        section_title: 'Oda & Yemek',
        order: 6,
        type: QUESTION_TYPES.LIKERT_5,
        text: 'Yemek kalitesi',
        is_required: true,
        topic_tag: 'yemek'
      },
      {
        section_title: 'Genel Değerlendirme',
        order: 7,
        type: QUESTION_TYPES.YES_NO,
        text: 'Taburculuk süreci yeterli miydi?',
        is_required: true,
        topic_tag: 'taburculuk'
      },
      {
        section_title: 'Genel Değerlendirme',
        order: 8,
        type: QUESTION_TYPES.LONG_TEXT,
        text: 'Görüş ve önerileriniz',
        is_required: false,
        topic_tag: 'gorus'
      },
      {
        section_title: 'Genel Değerlendirme',
        order: 9,
        type: QUESTION_TYPES.NPS_0_10,
        text: 'Hastanemizi bir yakınınıza tavsiye etme olasılığınız (0-10)',
        is_required: true,
        topic_tag: 'nps'
      }
    ]
  },
  {
    name: 'Genel Memnuniyet Anketi',
    slug: 'genel-memnuniyet',
    description: 'Genel hizmet kalitemiz hakkındaki görüşleriniz',
    is_active: true,
    require_unique_token: true,
    allow_multiple_submissions: false,
    auto_overall_score: true,
    auto_nps: true,
    sections: [
      { title: 'Hizmet Kalitesi', description: 'Genel hizmet değerlendirmesi' },
      { title: 'İletişim', description: 'Personel iletişimi' },
      { title: 'Erişilebilirlik', description: 'Hizmete ulaşım' },
      { title: 'Genel Değerlendirme', description: 'Genel görüşleriniz' }
    ],
    questions: [
      {
        section_title: 'Hizmet Kalitesi',
        order: 1,
        type: QUESTION_TYPES.LIKERT_5,
        text: 'Genel hizmet kalitesi',
        is_required: true,
        topic_tag: 'hizmet_kalite'
      },
      {
        section_title: 'Hizmet Kalitesi',
        order: 2,
        type: QUESTION_TYPES.LIKERT_5,
        text: 'Fiyat/performans dengesi',
        is_required: true,
        topic_tag: 'fiyat_performans'
      },
      {
        section_title: 'İletişim',
        order: 3,
        type: QUESTION_TYPES.LIKERT_5,
        text: 'Personelin nezaketi',
        is_required: true,
        topic_tag: 'personel_nezaket'
      },
      {
        section_title: 'Erişilebilirlik',
        order: 4,
        type: QUESTION_TYPES.LIKERT_5,
        text: 'Randevu ve hizmete erişim kolaylığı',
        is_required: true,
        topic_tag: 'erisim'
      },
      {
        section_title: 'Genel Değerlendirme',
        order: 5,
        type: QUESTION_TYPES.SHORT_TEXT,
        text: 'En beğendiğiniz yön',
        is_required: false,
        topic_tag: 'begeni'
      },
      {
        section_title: 'Genel Değerlendirme',
        order: 6,
        type: QUESTION_TYPES.SHORT_TEXT,
        text: 'Geliştirilmesini istediğiniz alan',
        is_required: false,
        topic_tag: 'gelistirme'
      },
      {
        section_title: 'Genel Değerlendirme',
        order: 7,
        type: QUESTION_TYPES.NPS_0_10,
        text: 'Hastanemizi bir yakınınıza tavsiye etme olasılığınız (0-10)',
        is_required: true,
        topic_tag: 'nps'
      }
    ]
  }
];
