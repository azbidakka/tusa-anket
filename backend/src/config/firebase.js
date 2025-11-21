import admin from 'firebase-admin';

// Global mock data store (singleton)
const globalMockData = new Map();

// Firebase Admin SDK başlatma
// Üretimde serviceAccountKey.json kullanın
let db;

try {
  if (!admin.apps.length) {
    // Firebase bilgilerini kontrol et
    const hasFirebaseConfig = process.env.FIREBASE_PROJECT_ID && 
                              process.env.FIREBASE_PRIVATE_KEY && 
                              process.env.FIREBASE_CLIENT_EMAIL;
    
    if (hasFirebaseConfig) {
      console.log('🔥 Initializing Firebase with project:', process.env.FIREBASE_PROJECT_ID);
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        })
      });
      db = admin.firestore();
      console.log('✅ Firebase Firestore connected successfully!');
    } else {
      console.log('⚠️  Firebase mock mode - Geliştirme için in-memory veri kullanılıyor');
      console.log('   FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'SET' : 'NOT SET');
      db = createMockFirestore();
    }
  } else {
    db = admin.firestore();
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
  console.log('⚠️  Falling back to mock mode');
  db = createMockFirestore();
}

// Mock Firestore (geliştirme için)
function createMockFirestore() {
  const mockData = globalMockData; // Use global store
  
  return {
    collection: (name) => ({
      doc: (id) => ({
        get: async () => {
          const data = mockData.get(`${name}/${id}`);
          return {
            exists: !!data,
            id,
            data: () => data
          };
        },
        set: async (data) => {
          mockData.set(`${name}/${id}`, data);
        },
        update: async (data) => {
          const existing = mockData.get(`${name}/${id}`) || {};
          mockData.set(`${name}/${id}`, { ...existing, ...data });
        },
        delete: async () => {
          mockData.delete(`${name}/${id}`);
        }
      }),
      add: async (data) => {
        const id = Date.now().toString();
        mockData.set(`${name}/${id}`, { ...data, id });
        return { id };
      },
      where: (field, op, value) => ({
        get: async () => {
          const docs = Array.from(mockData.entries())
            .filter(([key]) => key.startsWith(`${name}/`))
            .filter(([key, data]) => {
              if (op === '==') return data[field] === value;
              if (op === '!=') return data[field] !== value;
              if (op === '>') return data[field] > value;
              if (op === '<') return data[field] < value;
              if (op === '>=') return data[field] >= value;
              if (op === '<=') return data[field] <= value;
              return true;
            })
            .map(([key, data]) => ({
              id: key.split('/')[1],
              data: () => data,
              exists: true
            }));
          
          return {
            docs,
            empty: docs.length === 0
          };
        },
        where: (field2, op2, value2) => ({
          get: async () => {
            const docs = Array.from(mockData.entries())
              .filter(([key]) => key.startsWith(`${name}/`))
              .filter(([key, data]) => {
                const check1 = op === '==' ? data[field] === value : true;
                const check2 = op2 === '==' ? data[field2] === value2 : true;
                return check1 && check2;
              })
              .map(([key, data]) => ({
                id: key.split('/')[1],
                data: () => data,
                exists: true
              }));
            
            return {
              docs,
              empty: docs.length === 0
            };
          }
        })
      }),
      get: async () => ({
        docs: Array.from(mockData.entries())
          .filter(([key]) => key.startsWith(`${name}/`))
          .map(([key, data]) => ({
            id: key.split('/')[1],
            data: () => data,
            exists: true
          })),
        empty: false
      })
    })
  };
}

export { db, admin };
