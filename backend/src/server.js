import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import surveyRoutes from './routes/surveys.js';
import responseRoutes from './routes/responses.js';
import linkRoutes from './routes/links.js';
import settingsRoutes from './routes/settings.js';
import publicRoutes from './routes/public.js';
import aiRoutes from './routes/ai.js';
import auditLogRoutes from './routes/auditLogs.js';
import { errorHandler } from './middleware/errorHandler.js';
import { seedOnStartup } from './utils/seedOnStartup.js';

// ES modules için __dirname alternatifi
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env dosyasını yükle
dotenv.config({ path: join(__dirname, '../.env') });

console.log('🔧 Environment loaded:');
console.log('   PORT:', process.env.PORT);
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID || 'NOT SET');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/audit-logs', auditLogRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`🚀 TUSA Survey Backend running on port ${PORT}`);
  
  // Seed database on startup (mock mode only)
  await seedOnStartup();
});
